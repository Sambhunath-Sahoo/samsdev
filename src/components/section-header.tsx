interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ title, subtitle, className = "" }: SectionHeaderProps) {
  return (
    <div className={`text-center space-y-3 sm:space-y-4 px-2 ${className}`}>
      <div className="inline-block">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          {title}
        </h2>
        <div className="mt-2 h-1 w-16 sm:w-20 mx-auto bg-gradient-to-r from-primary/60 via-primary to-primary/60 rounded-full" />
      </div>
      {subtitle && (
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}

