"use client"

interface AnimateOnScrollProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function AnimateOnScroll({ 
  children, 
  className = "",
}: AnimateOnScrollProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}
