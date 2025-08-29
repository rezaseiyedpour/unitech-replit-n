# -*- coding: utf-8 -*-
"""
Unitech3D — Minimal stdlib WSGI server with corrected pricing model.
- File upload via cgi.FieldStorage (works on Python<=3.12; shows DeprecationWarning, safe to ignore now)
- STL ASCII volume estimation
- Price = material + machine time + setup, with min job and optional support factor
- Saves a simple 2D preview (matplotlib) to static/previews/
"""

import os, io, sys, json, cgi
from wsgiref.simple_server import make_server
from urllib.parse import unquote

# ===== Pricing configuration (edit to your rates) =====
CURRENCY = "ریال"   # یا "ریال" / "€" / ...
MATERIAL_COST_PER_KG = {  # هزینه هر کیلو
    "PLA":   15_000_000,   # نمونه: 15 میلیون ریال
    "ABS":   10_000_000,
    "PETG":  10_500_000,
    "Nylon": 9_000_000,
}
DENSITY_G_CM3 = {  # چگالی (g/cm^3)
    "PLA":   1.24,
    "ABS":   1.05,
    "PETG":  1.27,
    "Nylon": 1.14,
}
# ضریب پوسته نسبت به حجم سالید
SHELL_FACTOR_BY_QUALITY = {
    "draft":   0.12,   # پیش‌نویس
    "normal":  0.18,   # معمولی
    "high":    0.25,   # کیفیت بالا
}
# بازده پرشدگی
INFILL_EFFICIENCY = 1.00

# نرخ دبی تقریبی (mm^3/s)
FLOW_RATE_MM3_S = {
    "draft":   12.0,
    "normal":   8.0,
    "high":     4.0,
}

MACHINE_RATE_PER_HOUR = 500_000   # ریال/ساعت
SETUP_FEE = 300_000                # هزینه راه‌اندازی
MIN_JOB_PRICE = 1_500_000           # حداقل مبلغ سفارش
SUPPORT_FACTOR = 0.10            # سهم تقریبی ساپورت (0=غیرفعال)
# ======================================================

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
PREVIEW_DIR = os.path.join(STATIC_DIR, "previews")
os.makedirs(PREVIEW_DIR, exist_ok=True)

# ============== STL parsing & volume ==================
def _triangles_from_ascii_stl(text):
    """Return list of triangles; each triangle is a tuple of 3 vertices,
    each vertex is (x,y,z) in mm. Very simple ASCII STL parser."""
    tris = []
    verts = []
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        if line.lower().startswith("vertex"):
            parts = line.split()
            try:
                x, y, z = float(parts[1]), float(parts[2]), float(parts[3])
                verts.append((x, y, z))
                if len(verts) == 3:
                    tris.append(tuple(verts))
                    verts = []
            except Exception:
                verts = []
    return tris

def _signed_tet_volume(v0, v1, v2):
    """Signed volume of tetrahedron formed by triangle (v0,v1,v2) and origin."""
    # Volume = dot(v0, cross(v1, v2)) / 6
    x0,y0,z0 = v0; x1,y1,z1 = v1; x2,y2,z2 = v2
    cx = y1*z2 - z1*y2
    cy = z1*x2 - x1*z2
    cz = x1*y2 - y1*x2
    return (x0*cx + y0*cy + z0*cz) / 6.0

