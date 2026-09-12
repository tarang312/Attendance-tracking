"use client"

import type React from "react"

import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "sonner"

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
      <Toaster richColors position="top-center" />
    </AuthProvider>
  )
}
