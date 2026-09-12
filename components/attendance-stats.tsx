"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import type { Employee } from "@/lib/mock-data"
import { calculateAttendanceStats } from "@/lib/attendance-utils"

interface AttendanceStatsProps {
  employee: Employee
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({ employee }) => {
  const stats = calculateAttendanceStats(employee.attendanceLogs)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 p-6">
        <p className="text-sm text-muted-foreground mb-2">Total Days</p>
        <p className="text-3xl font-bold text-primary">{stats.totalDays}</p>
      </Card>

      <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 p-6">
        <p className="text-sm text-muted-foreground mb-2">Days Present</p>
        <p className="text-3xl font-bold text-secondary">{stats.presentDays}</p>
      </Card>

      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 p-6">
        <p className="text-sm text-muted-foreground mb-2">Days Absent</p>
        <p className="text-3xl font-bold text-accent">{stats.absentDays}</p>
      </Card>

      <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30 p-6">
        <p className="text-sm text-muted-foreground mb-2">Attendance Rate</p>
        <p className="text-3xl font-bold text-gradient">{stats.attendancePercentage}%</p>
      </Card>
    </div>
  )
}
