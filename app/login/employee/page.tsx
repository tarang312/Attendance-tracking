"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { mockLogin } from "@/lib/auth-utils"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export default function EmployeeLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDemoAccounts, setShowDemoAccounts] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!email || !password) {
      toast.error("Please enter both email and password")
      setIsLoading(false)
      return
    }

    try {
      const session = mockLogin(email, password, "employee")

      if (session) {
        login(session)
        toast.success("Welcome back, " + session.user.name)
        router.push("/dashboard/employee")
      } else {
        toast.error("Invalid email or password")
        setIsLoading(false)
      }
    } catch (err) {
      toast.error("An error occurred during login")
      setIsLoading(false)
    }
  }

  const quickLogin = (demoEmail: string, demoPassword: string) => {
    setIsLoading(true)
    const session = mockLogin(demoEmail, demoPassword, "employee")
    if (session) {
      login(session)
      toast.success("Welcome, " + session.user.name)
      router.push("/dashboard/employee")
    } else {
      toast.error("Demo login failed")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background px-4 py-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <Card className="relative z-10 w-full max-w-md bg-card/80 backdrop-blur-md border-border shadow-2xl">
        <div className="p-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
            ← Back to Home
          </Link>

          <h1 className="text-3xl font-bold mb-2">Employee Login</h1>
          <p className="text-muted-foreground mb-8">Access your attendance dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                placeholder="john01@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <Input
                type="password"
                placeholder="22101022"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="rounded-lg"
              />
            </div>

            {/* Error display removed in favor of Sonner toast */}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-secondary-foreground font-semibold rounded-full py-2"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6">
            <button
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="text-sm text-secondary hover:text-secondary/80 font-semibold mb-3 w-full text-center"
              type="button"
            >
              {showDemoAccounts ? "Hide Demo Accounts" : "Show Demo Accounts"}
            </button>

            {showDemoAccounts && (
              <div className="space-y-2 p-4 bg-secondary/10 border border-secondary rounded-lg max-h-64 overflow-y-auto">
                <p className="text-xs font-semibold text-secondary mb-3">Click to quick login:</p>
                <div className="space-y-2">
                  {[
                    { name: "John", email: "john01@gmail.com" },
                    { name: "Priya", email: "priya02@gmail.com" },
                    { name: "Ahmed", email: "ahmed03@gmail.com" },
                    { name: "Sneha", email: "Sneha04@gmail.com" },
                    { name: "David", email: "David05@gmail.com" },
                  ].map((emp) => (
                    <button
                      key={emp.email}
                      onClick={() => quickLogin(emp.email, "22101022")}
                      disabled={isLoading}
                      type="button"
                      className="w-full p-2 bg-background/50 hover:bg-secondary/20 rounded text-left text-xs transition-colors disabled:opacity-50"
                    >
                      <p className="font-semibold text-foreground">{emp.name}</p>
                      <p className="text-muted-foreground">{emp.email}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Admin?{" "}
            <Link href="/login/admin" className="text-secondary font-semibold hover:text-secondary/80">
              Login here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
