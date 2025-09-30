"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HerbalLogo } from "@/components/auth/herbal-logo"
import { AyurvedicPattern } from "@/components/auth/ayurvedic-pattern"
import { useAuth } from "@/contexts/auth-context"
import { login as authLogin } from "@/lib/auth"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const user = await authLogin(email, password)
      login(user)
      router.push("/dashboard")
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center gradient-ayurvedic">
      <AyurvedicPattern />

      <div className="relative z-10 w-full max-w-md animate-fade-in px-4">
        <div className="rounded-lg border border-border bg-card p-8 shadow-2xl">
          <div className="mb-8 flex justify-center">
            <HerbalLogo size="lg" />
          </div>

          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-balance">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to access your herbal authenticity dashboard</p>
          </div>

          {error && <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@herbalauth.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link href="/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>

          <div className="mt-8 rounded-md bg-muted/50 p-4">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Admin: admin@herbalauth.com / Admin@123</p>
              <p>Analyst: analyst@herbalauth.com / Analyst@123</p>
              <p>Viewer: viewer@herbalauth.com / Viewer@123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
