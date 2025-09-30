"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type User, type AuthState, getCurrentUser, logout as authLogout } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const user = getCurrentUser()
    setState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    })
  }, [])

  const login = (user: User) => {
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    })
  }

  const logout = () => {
    authLogout()
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
