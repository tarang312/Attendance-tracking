"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import type { AttendanceLog } from "@/lib/mock-data"

interface AttendanceHistoryProps {
  logs: AttendanceLog[]
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ logs }) => {
  // Get last 15 records
  const recentLogs = [...logs].reverse().slice(0, 15)

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Attendance History</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {recentLogs.map((log) => (
          <div
            key={log.date}
            className="flex items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-background transition-colors"
          >
            <div>
              <p className="font-medium">{new Date(log.date).toLocaleDateString()}</p>
              <p className="text-sm text-muted-foreground">
                {log.checkInTime ? `${log.checkInTime} - ${log.checkOutTime || "--:--"}` : "Absent"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {log.isPresent ? (
                <span className="inline-block w-3 h-3 bg-secondary rounded-full" />
              ) : (
                <span className="inline-block w-3 h-3 bg-accent rounded-full" />
              )}
              <span className={`text-sm font-semibold ${log.isPresent ? "text-secondary" : "text-accent"}`}>
                {log.isPresent ? "Present" : "Absent"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
