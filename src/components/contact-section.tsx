import { Mail } from "lucide-react"
import userData from "@/data/user.json"

export function ContactSection() {
  return (
    <section id="contact" className="space-y-8 sm:space-y-10 md:space-y-12 scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
        {/* Left Side - Text */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-primary uppercase">
            CONTACT ME
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Let&apos;s talk!
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Feel free to reach out! I&apos;m here to help and will respond within 24 hours. Your questions matter to me!
          </p>
        </div>

        {/* Right Side - Contact Info */}
        <div className="space-y-6 sm:space-y-8">
          {/* Write an email */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold">Write an email</h3>
              <a 
                href={`mailto:${userData.email}`}
                className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors border-b border-muted-foreground/30 hover:border-primary break-all"
              >
                {userData.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

