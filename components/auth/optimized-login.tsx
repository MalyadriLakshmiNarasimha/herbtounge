'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { HerbalLogo } from '@/components/auth/herbal-logo'
import { AyurvedicPattern } from '@/components/auth/ayurvedic-pattern'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

interface LoginFormData {
  email: string
  password: string
}

export default function OptimizedLoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = useCallback((field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email, // Assuming email as username
          password: formData.password
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Login failed')
      }

      const data = await response.json()

      // Store token in httpOnly cookie for security
      Cookies.set('auth_token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: 1 // 1 day
      })

      // Store user info in localStorage (non-sensitive)
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        // Add other user data as needed
      }))

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [formData, router])

  const handleDemoLogin = useCallback(() => {
    setFormData({ email: 'admin@herbalauth.com', password: 'Admin@123' })
  }, [])

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

          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@herbalauth.com"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  required
                  disabled={isLoading}
                  className="pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              Demo Login
            </Button>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

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
