"use client"

import { motion } from "framer-motion"

interface AnimateOnScrollProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function AnimateOnScroll({ 
  children, 
  className = "",
  delay = 0 
}: AnimateOnScrollProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.7, 
        delay: delay / 1000,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