def stl_volume_mm3_and_preview(file_bytes, preview_path):
    """
    Parse ASCII STL from bytes, compute solid volume in mm^3, render simple XY preview.
    If parsing fails, returns (0.0, False) and no preview.
    """
    try:
        text = file_bytes.decode("utf-8", errors="ignore")
    except Exception:
        return 0.0, False

    tris = _triangles_from_ascii_stl(text)
    if not tris:
        return 0.0, False

    # Compute volume (absolute of sum of signed tetra volumes)
    vol = 0.0
    for v0, v1, v2 in tris:
        vol += _signed_tet_volume(v0, v1, v2)
    volume_mm3 = abs(vol)

    # Draw simple 2D preview (projection on XY)
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        plt.figure(figsize=(4.2, 4.0), dpi=150)
        ax = plt.gca()
        ax.set_aspect("equal", adjustable="box")
        for v0, v1, v2 in tris[:2000]:  # limit for speed
            xs = [v0[0], v1[0], v2[0], v0[0]]
            ys = [v0[1], v1[1], v2[1], v0[1]]
            ax.plot(xs, ys, linewidth=0.4)
        ax.set_xticks([]); ax.set_yticks([])
        plt.tight_layout()
        plt.savefig(preview_path, bbox_inches="tight", pad_inches=0.02)
        plt.close()
        have_preview = True
    except Exception:
        have_preview = False

    return float(volume_mm3), have_preview

# ============== Pricing ===============================
def estimate_price_breakdown(volume_mm3: float, material: str, quality: str, infill_percent: float):
    """
    volume_mm3: حجم سالید مدل (mm^3)
    material: PLA/ABS/PETG/Nylon
    quality: draft/normal/high
    infill_percent: 0..100
    """
    # 1) حجم اکسترود شده ≈ سهم پوسته + سهم اینفیل (+ ساپورت)
    shell_factor = SHELL_FACTOR_BY_QUALITY.get(quality, SHELL_FACTOR_BY_QUALITY["normal"])
    infill_frac  = max(0.0, min(1.0, infill_percent / 100.0))
    effective_frac = shell_factor + (infill_frac * INFILL_EFFICIENCY)
    support_multiplier = 1.0 + max(0.0, SUPPORT_FACTOR)

    extruded_mm3 = volume_mm3 * effective_frac * support_multiplier

    # 2) جرم مواد (g): تبدیل mm^3 -> cm^3 (1 cm^3 = 1000 mm^3) × چگالی
    density = DENSITY_G_CM3.get(material, DENSITY_G_CM3["PLA"])
    mass_g = (extruded_mm3 / 1000.0) * density

    # 3) هزینه مواد
    per_kg = MATERIAL_COST_PER_KG.get(material, MATERIAL_COST_PER_KG["PLA"])
    material_cost = (mass_g / 1000.0) * per_kg

    # 4) زمان پرینت (h) ≈ حجم اکسترود / دبی
    flow = FLOW_RATE_MM3_S.get(quality, FLOW_RATE_MM3_S["normal"])
    flow = max(flow, 0.001)  # جلوگیری از تقسیم بر صفر
    time_hours = extruded_mm3 / (flow * 3600.0)
    time_cost = time_hours * MACHINE_RATE_PER_HOUR

    # 5) جمع + حداقل سفارش + راه‌اندازی
    subtotal = material_cost + time_cost + SETUP_FEE
    total = max(subtotal, MIN_JOB_PRICE)

    return {
        "volume_mm3": float(volume_mm3),
        "extruded_mm3": float(extruded_mm3),
        "mass_g": float(mass_g),
        "material_cost": float(material_cost),
        "time_hours": float(time_hours),
        "time_cost": float(time_cost),
        "setup_fee": SETUP_FEE,
        "min_job_applied": total > subtotal,
        "total": float(total),
        "currency": CURRENCY,
    }

# ============== WSGI application ======================
INDEX_PATHS = [
    os.path.join(BASE_DIR, "templates", "index.html"),
    os.path.join(BASE_DIR, "index.html"),
]

def _serve_file(path, start_response, content_type="text/html; charset=utf-8"):
    if not os.path.isfile(path):
        start_response("404 Not Found", [("Content-Type", "text/plain; charset=utf-8")])
        return [b"Not found"]
    with open(path, "rb") as f:
        data = f.read()
    start_response("200 OK", [("Content-Type", content_type)])
    return [data]

