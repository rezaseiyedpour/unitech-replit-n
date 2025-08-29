"use client"

import { useMemo } from "react"
import type React from "react"
import { useCallback } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Upload, FileText, RotateCcw, Calculator, Clock, Package, Info } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { STLViewer } from "@/components/stl-viewer"

interface UploadedFile {
  file: File
  url: string
  name: string
  size: number
}

interface Material {
  id: string
  name: string
  description: string
  color: string
  properties: string[]
  pricePerGram: number
}

interface Quality {
  id: string
  name: string
  layerHeight: string
  description: string
  timeMultiplier: number
}

const materials: Material[] = [
  {
    id: "pla",
    name: "PLA",
    description: "آسان برای پرینت، زیست تخریب‌پذیر",
    color: "bg-green-500",
    properties: ["زیست تخریب‌پذیر", "انحراف کم", "جزئیات خوب"],
    pricePerGram: 800,
  },
  {
    id: "abs",
    name: "ABS",
    description: "قوی، مقاوم در برابر حرارت",
    color: "bg-blue-500",
    properties: ["مقاوم در برابر حرارت", "مقاوم در برابر ضربه", "انعطاف‌پذیر"],
    pricePerGram: 900,
  },
  {
    id: "petg",
    name: "PETG",
    description: "مقاوم در برابر مواد شیمیایی، شفاف",
    color: "bg-purple-500",
    properties: ["مقاوم در برابر مواد شیمیایی", "کاملاً شفاف", "ایمن برای غذا"],
    pricePerGram: 1200,
  },
  {
    id: "nylon",
    name: "نایلون",
    description: "درجه صنعتی، بسیار قوی",
    color: "bg-gray-600",
    properties: ["بسیار قوی", "مقاوم در برابر سایش", "درجه صنعتی"],
    pricePerGram: 2000,
  },
  {
    id: "carbon-fiber",
    name: "فیبر کربن",
    description: "سبک، فوق‌العاده قوی",
    color: "bg-black",
    properties: ["فوق‌العاده سبک", "فوق‌العاده قوی", "درجه هوافضا"],
    pricePerGram: 3500,
  },
]

const qualities: Quality[] = [
  {
    id: "draft",
    name: "پیش‌نویس",
    layerHeight: "۰.۳mm",
    description: "پرینت سریع، جزئیات کمتر",
    timeMultiplier: 0.7,
  },
  {
    id: "standard",
    name: "استاندارد",
    layerHeight: "۰.۲mm",
    description: "تعادل سرعت و کیفیت",
    timeMultiplier: 1.0,
  },
  {
    id: "high",
    name: "کیفیت بالا",
    layerHeight: "۰.۱mm",
    description: "بهترین جزئیات، پرینت آهسته‌تر",
    timeMultiplier: 1.8,
  },
]

