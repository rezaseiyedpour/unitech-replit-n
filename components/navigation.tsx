"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "#services", label: "خدمات" },
    { href: "#materials", label: "مواد" },
    { href: "#process", label: "فرآیند" },
  ]

  return (
    <nav className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 md:h-24 py-2">
          <Link href="/" className="flex items-center hover:opacity-80 transition-all duration-200 hover:scale-105">
            <Image
              src="/unitech-3d-logo.png"
              alt="Unitech 3D - خدمات حرفه‌ای پرینت سه‌بعدی"
              width={220}
              height={80}
              className="h-8 sm:h-10 md:h-12 lg:h-16 w-auto"
              priority
            />
            <div className="mr-1.5 sm:mr-2 md:mr-3 flex flex-col">
              <span className="font-heading font-bold text-sm sm:text-lg md:text-xl lg:text-2xl text-primary">
                Unitech 3D
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground hidden sm:block">پرینت سه‌بعدی حرفه‌ای</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 space-x-reverse px-0">
            {pathname === "/" &&
              navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-slate-600 hover:text-slate-800 transition-colors font-medium text-sm lg:text-base xl:text-lg mx-3 xl:mx-4"
                >
                  {item.label}
                </Link>
              ))}
            {pathname !== "/" && (
              <Link
                href="/"
                className="text-slate-600 hover:text-slate-800 transition-colors font-medium text-sm lg:text-base xl:text-lg px-4 xl:px-6"
              >
                بازگشت به خانه
              </Link>
            )}
            <Link href="/quote">
              <Button className="bg-sky-500 hover:bg-sky-600 text-white text-sm lg:text-base xl:text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 py-2 sm:py-2.5 lg:py-3 mx-0 px-3 sm:px-4 lg:px-5 break-words">
                ثبت سفارش
              </Button>
            </Link>
          </div>

          {/* Mobile/Tablet Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 p-1.5 sm:p-2"
            >
              {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile/Tablet Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-3 sm:py-4">
            <div className="flex flex-col space-y-2 sm:space-y-3 md:space-y-4">
              {pathname === "/" &&
                navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-slate-600 hover:text-slate-700 transition-colors px-2 py-1.5 sm:py-2 text-sm sm:text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              {pathname !== "/" && (
                <Link
                  href="/"
                  className="text-slate-600 hover:text-slate-700 transition-colors px-2 py-1.5 sm:py-2 text-sm sm:text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  بازگشت به خانه
                </Link>
              )}
              <Link href="/quote" onClick={() => setIsMenuOpen(false)} className="px-2">
                <Button className="bg-sky-500 hover:bg-sky-600 text-white w-full py-2.5 sm:py-3 text-sm sm:text-base font-semibold break-words">
                  ثبت سفارش
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
