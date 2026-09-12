// Attendance calculation utilities

import { mockEmployees, type Employee, type AttendanceLog } from "./mock-data"

export const getEmployeeById = (id: string): Employee | undefined => {
  return mockEmployees.find((emp) => emp.id === id)
}

export const getAllEmployees = (): Employee[] => {
  return mockEmployees
}

export const calculateAttendanceStats = (logs: AttendanceLog[]) => {
  const totalDays = logs.length
  const presentDays = logs.filter((log) => log.isPresent).length
  const absentDays = totalDays - presentDays
  const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : "0"

  return {
    totalDays,
    presentDays,
    absentDays,
    attendancePercentage: Number.parseFloat(attendancePercentage),
  }
}

export const getWeeklyAttendance = (logs: AttendanceLog[]) => {
  const weeks: { [key: string]: { present: number; total: number } } = {}

  logs.forEach((log) => {
    const date = new Date(log.date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const weekKey = weekStart.toISOString().split("T")[0]

    if (!weeks[weekKey]) {
      weeks[weekKey] = { present: 0, total: 0 }
    }
    weeks[weekKey].total += 1
    if (log.isPresent) {
      weeks[weekKey].present += 1
    }
  })

  return weeks
}

export const getMonthlyAttendance = (logs: AttendanceLog[]) => {
  const months: { [key: string]: { present: number; total: number } } = {}

  logs.forEach((log) => {
    const date = new Date(log.date)
    const monthKey = date.toISOString().substring(0, 7) // YYYY-MM

    if (!months[monthKey]) {
      months[monthKey] = { present: 0, total: 0 }
    }
    months[monthKey].total += 1
    if (log.isPresent) {
      months[monthKey].present += 1
    }
  })

  return months
}

export const getAverageWorkingHours = (logs: AttendanceLog[]): number => {
  let totalHours = 0
  let count = 0

  logs.forEach((log) => {
    if (log.checkInTime && log.checkOutTime) {
      const [inH, inM] = log.checkInTime.split(":").map(Number)
      const [outH, outM] = log.checkOutTime.split(":").map(Number)
      const hours = outH - inH + (outM - inM) / 60
      totalHours += hours
      count += 1
    }
  })

  return count > 0 ? Number.parseFloat((totalHours / count).toFixed(2)) : 0
}

export const getLateCheckIns = (logs: AttendanceLog[]) => {
  return logs.filter((log) => {
    if (!log.checkInTime) return false
    const [hour, minute] = log.checkInTime.split(":").map(Number)
    return hour >= 10 || (hour === 9 && minute > 30)
  })
}

export const getTodayAttendance = (): AttendanceLog | null => {
  const today = new Date().toISOString().split("T")[0]
  // In a real app, this would check the database
  return null
}