export default function QuotePage() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Print options state
  const [selectedMaterial, setSelectedMaterial] = useState<string>("pla")
  const [selectedQuality, setSelectedQuality] = useState<string>("standard")
  const [infillPercentage, setInfillPercentage] = useState<number[]>([25])
  const [quantity, setQuantity] = useState<number[]>([1])

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".stl")) {
      alert("لطفاً یک فایل STL آپلود کنید")
      return
    }

    setIsLoading(true)

    try {
      const url = URL.createObjectURL(file)
      setUploadedFile({
        file,
        url,
        name: file.name,
        size: file.size,
      })
    } catch (error) {
      console.error("خطا در پردازش فایل:", error)
      alert("خطا در پردازش فایل. لطفاً دوباره تلاش کنید.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFileUpload(files[0])
      }
    },
    [handleFileUpload],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handleFileUpload(files[0])
      }
    },
    [handleFileUpload],
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "۰ بایت"
    const k = 1024
    const sizes = ["بایت", "کیلوبایت", "مگابایت", "گیگابایت"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const resetUpload = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.url)
    }
    setUploadedFile(null)
  }

  const specifications = useMemo(() => {
    if (!uploadedFile) return null

    const material = materials.find((m) => m.id === selectedMaterial)!
    const quality = qualities.find((q) => q.id === selectedQuality)!

    // Estimate volume based on file size (rough approximation)
    const estimatedVolume = Math.max(10, uploadedFile.size / 1000) // cm³
    const estimatedWeight = estimatedVolume * 1.2 // grams (assuming ~1.2g/cm³ density)

    // Calculate infill multiplier
    const infillMultiplier = 0.3 + (infillPercentage[0] / 100) * 0.7
    const adjustedWeight = estimatedWeight * infillMultiplier

    // Estimated time
    const baseTime = estimatedVolume * 0.5 // minutes per cm³
    const adjustedTime = baseTime * quality.timeMultiplier * infillMultiplier
    const totalHours = Math.max(1, adjustedTime / 60)

    const materialCost = adjustedWeight * material.pricePerGram
    const qualityMultiplier = quality.timeMultiplier // Higher quality costs more
    const baseCost = materialCost * qualityMultiplier
    const totalPrice = baseCost * quantity[0]

    return {
      estimatedWeight: adjustedWeight.toFixed(1),
      estimatedTime: totalHours.toFixed(1),
      material: material.name,
      quality: quality.name,
      infill: infillPercentage[0],
      quantity: quantity[0],
      totalPrice: Math.round(totalPrice),
    }
  }, [uploadedFile, selectedMaterial, selectedQuality, infillPercentage, quantity])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-slate-700 mb-2 sm:mb-3 md:mb-4 break-words">
            سفارش پرینت سه‌بعدی
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 break-words">
            فایل STL خود را آپلود کنید، گزینه‌های پرینت را انتخاب کنید و سفارش خود را ثبت کنید
          </p>
          <Card className="mt-3 sm:mt-4 md:mt-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-3 sm:pt-4 md:pt-6 p-3 sm:p-4 md:p-6">
              <div className="flex items-start gap-2 sm:gap-3">
                <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-blue-900 mb-1.5 sm:mb-2 text-xs sm:text-sm md:text-base break-words">
                    پارامترهای مورد نیاز برای سفارش:
                  </h3>
                  <ul className="text-xs sm:text-sm text-blue-800 space-y-0.5 sm:space-y-1">
                    <li className="break-words">
                      • <strong>فایل STL:</strong> مدل سه‌بعدی شما (حجم و پیچیدگی)
                    </li>
                    <li className="break-words">
                      • <strong>نوع ماده:</strong> PLA، ABS، PETG، نایلون یا فیبر کربن
                    </li>
                    <li className="break-words">
                      • <strong>کیفیت پرینت:</strong> پیش‌نویس، استاندارد یا کیفیت بالا
                    </li>
                    <li className="break-words">
                      • <strong>درصد پرکردگی:</strong> ۱۰٪ تا ۱۰۰٪ (تأثیر بر مقاومت و وزن)
                    </li>
                    <li className="break-words">
                      • <strong>تعداد:</strong> چند قطعه نیاز دارید
                    </li>
                  </ul>
                  <p className="text-xs text-blue-700 mt-2 sm:mt-3 break-words">
                    💡 نکته: مشخصات نهایی بر اساس وزن قطعه، نوع ماده و کیفیت پرینت تعیین می‌شود
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Upload Section */}
          <div className="xl:col-span-1 order-1">
            <Card className="border-slate-200">
              <CardHeader className="pb-3 sm:pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl break-words">
                  <Upload className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  آپلود فایل STL
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {!uploadedFile ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center transition-colors ${
                      isDragOver ? "border-red-400 bg-red-50" : "border-slate-300 hover:border-slate-400"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragOver(true)
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                  >
                    <Upload className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-slate-400 mx-auto mb-2 sm:mb-3 md:mb-4" />
                    <p className="text-slate-600 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base break-words">
                      فایل STL خود را اینجا بکشید و رها کنید
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 mb-2 sm:mb-3 md:mb-4">یا</p>
                    <Button
                      variant="outline"
                      className="cursor-pointer bg-transparent text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3"
                      disabled={isLoading}
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      {isLoading ? "در حال آپلود..." : "انتخاب فایل"}
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".stl"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-slate-500 mt-2 sm:mt-3 md:mt-4 break-words">
                      حداکثر اندازه فایل: ۱۰۰ مگابایت
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-green-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-green-800 text-xs sm:text-sm md:text-base truncate">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs sm:text-sm text-green-600">{formatFileSize(uploadedFile.size)}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={resetUpload}
                      className="w-full bg-transparent text-xs sm:text-sm md:text-base py-2 sm:py-2.5"
                    >
                      <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                      آپلود فایل جدید
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 3D Preview Section */}
          <div className="xl:col-span-1 order-3 xl:order-2">
            <Card className="border-slate-200 h-full">
              <CardHeader className="pb-3 sm:pb-4 md:pb-6">
                <CardTitle className="text-base sm:text-lg md:text-xl break-words">پیش‌نمایش سه‌بعدی</CardTitle>
              </CardHeader>
              <CardContent className="h-48 sm:h-64 md:h-80 lg:h-96 pt-0">
                {uploadedFile ? (
                  <STLViewer url={uploadedFile.url} fileSize={uploadedFile.size} />
                ) : (
                  <div className="h-full flex items-center justify-center bg-slate-100 rounded-lg">
                    <div className="text-center px-4">
                      <Package className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-slate-400 mx-auto mb-2 sm:mb-3 md:mb-4" />
                      <p className="text-slate-500 text-xs sm:text-sm md:text-base break-words">
                        پیش‌نمایش سه‌بعدی اینجا نمایش داده می‌شود
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Print Options Section */}
          <div className="xl:col-span-1 order-2 xl:order-3">
            <Card className="border-slate-200 xl:sticky xl:top-24">
              <CardHeader className="pb-3 sm:pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl break-words">
                  <Calculator className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  تنظیمات پرینت
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 md:space-y-6 pt-0">
                {/* Material Selection */}
                <div>
                  <Label className="text-xs sm:text-sm md:text-base font-medium mb-1.5 sm:mb-2 md:mb-3 block">
                    انتخاب ماده
                  </Label>
                  <RadioGroup value={selectedMaterial} onValueChange={setSelectedMaterial}>
                    {materials.map((material) => (
                      <div key={material.id} className="flex items-start space-x-2 sm:space-x-3 space-x-reverse">
                        <RadioGroupItem value={material.id} id={material.id} className="mt-0.5 sm:mt-1 flex-shrink-0" />
                        <Label htmlFor={material.id} className="flex-1 cursor-pointer min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${material.color} flex-shrink-0`} />
                            <span className="font-medium text-xs sm:text-sm md:text-base break-words">
                              {material.name}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 mb-1.5 sm:mb-2 break-words">
                            {material.description}
                          </p>
                          <div className="flex flex-wrap gap-0.5 sm:gap-1">
                            {material.properties.map((prop, index) => (
                              <Badge key={index} variant="secondary" className="text-xs break-words">
                                {prop}
                              </Badge>
                            ))}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Quality Selection */}
                <div>
                  <Label className="text-xs sm:text-sm md:text-base font-medium mb-1.5 sm:mb-2 md:mb-3 block">
                    کیفیت پرینت
                  </Label>
                  <RadioGroup value={selectedQuality} onValueChange={setSelectedQuality}>
                    {qualities.map((quality) => (
                      <div key={quality.id} className="flex items-start space-x-2 sm:space-x-3 space-x-reverse">
                        <RadioGroupItem value={quality.id} id={quality.id} className="mt-0.5 sm:mt-1 flex-shrink-0" />
                        <Label htmlFor={quality.id} className="flex-1 cursor-pointer min-w-0">
                          <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                            <span className="font-medium text-xs sm:text-sm md:text-base break-words">
                              {quality.name}
                            </span>
                            <Badge variant="outline" className="text-xs persian-numbers flex-shrink-0">
                              {quality.layerHeight}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 break-words">{quality.description}</p>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Infill Percentage */}
                <div>
                  <Label className="text-xs sm:text-sm md:text-base font-medium mb-1.5 sm:mb-2 md:mb-3 block">
                    درصد پرکردگی: <span className="persian-numbers">{infillPercentage[0]}%</span>
                  </Label>
                  <Slider
                    value={infillPercentage}
                    onValueChange={setInfillPercentage}
                    max={100}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1 persian-numbers">
                    <span>۱۰%</span>
                    <span>۱۰۰%</span>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <Label className="text-xs sm:text-sm md:text-base font-medium mb-1.5 sm:mb-2 md:mb-3 block">
                    تعداد: <span className="persian-numbers">{quantity[0]}</span>
                  </Label>
                  <Slider value={quantity} onValueChange={setQuantity} max={100} min={1} step={1} className="w-full" />
                  <div className="flex justify-between text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1 persian-numbers">
                    <span>۱</span>
                    <span>۱۰۰</span>
                  </div>
                </div>

                {/* Specifications Summary */}
                {specifications && (
                  <div className="border-t pt-3 sm:pt-4">
                    <h4 className="font-medium mb-2 sm:mb-3 text-xs sm:text-sm md:text-base break-words">
                      مشخصات سفارش
                    </h4>
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between items-center">
                        <span className="break-words">وزن تخمینی:</span>
                        <span className="persian-numbers flex-shrink-0">{specifications.estimatedWeight} گرم</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="break-words">ماده انتخابی:</span>
                        <span className="flex-shrink-0">{specifications.material}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="break-words">کیفیت:</span>
                        <span className="flex-shrink-0">{specifications.quality}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="break-words">پرکردگی:</span>
                        <span className="persian-numbers flex-shrink-0">{specifications.infill}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="break-words">تعداد:</span>
                        <span className="persian-numbers flex-shrink-0">{specifications.quantity}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600 mt-2 sm:mt-3">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm break-words">
                          زمان تخمینی: <span className="persian-numbers">{specifications.estimatedTime}</span> ساعت
                        </span>
                      </div>
                      <div className="border-t pt-2 sm:pt-3 mt-2 sm:mt-3">
                        <div className="flex justify-between items-center font-medium text-sm sm:text-base">
                          <span className="break-words">قیمت کل:</span>
                          <span className="persian-numbers flex-shrink-0 text-red-600">
                            {specifications.totalPrice.toLocaleString("fa-IR")} ریال
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-3 sm:mt-4 bg-red-600 hover:bg-red-700 text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3"
                      disabled={!uploadedFile}
                    >
                      ثبت سفارش
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
