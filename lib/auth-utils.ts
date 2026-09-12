// Authentication utilities with real employee credentials

import { mockEmployees, mockAdmin } from "./mock-data"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: "admin" | "employee"
}

export interface AuthSession {
  user: AuthUser
  token: string
}

export const mockLogin = (email: string, password: string, role: "admin" | "employee"): AuthSession | null => {
  if (role === "admin") {
    if (email === mockAdmin.email && password === mockAdmin.password) {
      return {
        user: {
          id: mockAdmin.id,
          name: mockAdmin.name,
          email: mockAdmin.email,
          role: "admin",
        },
        token: "admin-token-" + Date.now(),
      }
    }
  } else {
    // Find employee by email and password from the real data
    const employee = mockEmployees.find(
      (emp) => emp.email.toLowerCase() === email.toLowerCase() && emp.password === password,
    )

    if (employee) {
      return {
        user: {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: "employee",
        },
        token: "employee-token-" + Date.now(),
      }
    }
  }
  return null
}

export const saveSession = (session: AuthSession) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authSession", JSON.stringify(session))
  }
}

export const getSession = (): AuthSession | null => {
  if (typeof window !== "undefined") {
    const session = localStorage.getItem("authSession")
    return session ? JSON.parse(session) : null
  }
  return null
}

export const clearSession = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authSession")
  }
}
