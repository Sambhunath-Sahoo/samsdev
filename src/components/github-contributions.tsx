"use client"

import userData from "@/data/user.json"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function GitHubContributions() {
  // Extract GitHub username from URL
  const githubUsername = userData.github.split('/').pop() || 'Sambhunath-Sahoo'
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = currentTheme === 'dark'
  
  return (
    <section id="contributions" className="space-y-6 sm:space-y-8 scroll-mt-20">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          GitHub Contributions
        </h2>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {/* GitHub Contribution Graph */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={isDark 
              ? `https://ghchart.rshah.org/39d353/${githubUsername}`
              : `https://ghchart.rshah.org/${githubUsername}`
            }
            alt={`${userData.name}'s GitHub Contribution Graph`}
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