def application(environ, start_response):
    method = environ.get("REQUEST_METHOD", "GET").upper()
    path = unquote(environ.get("PATH_INFO", "/"))

    # Static files
    if path.startswith("/static/"):
        rel = path.lstrip("/")
        fpath = os.path.join(BASE_DIR, rel.replace("/", os.sep))
        # Guess content-type minimally
        if fpath.lower().endswith(".png"): ctype = "image/png"
        elif fpath.lower().endswith(".jpg") or fpath.lower().endswith(".jpeg"): ctype = "image/jpeg"
        elif fpath.lower().endswith(".css"): ctype = "text/css; charset=utf-8"
        elif fpath.lower().endswith(".js"): ctype = "application/javascript; charset=utf-8"
        else: ctype = "application/octet-stream"
        return _serve_file(fpath, start_response, ctype)

    # Home page
    if method == "GET" and path == "/":
        for ipath in INDEX_PATHS:
            if os.path.isfile(ipath):
                return _serve_file(ipath, start_response, "text/html; charset=utf-8")
        # Fallback minimal page if index.html not found
        html = """<!doctype html><meta charset="utf-8">
        <title>Unitech3D</title>
        <h3>Unitech3D – سرور در حال اجراست</h3>
        <p>فایل index.html پیدا نشد. لطفاً فایل‌های فرانت را در پوشهٔ پروژه قرار دهید.</p>
        """
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
        return [html.encode("utf-8")]

    # Calculate endpoint
    if method == "POST" and path == "/calculate":
        try:
            form = cgi.FieldStorage(fp=environ["wsgi.input"], environ=environ, keep_blank_values=True)
        except Exception:
            start_response("400 Bad Request", [("Content-Type", "application/json")])
            return [json.dumps({"error": "Bad form data"}).encode("utf-8")]

        fileitem = form["stl_file"] if "stl_file" in form else None
        if fileitem is None or not getattr(fileitem, "file", None) or not fileitem.filename:
            start_response("400 Bad Request", [("Content-Type", "application/json")])
            return [json.dumps({"error": "Missing STL file"}).encode("utf-8")]

        material = (form.getfirst("material") or "PLA").strip()
        quality = (form.getfirst("quality") or "normal").strip()
        try:
            infill = float(form.getfirst("infill") or "20")
        except Exception:
            infill = 20.0

        # Save preview & parse volume
        fname_root = os.path.splitext(os.path.basename(fileitem.filename))[0].replace(" ", "_")[:50]
        preview_name = f"preview_{fname_root}.png"
        preview_path = os.path.join(PREVIEW_DIR, preview_name)

        file_bytes = fileitem.file.read()
        volume_mm3, have_preview = stl_volume_mm3_and_preview(file_bytes, preview_path)

        breakdown = estimate_price_breakdown(volume_mm3, material, quality, infill)

        resp = {
            "volume_mm3": round(breakdown["volume_mm3"], 2),
            "mass_g": round(breakdown["mass_g"], 2),
            "time_hours": round(breakdown["time_hours"], 2),
            "material_cost": round(breakdown["material_cost"]),
            "time_cost": round(breakdown["time_cost"]),
            "setup_fee": breakdown["setup_fee"],
            "min_job_applied": breakdown["min_job_applied"],
            "price": round(breakdown["total"]),
            "currency": breakdown["currency"],
            "preview_url": ("/static/previews/" + preview_name) if have_preview else None,
        }

        start_response("200 OK", [("Content-Type", "application/json; charset=utf-8")])
        return [json.dumps(resp).encode("utf-8")]

    # 404
    start_response("404 Not Found", [("Content-Type", "text/plain; charset=utf-8")])
    return [b"Not found"]

def run_server(host="0.0.0.0", port=8000):
    with make_server(host, port, application) as httpd:
        print(f"Serving on http://{host}:{port}")
        httpd.serve_forever()

if __name__ == "__main__":
    # If you want to silence DeprecationWarning about cgi in console, uncomment:
    # import warnings; warnings.filterwarnings("ignore", category=DeprecationWarning)
    run_server()
