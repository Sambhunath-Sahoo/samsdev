"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { containerVariants, itemVariants } from "@/lib/animations"
import userData from "@/data/user.json"
import socialsData from "@/data/socials.json"

const iconMap = {
  Github,
  Linkedin,
  Mail,
}

const socials = socialsData.map((social) => ({
  ...social,
  icon: iconMap[social.icon as keyof typeof iconMap],
}))

export function HeroSection() {
  return (
    <section className="flex flex-col-reverse gap-8 sm:gap-10 md:gap-12 md:flex-row md:items-center md:justify-between">
      {/* Left side - Content */}
      <motion.div 
        className="flex-1 space-y-5 sm:space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="space-y-2 sm:space-y-3" variants={itemVariants}>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground tracking-wider uppercase">
            Portfolio
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {userData.name}
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-primary font-semibold">
            {userData.title}
          </p>
        </motion.div>
        
        <motion.p 
          className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl"
          variants={itemVariants}
        >
          {userData.summary}
        </motion.p>

        {/* Tech Stack */}
        <motion.div 
          className="flex flex-wrap gap-2 sm:gap-2.5 pt-2 sm:pt-4"
          variants={itemVariants}
        >
          {userData.skills.fullStack.slice(0, 6).map((tech) => (
            <span
              key={tech}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-muted text-foreground border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Right side - Image */}
      <motion.div 
        className="flex-shrink-0 flex flex-col items-center gap-4 sm:gap-5 md:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
      >
        <div className="relative h-56 w-56 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-3xl" />
          <div className="relative h-full w-full overflow-hidden rounded-2xl border bg-muted">
            <Image
              src={userData.profileImage}
              alt={userData.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        
        {/* View Resume Button */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="w-full max-w-[14rem] sm:max-w-xs"
        >
          <Button 
            variant="default" 
            size="lg"
            className="w-full gap-2 font-semibold text-sm sm:text-base"
          >
            View Resume
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </a>

        {/* Social Links */}
        <div className="flex items-center gap-3 sm:gap-4">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="group"
              aria-label={social.name}
            >
              <div className="p-2 sm:p-2.5 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200 border border-border hover:border-primary">
                <social.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
