"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" }
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      const offset = 80 // Account for fixed navbar height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset

      // Update URL hash
      window.history.pushState(null, '', href)

      // Trigger re-animation by temporarily hiding and showing
      element.setAttribute('data-animate', 'true')
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      // Reset animation trigger after scroll
      setTimeout(() => {
        element.removeAttribute('data-animate')
      }, 100)
    }
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-9 w-9 rounded-md border flex items-center justify-center font-semibold">
            S
          </div>
          <span className="text-lg font-semibold tracking-tight">Sams</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-sm font-medium transition-colors hover:text-primary cursor-pointer"
            >
              {item.name}
            </a>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="text-xl">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-1 mt-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="px-4 py-3 text-base font-medium transition-colors hover:bg-muted hover:text-primary rounded-lg cursor-pointer"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

