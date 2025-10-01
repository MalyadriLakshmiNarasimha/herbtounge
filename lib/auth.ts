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

export const login = async (email: string, password: string): Promise<User> => {
  console.log("Login request sent for:", email)
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    console.log("Login response status:", res.status)
    if (!res.ok) {
      const errorData = await res.json()
      console.error("Login error response:", errorData)
      throw new Error(errorData.error || "Invalid email or password")
    }

    const data = await res.json()
    console.log("Login successful response data:", data)

    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("herbalauth_user", JSON.stringify(data.user))
    }

    return data.user
  } catch (error) {
    console.error("Login fetch error:", error)
    throw error
  }
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

  // This function is a stub and does not currently interact with backend
}
