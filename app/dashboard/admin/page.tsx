"use client"

import { ProtectedRoute } from "@/lib/protected-route"
import { AdminHeader } from "@/components/admin-header"
import { AdminAnalytics } from "@/components/admin-analytics"
import { getAllEmployees } from "@/lib/attendance-utils"

export default function AdminDashboard() {
  const employees = getAllEmployees()

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <AdminHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gradient mb-2">Dashboard Analytics</h2>
            <p className="text-muted-foreground">Real-time attendance insights and employee performance metrics</p>
          </div>

          <AdminAnalytics employees={employees} />
        </main>
      </div>
    </ProtectedRoute>
  )
}
