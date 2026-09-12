"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export const AdminHeader: React.FC = () => {
  const { session, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">AttendanceFlow Admin</h1>
          <p className="text-sm text-muted-foreground">Analytics & Reports</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold">{session?.user.name}</p>
            <p className="text-sm text-muted-foreground">{session?.user.email}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="rounded-full bg-transparent">
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
