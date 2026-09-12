"use client"

import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/lib/protected-route"
import { EmployeeHeader } from "@/components/employee-header"
import { CheckInWidget } from "@/components/checkin-widget"
import { AttendanceStats } from "@/components/attendance-stats"
import { AttendanceHistory } from "@/components/attendance-history"
import { getEmployeeById } from "@/lib/attendance-utils"
import { Card } from "@/components/ui/card"

export default function EmployeeDashboard() {
  const { session, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-card flex items-center justify-center">
        <Card className="p-8 bg-card/80 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </Card>
      </div>
    )
  }

  const employee = session ? getEmployeeById(session.user.id) : null

  if (!session || !employee) {
    return (
      <ProtectedRoute requiredRole="employee">
        <div className="min-h-screen bg-gradient-to-br from-background to-card flex items-center justify-center px-4">
          <Card className="p-8 bg-card/80 backdrop-blur-md max-w-md">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Session Expired</h2>
              <p className="text-muted-foreground mb-6">Please log in again to access your dashboard</p>
              <a href="/login/employee" className="text-primary hover:text-primary/80 font-semibold">
                Return to Login
              </a>
            </div>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="employee">
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <EmployeeHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-lg p-6 mb-6">
              <h2 className="text-3xl font-bold text-gradient mb-2">Welcome, {employee.name}!</h2>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  {employee.role}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  {employee.department}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  ID: {employee.id}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gradient">Daily Check-in/Check-out</h3>
              <CheckInWidget employeeId={employee.id} />
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-gradient">Your Attendance Overview</h3>
              <AttendanceStats employee={employee} />
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-gradient">Recent Check-in History</h3>
              <AttendanceHistory logs={employee.attendanceLogs} />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
