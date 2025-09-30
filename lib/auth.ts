"use client"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "analyst" | "viewer"
  avatar?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@herbalauth.com",
    password: "Admin@123",
    name: "Dr. Priya Sharma",
    role: "admin" as const,
  },
  {
    id: "2",
    email: "analyst@herbalauth.com",
    password: "Analyst@123",
    name: "Rajesh Kumar",
    role: "analyst" as const,
  },
  {
    id: "3",
    email: "viewer@herbalauth.com",
    password: "Viewer@123",
    name: "Anita Desai",
    role: "viewer" as const,
  },
]

export const login = async (email: string, password: string): Promise<User> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

  if (!user) {
    throw new Error("Invalid credentials")
  }

  const { password: _, ...userWithoutPassword } = user

  // Store in localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("herbalauth_user", JSON.stringify(userWithoutPassword))
  }

  return userWithoutPassword
}

export const signup = async (email: string, password: string, name: string): Promise<User> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    role: "viewer", // Default role
  }

  // Store in localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("herbalauth_user", JSON.stringify(newUser))
  }

  return newUser
}

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("herbalauth_user")
  }
}

export const getCurrentUser = (): User | null => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("herbalauth_user")
    if (userStr) {
      return JSON.parse(userStr)
    }
  }
  return null
}

export const resetPassword = async (email: string): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = MOCK_USERS.find((u) => u.email === email)
  if (!user) {
    throw new Error("Email not found")
  }
}
