"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HerbalLogo } from "@/components/auth/herbal-logo"
import { AyurvedicPattern } from "@/components/auth/ayurvedic-pattern"
import { resetPassword } from "@/lib/auth"
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (err) {
      setError("Email not found. Please check and try again.")
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

          {!success ? (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-balance">Reset Password</h1>
                <p className="mt-2 text-sm text-muted-foreground">Enter your email and we'll send you a reset link</p>
              </div>

              {error && <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-success" />
              </div>
              <h2 className="mb-2 text-2xl font-bold">Check Your Email</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
