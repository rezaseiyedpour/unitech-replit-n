import type React from "react"
import type { Metadata } from "next"
import { Vazirmatn } from "next/font/google"
import { Playfair_Display, Source_Sans_3 as Source_Sans_Pro } from "next/font/google"
import "./globals.css"

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-vazirmatn",
  weight: ["400", "500", "600", "700"],
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
})

const sourceSansPro = Source_Sans_Pro({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["400", "600", "700"],
})

export const metadata: Metadata = {
  title: "Unitech 3D - پیشرو در تکنولوژی پرینت سه‌بعدی",
  description:
    "Unitech 3D: آینده پرینت سه‌بعدی در دستان شما. تکنولوژی پیشرفته، دقت فوق‌العاده و سرعت بی‌نظیر برای تحقق رویاهای شما.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${playfairDisplay.variable} ${sourceSansPro.variable} antialiased`}
    >
      <body className="font-sans">{children}</body>
    </html>
  )
}
