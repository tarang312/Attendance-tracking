"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-4">AttendanceFlow</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Modern attendance tracking and analytics. Streamline your workforce management with real-time insights and
            intuitive dashboards.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link href="/login/admin" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground text-lg px-8 py-6 rounded-full font-semibold"
            >
              Admin Login
            </Button>
          </Link>

          <Link href="/login/employee" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground text-lg px-8 py-6 rounded-full font-semibold bg-transparent"
            >
              Employee Login
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-card border border-border rounded-2xl p-6 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="text-3xl mb-3 text-primary">📊</div>
            <h3 className="font-semibold text-lg mb-2">Real-time Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Track attendance patterns and generate insightful reports instantly.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="text-3xl mb-3 text-secondary">⏰</div>
            <h3 className="font-semibold text-lg mb-2">Check-in/out Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Seamless time tracking with automatic attendance status updates.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="text-3xl mb-3 text-accent">🔐</div>
            <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">Enterprise-grade security with role-based access control.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
