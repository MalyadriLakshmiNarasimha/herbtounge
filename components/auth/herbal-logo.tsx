"use client"

import { Leaf } from "lucide-react"

interface HerbalLogoProps {
  variant?: "default" | "authentic" | "adulterated"
  size?: "sm" | "md" | "lg"
}

export function HerbalLogo({ variant = "default", size = "md" }: HerbalLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const colorClasses = {
    default: "text-primary",
    authentic: "text-success",
    adulterated: "text-error",
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`rounded-lg bg-primary/10 p-2 ${variant !== "default" ? "animate-pulse" : ""}`}>
        <Leaf className={`${sizeClasses[size]} ${colorClasses[variant]}`} />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight">HerbalAuth</span>
        <span className="text-xs text-muted-foreground">AI-Powered Authenticity</span>
      </div>
    </div>
  )
}
