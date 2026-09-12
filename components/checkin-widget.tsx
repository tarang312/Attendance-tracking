"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface CheckInWidgetProps {
  employeeId: string
}

export const CheckInWidget: React.FC<CheckInWidgetProps> = ({ employeeId }) => {
  const [currentTime, setCurrentTime] = useState("")
  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [canCheckIn, setCanCheckIn] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Update current time
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString())

      // Check if within check-in window (9:00 AM - 11:00 AM)
      const hour = now.getHours()
      const minute = now.getMinutes()
      const timeInMinutes = hour * 60 + minute
      const windowStart = 9 * 60 // 9:00 AM
      const windowEnd = 11 * 60 // 11:00 AM

      setCanCheckIn(timeInMinutes >= windowStart && timeInMinutes < windowEnd && !isCheckedIn)
    }, 1000)

    // Load from localStorage
    const savedCheckIn = localStorage.getItem(`checkin_${employeeId}_${new Date().toISOString().split("T")[0]}`)
    if (savedCheckIn) {
      const data = JSON.parse(savedCheckIn)
      setCheckInTime(data.checkInTime)
      setCheckOutTime(data.checkOutTime)
      setIsCheckedIn(data.isCheckedIn)
    }

    return () => clearInterval(timer)
  }, [employeeId, isCheckedIn])

  const handleCheckIn = () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString()
    setCheckInTime(timeStr)
    setIsCheckedIn(true)
    setCanCheckIn(false)
    setMessage("✓ Check-in successful!")

    // Save to localStorage
    const today = new Date().toISOString().split("T")[0]
    localStorage.setItem(
      `checkin_${employeeId}_${today}`,
      JSON.stringify({
        checkInTime: timeStr,
        checkOutTime: null,
        isCheckedIn: true,
      }),
    )

    setTimeout(() => setMessage(""), 3000)
  }

  const handleCheckOut = () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString()
    setCheckOutTime(timeStr)
    setIsCheckedIn(false)
    setMessage("✓ Check-out successful!")

    // Save to localStorage
    const today = new Date().toISOString().split("T")[0]
    localStorage.setItem(
      `checkin_${employeeId}_${today}`,
      JSON.stringify({
        checkInTime: checkInTime,
        checkOutTime: timeStr,
        isCheckedIn: false,
      }),
    )

    setTimeout(() => setMessage(""), 3000)
  }

  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const timeInMinutes = hour * 60 + minute
  const windowStart = 9 * 60
  const windowEnd = 11 * 60
  const isInWindow = timeInMinutes >= windowStart && timeInMinutes < windowEnd

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30 p-8">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gradient mb-2">Current Time</h2>
          <p className="text-4xl font-mono font-bold text-primary">{currentTime}</p>
        </div>

        <div className="bg-background/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">Check-in Window: 9:00 AM - 11:00 AM</p>
          {isInWindow && !isCheckedIn && (
            <p className="text-sm text-secondary font-semibold">Window is OPEN - You can check in now!</p>
          )}
          {!isInWindow && !isCheckedIn && (
            <p className="text-sm text-muted-foreground">Window is closed. Check-in available 9:00 AM - 11:00 AM</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Check-in Time</p>
            <p className="text-xl font-bold text-primary">{checkInTime || "--:--"}</p>
          </div>
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Check-out Time</p>
            <p className="text-xl font-bold text-secondary">{checkOutTime || "--:--"}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleCheckIn}
            disabled={!canCheckIn && isCheckedIn}
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold rounded-full py-2 h-auto disabled:opacity-50"
          >
            {isCheckedIn ? "✓ Checked In" : "Check In"}
          </Button>
          <Button
            onClick={handleCheckOut}
            disabled={!isCheckedIn}
            variant="outline"
            className="flex-1 border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-semibold rounded-full py-2 h-auto disabled:opacity-50 bg-transparent"
          >
            {checkOutTime ? "✓ Checked Out" : "Check Out"}
          </Button>
        </div>

        {message && <p className="text-center text-accent font-semibold">{message}</p>}
      </div>
    </Card>
  )
}
