"use client"

import type React from "react"

import { useMemo } from "react"
import type { Employee } from "@/lib/mock-data"
import {
  calculateAttendanceStats,
  getAverageWorkingHours,
  getLateCheckIns,
  getMonthlyAttendance,
  getWeeklyAttendance,
} from "@/lib/attendance-utils"
import { AnalyticsCard } from "./analytics-card"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"

interface AdminAnalyticsProps {
  employees: Employee[]
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ employees }) => {
  const analytics = useMemo(() => {
    // 1. Overall attendance summary
    const totalEmployees = employees.length
    const allLogs = employees.flatMap((e) => e.attendanceLogs)
    const totalPresent = allLogs.filter((l) => l.isPresent).length
    const totalAbsent = allLogs.filter((l) => !l.isPresent).length

    // 2. Individual employee stats
    const employeeStats = employees.map((emp) => {
      const stats = calculateAttendanceStats(emp.attendanceLogs)
      return {
        name: emp.name,
        id: emp.id,
        present: stats.presentDays,
        absent: stats.absentDays,
        percentage: stats.attendancePercentage,
      }
    })

    // 3. Late check-ins analysis
    const lateCheckInsData = employees.map((emp) => ({
      name: emp.name,
      lateCount: getLateCheckIns(emp.attendanceLogs).length,
    }))

    // 4. Average working hours per employee
    const workingHoursData = employees.map((emp) => ({
      name: emp.name.split(" ")[0],
      hours: getAverageWorkingHours(emp.attendanceLogs),
    }))

    // 5. Daily attendance trend (last 20 days)
    const dailyTrend: { [key: string]: { present: number; absent: number } } = {}
    allLogs.forEach((log) => {
      if (!dailyTrend[log.date]) {
        dailyTrend[log.date] = { present: 0, absent: 0 }
      }
      if (log.isPresent) {
        dailyTrend[log.date].present += 1
      } else {
        dailyTrend[log.date].absent += 1
      }
    })

    const dailyTrendArray = Object.entries(dailyTrend)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-20)
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        present: data.present,
        absent: data.absent,
      }))

    // 6. Monthly attendance
    const monthlyData = getMonthlyAttendance(allLogs)
    const monthlyArray = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        attendance: Number.parseFloat(((data.present / data.total) * 100).toFixed(2)),
      }))

    // 7. Check-in time distribution
    const checkInTimes: { [key: string]: number } = {}
    allLogs.forEach((log) => {
      if (log.checkInTime) {
        const hour = log.checkInTime.split(":")[0]
        checkInTimes[`${hour}:00`] = (checkInTimes[`${hour}:00`] || 0) + 1
      }
    })

    const checkInDistribution = Object.entries(checkInTimes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, count]) => ({
        time,
        count,
      }))

    // 8. Employee rankings (by attendance percentage)
    const rankings = [...employeeStats].sort((a, b) => b.percentage - a.percentage)

    // 9. Weekly attendance heatmap (simplified - last 4 weeks)
    const weeklyData = getWeeklyAttendance(allLogs)
    const weeklyArray = Object.entries(weeklyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-4)
      .map(([week, data]) => ({
        week: new Date(week).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        attendance: Number.parseFloat(((data.present / data.total) * 100).toFixed(2)),
        days: data.total,
      }))

    // 10. Present vs Absent pie chart
    const presentVsAbsent = [
      { name: "Present", value: totalPresent },
      { name: "Absent", value: totalAbsent },
    ]

    // 11. Multi-employee comparison (working hours vs attendance)
    const multiComparisonData = employees.map((emp) => {
      const stats = calculateAttendanceStats(emp.attendanceLogs)
      return {
        name: emp.name.split(" ")[0],
        attendance: stats.attendancePercentage,
        hours: getAverageWorkingHours(emp.attendanceLogs),
      }
    })

    return {
      totalEmployees,
      totalPresent,
      totalAbsent,
      employeeStats,
      lateCheckInsData,
      workingHoursData,
      dailyTrendArray,
      monthlyArray,
      checkInDistribution,
      rankings,
      weeklyArray,
      presentVsAbsent,
      multiComparisonData,
    }
  }, [employees])

  const COLORS = ["#a855f7", "#ec4899", "#f59e0b", "#06b6d4", "#8b5cf6"]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Total Employees"
          className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30"
        >
          <p className="text-4xl font-bold text-primary">{analytics.totalEmployees}</p>
        </AnalyticsCard>

        <AnalyticsCard
          title="Total Present"
          className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30"
        >
          <p className="text-4xl font-bold text-secondary">{analytics.totalPresent}</p>
        </AnalyticsCard>

        <AnalyticsCard title="Total Absent" className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
          <p className="text-4xl font-bold text-accent">{analytics.totalAbsent}</p>
        </AnalyticsCard>

        <AnalyticsCard
          title="Overall Rate"
          className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30"
        >
          <p className="text-4xl font-bold text-gradient">
            {((analytics.totalPresent / (analytics.totalPresent + analytics.totalAbsent)) * 100).toFixed(1)}%
          </p>
        </AnalyticsCard>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Present vs Absent */}
        <AnalyticsCard title="Present vs Absent Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.presentVsAbsent}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#ec4899" />
                <Cell fill="#f59e0b" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* 2. Employee Attendance Percentages */}
        <AnalyticsCard title="Individual Employee Attendance %">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={analytics.employeeStats}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} fontSize={12} />
              <Tooltip />
              <Bar dataKey="percentage" fill="#a855f7" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* 3. Daily Attendance Trend */}
        <AnalyticsCard title="Daily Attendance Trend (Last 20 Days)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.dailyTrendArray}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#ec4899" strokeWidth={2} />
              <Line type="monotone" dataKey="absent" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* 4. Monthly Attendance Comparison */}
        <AnalyticsCard title="Monthly Attendance Rate">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.monthlyArray}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attendance" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* 5. Late Check-in Analysis */}
        <AnalyticsCard title="Late Check-ins by Employee">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.lateCheckInsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="lateCount" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* 6. Average Working Hours */}
        <AnalyticsCard title="Average Working Hours per Employee">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.workingHoursData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Bar dataKey="hours" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* 7. Employee Rankings */}
        <AnalyticsCard title="Attendance Rankings">
          <div className="space-y-3">
            {analytics.rankings.map((emp, idx) => (
              <div key={emp.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                    {idx + 1}
                  </div>
                  <span className="font-medium">{emp.name}</span>
                </div>
                <span className="font-bold text-primary">{emp.percentage}%</span>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* 8. Weekly Attendance */}
        <AnalyticsCard title="Weekly Attendance Overview">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.weeklyArray}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Line type="monotone" dataKey="attendance" stroke="#a855f7" strokeWidth={3} name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* 9. Check-in Time Distribution */}
        <AnalyticsCard title="Check-in Time Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.checkInDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ec4899" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* 10. Multi-Employee Comparison (Attendance vs Hours) */}
        <AnalyticsCard title="Attendance Rate vs Working Hours">
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="attendance"
                name="Attendance %"
                label={{ value: "Attendance %", position: "insideBottomRight", offset: -10 }}
              />
              <YAxis dataKey="hours" name="Hours" label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="Employees" data={analytics.multiComparisonData} fill="#a855f7" />
            </ScatterChart>
          </ResponsiveContainer>
        </AnalyticsCard>
      </div>

      {/* Employee Details Table */}
      <AnalyticsCard title="Detailed Employee Report">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Employee</th>
                <th className="text-right py-3 px-4 font-semibold">Role</th>
                <th className="text-right py-3 px-4 font-semibold">Days</th>
                <th className="text-right py-3 px-4 font-semibold">Present</th>
                <th className="text-right py-3 px-4 font-semibold">Absent</th>
                <th className="text-right py-3 px-4 font-semibold">Rate</th>
                <th className="text-right py-3 px-4 font-semibold">Avg Hours</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const stats = calculateAttendanceStats(emp.attendanceLogs)
                const hours = getAverageWorkingHours(emp.attendanceLogs)
                return (
                  <tr key={emp.id} className="border-b border-border hover:bg-background/50">
                    <td className="py-3 px-4">{emp.name}</td>
                    <td className="text-right py-3 px-4 text-muted-foreground">{emp.role}</td>
                    <td className="text-right py-3 px-4">{stats.totalDays}</td>
                    <td className="text-right py-3 px-4 text-secondary font-semibold">{stats.presentDays}</td>
                    <td className="text-right py-3 px-4 text-accent font-semibold">{stats.absentDays}</td>
                    <td className="text-right py-3 px-4 text-primary font-semibold">{stats.attendancePercentage}%</td>
                    <td className="text-right py-3 px-4">{hours}h</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </AnalyticsCard>
    </div>
  )
}
