"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { AuthSession } from "./auth-utils"
import { getSession, clearSession, saveSession } from "./auth-utils"

interface AuthContextType {
  session: AuthSession | null
  isLoading: boolean
  logout: () => void
  login: (session: AuthSession) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedSession = getSession()
    setSession(savedSession)
    setIsLoading(false)
  }, [])

  const logout = () => {
    clearSession()
    setSession(null)
  }

  const login = (newSession: AuthSession) => {
    saveSession(newSession)
    setSession(newSession)
  }

  return <AuthContext.Provider value={{ session, isLoading, logout, login }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
