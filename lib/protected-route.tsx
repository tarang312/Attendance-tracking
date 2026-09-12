"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useAuth } from "./auth-context"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "employee"
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { session, isLoading } = useAuth()
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        router.push("/")
      } else if (requiredRole && session.user.role !== requiredRole) {
        router.push("/")
      } else {
        setHasAccess(true)
      }
    }
  }, [session, isLoading, requiredRole, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-card">
        <Card className="p-8 bg-card/80 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (!hasAccess) {
    return null
  }

  return <>{children}</>
}
