import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Zap, Shield, Award, ArrowLeft, CheckCircle, Sparkles, Layers, Cpu } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative hero-gradient py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-white/10 rounded-full animate-float"></div>
          <div
            className="absolute bottom-20 sm:bottom-40 left-10 sm:left-20 w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-white/5 rounded-lg rotate-45 animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/4 sm:right-1/3 w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 bg-white/10 rounded-full animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div className="animate-slide-in-up text-center lg:text-right px-2 sm:px-0">
              <Badge className="mb-3 sm:mb-4 md:mb-6 bg-white/20 text-white border-white/30 glass-effect animate-pulse-glow text-xs sm:text-sm">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                Unitech - تولید دارای گواهینامه ISO 9001
              </Badge>
              <h1 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl text-white leading-tight mb-3 sm:mb-4 md:mb-6 drop-shadow-lg">
                {"Unitech 3D: آینده پرینت سه‌بعدی در دستان شما"}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/90 mb-4 sm:mb-6 md:mb-8 leading-relaxed drop-shadow max-w-2xl mx-auto lg:mx-0">
                با Unitech، تکنولوژی پیشرفته پرینت سه‌بعدی را تجربه کنید. از ایده تا محصول نهایی، ما با دقت فوق‌العاده
                ±۰.۰۵ میلی‌متر و سرعت بی‌نظیر، رویاهای شما را به واقعیت تبدیل می‌کنیم.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start max-w-md mx-auto lg:max-w-none">
                <Link href="/quote" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-xs sm:text-sm md:text-base"
                  >
                    <Upload className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    آپلود فایل CAD برای سفارش
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 glass-effect backdrop-blur-sm w-full sm:w-auto text-xs sm:text-sm md:text-base"
                >
                  <Layers className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  مشاهده راهنمای مواد
                </Button>
              </div>
            </div>
            <div className="relative animate-scale-in order-first lg:order-last">
              <div className="bg-white/10 glass-effect rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 relative overflow-hidden animate-float">
                <img
                  src="/precision-3d-printed-parts.png"
                  alt="قطعات پرینت سه‌بعدی دقیق"
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
                <div className="absolute top-1 sm:top-2 md:top-4 left-1 sm:left-2 md:left-4 bg-white/90 glass-effect rounded-lg p-1.5 sm:p-2 md:p-3 shadow-lg animate-pulse-glow">
                  <div className="text-xs text-muted-foreground mb-0.5 sm:mb-1">تلرانس</div>
                  <div className="font-heading font-bold text-primary persian-numbers text-xs sm:text-sm md:text-base">
                    ±۰.۰۵mm
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 items-center">
            {[
              { number: "۱۵+", label: "سال تجربه Unitech", delay: "0s" },
              { number: "۱۰۰K+", label: "قطعه تولید شده", delay: "0.2s" },
              { number: "۱۲", label: "ساعت زمان تحویل", delay: "0.4s" },
              { number: "۹۹.۹%", label: "رضایت مشتریان", delay: "0.6s" },
            ].map((item, index) => (
              <div key={index} className="text-center animate-slide-in-up" style={{ animationDelay: item.delay }}>
                <div className="font-heading font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-primary mb-1 sm:mb-2 persian-numbers hover:scale-110 transition-transform duration-300">
                  {item.number}
                </div>
                <div className="text-muted-foreground text-xs sm:text-sm md:text-base px-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-slide-in-up">
            <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground mb-3 sm:mb-4">
              Unitech: تکنولوژی پیشرفته در خدمت شما
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
              با Unitech، از جدیدترین تکنولوژی‌های پرینت سه‌بعدی برای صنایع هوافضا، پزشکی، خودروسازی و نوآوری محصول
              بهره‌مند شوید.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: Zap,
                title: "دقت فوق‌العاده Unitech",
                desc: "تکنولوژی منحصر به فرد Unitech با دقت ±۰.۰۵ میلی‌متر، استانداردهای جدیدی در صنعت پرینت سه‌بعدی تعریف می‌کند.",
                features: ["تکنولوژی‌های SLA/SLS/FDM پیشرفته", "سیستم کنترل کیفیت هوشمند"],
                color: "primary",
                delay: "0s",
              },
              {
                icon: Shield,
                title: "مواد درجه یک Unitech",
                desc: "کتابخانه گسترده مواد Unitech شامل پیشرفته‌ترین پلیمرها و کامپوزیت‌های مهندسی برای هر کاربرد خاص.",
                features: ["PEEK، PEI، فیبر کربن پیشرفته", "مواد زیست‌سازگار و درجه پزشکی"],
                color: "secondary",
                delay: "0.2s",
              },
              {
                icon: Award,
                title: "سرعت بی‌نظیر Unitech",
                desc: "سیستم تولید هوشمند Unitech از نمونه‌سازی سریع تا تولید انبوه با کیفیت ثابت و تحویل فوری.",
                features: ["نمونه‌سازی ۱۲ ساعته", "ظرفیت تولید انبوه بالا"],
                color: "accent",
                delay: "0.4s",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="border-border hover:border-primary/50 card-hover animate-slide-in-up"
                style={{ animationDelay: item.delay }}
              >
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div
                    className={`bg-${item.color}/10 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-4 sm:mb-6 icon-bounce`}
                  >
                    <item.icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${item.color}`} />
                  </div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-foreground mb-3 sm:mb-4">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">{item.desc}</p>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-xs sm:text-sm text-muted-foreground">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary ml-1.5 sm:ml-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="py-8 sm:py-12 md:py-16 lg:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-slide-in-up">
            <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground mb-3 sm:mb-4">
              فرآیند هوشمند Unitech
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2 sm:px-0">
              از آپلود تا تحویل، تکنولوژی Unitech در ۴ مرحله ساده کار شما را انجام می‌دهد
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { step: "۰۱", title: "آپلود", desc: "فایل‌های CAD خود را از طریق پورتال امن ما ارسال کنید", icon: Upload },
              {
                step: "۰۲",
                title: "بررسی",
                desc: "مهندسان ما تجزیه و تحلیل و بهینه‌سازی برای پرینت انجام می‌دهند",
                icon: Cpu,
              },
              { step: "۰۳", title: "پرینت", desc: "تولید دقیق با نظارت کیفیت", icon: Layers },
              { step: "۰۴", title: "تحویل", desc: "بازرسی کیفیت و ارسال سریع", icon: CheckCircle },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center relative animate-scale-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="bg-primary text-primary-foreground w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-heading font-bold text-sm sm:text-base md:text-lg mx-auto mb-2 sm:mb-3 md:mb-4 persian-numbers shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse-glow">
                  {item.step}
                </div>
                <div className="bg-secondary/10 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 icon-bounce">
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-secondary" />
                </div>
                <h3 className="font-heading font-bold text-sm sm:text-base md:text-lg text-foreground mb-1 sm:mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm px-1">{item.desc}</p>
                {index < 3 && (
                  <ArrowLeft
                    className="hidden lg:block absolute top-4 sm:top-6 md:top-8 -left-3 sm:-left-4 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-muted-foreground animate-bounce"
                    style={{ animationDelay: `${index * 0.5}s` }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-r from-primary to-secondary animate-gradient">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-3 sm:mb-4 md:mb-6 drop-shadow-lg animate-slide-in-up">
            آماده تجربه تکنولوژی Unitech هستید؟
          </h2>
          <p
            className="text-sm sm:text-base md:text-lg text-white/90 mb-4 sm:mb-6 md:mb-8 drop-shadow animate-slide-in-up px-2 sm:px-0 break-words"
            style={{ animationDelay: "0.2s" }}
          >
            همین الان فایل CAD خود را آپلود کنید و قدرت تکنولوژی Unitech را با سفارش فوری و مشاوره تخصصی تجربه کنید.
          </p>
          <Link href="/quote">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-scale-in text-xs sm:text-sm md:text-base"
              style={{ animationDelay: "0.4s" }}
            >
              <Upload className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              ثبت سفارش فوری
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-card border-t border-border py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="font-heading font-bold text-lg sm:text-xl text-foreground mb-3 sm:mb-4">Unitech 3D</div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                پیشرو در تکنولوژی پرینت سه‌بعدی با استانداردهای مهندسی دقیق و نوآوری مداوم.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-bold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                خدمات Unitech
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>
                  <Link href="/quote" className="hover:text-foreground transition-colors">
                    نمونه‌سازی سریع
                  </Link>
                </li>
                <li>
                  <Link href="/quote" className="hover:text-foreground transition-colors">
                    قطعات تولیدی
                  </Link>
                </li>
                <li>
                  <Link href="/quote" className="hover:text-foreground transition-colors">
                    مشاوره مواد
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">صنایع</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>هوافضا</li>
                <li>تجهیزات پزشکی</li>
                <li>خودروسازی</li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                تماس با Unitech
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>su.unitech3d@gmail.com</li>
                <li className="persian-numbers">09102246758</li>
                <li>پشتیبانی فنی ۲۴/۷</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-6 md:pt-8 text-center text-xs sm:text-sm text-muted-foreground persian-numbers">
            © ۲۰۲۴ Unitech 3D. تمام حقوق محفوظ است.
          </div>
        </div>
      </footer>
    </div>
  )
}
