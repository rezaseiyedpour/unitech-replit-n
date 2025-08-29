"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { STLLoader } from "three/addons/loaders/STLLoader.js"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

interface STLMeshProps {
  geometry: THREE.BufferGeometry | null
}

function STLMesh({ geometry }: STLMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    let animationId: number

    const animate = () => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.005
      }
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  if (!geometry) {
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="gray" />
      </mesh>
    )
  }

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color="#e2e8f0" metalness={0.1} roughness={0.3} wireframe={false} />
    </mesh>
  )
}

interface STLViewerProps {
  url: string
  fileSize?: number
}

async function validateSTLFile(url: string, fileSize?: number): Promise<{ valid: boolean; error?: string }> {
  const MAX_FILE_SIZE = 25 * 1024 * 1024

  if (fileSize && fileSize > MAX_FILE_SIZE) {
    return { valid: false, error: "فایل بیش از حد بزرگ است. حداکثر اندازه مجاز ۲۵ مگابایت می‌باشد." }
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      return { valid: false, error: "خطا در دسترسی به فایل." }
    }

    const buffer = await response.arrayBuffer()

    if (buffer.byteLength < 84) {
      return { valid: false, error: "فایل STL نامعتبر است - اندازه بیش از حد کوچک." }
    }

    return { valid: true }
  } catch (error) {
    return { valid: false, error: "خطا در اعتبارسنجی فایل STL." }
  }
}

export function STLViewer({ url, fileSize }: STLViewerProps) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadSTL = async () => {
      setLoading(true)
      setError(null)

      const validation = await validateSTLFile(url, fileSize)
      if (!validation.valid) {
        if (isMounted) {
          setError(validation.error || "فایل STL نامعتبر است.")
          setLoading(false)
        }
        return
      }

      const loader = new STLLoader()

      try {
        loader.load(
          url,
          (loadedGeometry) => {
            if (!isMounted) return

            try {
              if (!loadedGeometry || !loadedGeometry.attributes.position) {
                throw new Error("Invalid geometry data")
              }

              loadedGeometry.computeBoundingBox()
              const box = loadedGeometry.boundingBox
              if (box) {
                const center = box.getCenter(new THREE.Vector3())
                loadedGeometry.translate(-center.x, -center.y, -center.z)

                const size = new THREE.Vector3()
                box.getSize(size)
                const maxDimension = Math.max(size.x, size.y, size.z)
                if (maxDimension > 0) {
                  const scale = 3 / maxDimension
                  loadedGeometry.scale(scale, scale, scale)
                }
              }

              loadedGeometry.computeVertexNormals()
              setGeometry(loadedGeometry)
              setError(null)
              setLoading(false)
            } catch (err) {
              console.error("Error processing geometry:", err)
              setError("فایل STL پیچیده‌تر از حد مجاز است. لطفاً فایل ساده‌تری انتخاب کنید.")
              setLoading(false)
            }
          },
          undefined,
          (err) => {
            if (!isMounted) return
            console.error("Error loading STL:", err)
            setError("خطا در بارگذاری فایل STL. لطفاً فایل معتبری انتخاب کنید.")
            setLoading(false)
          },
        )
      } catch (error) {
        if (isMounted) {
          setError("خطا در بارگذاری فایل STL.")
          setLoading(false)
        }
      }
    }

    loadSTL()

    return () => {
      isMounted = false
      if (geometry) {
        geometry.dispose()
      }
    }
  }, [url, fileSize])

  useEffect(() => {
    if (!canvasRef.current || !geometry) return

    const canvas = canvasRef.current
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf8fafc)

    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
    camera.position.set(5, 5, 5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = true
    controls.enableRotate = true
    controls.enablePan = true
    controls.minDistance = 2
    controls.maxDistance = 20
    controls.autoRotate = false

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 10, 5)
    scene.add(directionalLight)

    const material = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.1,
      roughness: 0.3,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    sceneRef.current = scene
    rendererRef.current = renderer
    cameraRef.current = camera
    controlsRef.current = controls

    let animationId: number
    const animate = () => {
      controls.update()
      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      if (canvas && camera && renderer) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(canvas.clientWidth, canvas.clientHeight)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      if (controls) {
        controls.dispose()
      }
      if (renderer) {
        renderer.dispose()
      }
    }
  }, [geometry])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-4">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-sm text-gray-500">لطفاً فایل STL معتبر و کمتر از ۲۵ مگابایت انتخاب کنید.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full rounded-lg" style={{ display: loading ? "none" : "block" }} />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700 mx-auto mb-2"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      )}
      {!loading && !error && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-xs px-3 py-2 rounded-lg">
          <p>کلیک و کشیدن: چرخاندن</p>
          <p>اسکرول: زوم</p>
          <p>کلیک راست و کشیدن: جابجایی</p>
        </div>
      )}
    </div>
  )
}
