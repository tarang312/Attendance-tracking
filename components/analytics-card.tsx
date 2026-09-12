"use client"

import type React from "react"

import { Card } from "@/components/ui/card"

interface AnalyticsCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, children, className = "" }) => {
  return (
    <Card className={`bg-card/50 backdrop-blur-sm border-border p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="w-full">{children}</div>
    </Card>
  )
}
