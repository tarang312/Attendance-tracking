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

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const session = mockLogin(email, password, "admin")
      if (session) {
        login(session)
        toast.success("Welcome, Admin")
        router.push("/dashboard/admin")
      } else {
        toast.error("Invalid credentials. Use admin@company.com / admin123")
        setIsLoading(false)
      }
    } catch (err) {
      toast.error("An error occurred during login")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <Card className="relative z-10 w-full max-w-md bg-card/80 backdrop-blur-md border-border shadow-2xl">
        <div className="p-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
            ← Back to Home
          </Link>

          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-muted-foreground mb-6">Access the admin dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <Input
                type="password"
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Error display removed in favor of Sonner toast */}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold rounded-full py-2"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-accent/10 border border-accent rounded-lg text-sm text-muted-foreground">
            <p className="font-semibold text-accent mb-2">Demo Credentials:</p>
            <p>
              Email: <code className="font-mono">admin@company.com</code>
            </p>
            <p>
              Password: <code className="font-mono">admin123</code>
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Employee?{" "}
            <Link href="/login/employee" className="text-secondary font-semibold hover:text-secondary/80">
              Login here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
