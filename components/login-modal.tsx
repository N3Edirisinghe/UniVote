"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getEmailValidationError } from "@/lib/email-validation"
import { resendConfirmationEmail } from "@/lib/actions/auth"
import { ResetPasswordModal } from "@/components/reset-password-modal"
import { Eye, EyeOff } from "lucide-react"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showResendConfirmation, setShowResendConfirmation] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleModeSwitch = (adminMode: boolean) => {
    setIsAdminMode(adminMode)
    setError(null)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    const emailError = getEmailValidationError(email)
    if (emailError) {
      setError(emailError)
      setIsLoading(false)
      return
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.log("[v0] Login error details:", JSON.stringify(signInError, null, 2))

        // The error object from Supabase might look like { status: 503, name: "AuthRetryableFetchError", ... }
        // We cast to any to safely access potential properties that aren't in the standard AuthError type
        const errorObj = signInError as any
        if (errorObj.status === 503 || errorObj.name === "AuthRetryableFetchError") {
          throw new Error(
            "Service unavailable (503). Your Supabase project might be paused. Please check your Supabase dashboard.",
          )
        }

        // Check if it's an email confirmation issue
        if (
          signInError.message &&
          (signInError.message.includes("Email not confirmed") ||
            signInError.message.includes("confirm your email"))
        ) {
          setShowResendConfirmation(true)
          throw new Error(
            "Please confirm your email address before logging in. Check your inbox for the confirmation link.",
          )
        }
        // Check if it's invalid credentials
        if (signInError.message && signInError.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please check your credentials and try again.")
        }
        throw signInError
      }

      if (!data.user) {
        throw new Error("Login failed. Please try again.")
      }

      // Check user role and redirect
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (profileError) {
        throw new Error("Unable to fetch user profile. Please try again.")
      }

      if (!profile) {
        throw new Error("User profile not found. Please contact support.")
      }

      const redirectPath = profile.role === "admin" ? "/admin" : "/student"

      onOpenChange(false)
      // Use window.location.href instead of router.push to ensure cookies are properly set
      window.location.href = redirectPath
    } catch (error: any) {
      console.error("[v0] Login exception:", error)

      let errorMessage = "An error occurred during login"

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (error?.message) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      } else if (typeof error === "object") {
        try {
          errorMessage = JSON.stringify(error)
          if (errorMessage === "{}" || errorMessage === "[]") {
            errorMessage = "Connection failed. Please check your network or contact support."
          }
        } catch (e) {
          errorMessage = "An unknown error occurred"
        }
      }

      // Handle "Failed to fetch" specifically
      if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
        errorMessage =
          "Connection error: Unable to reach the server. Please check your internet connection or try again later."
      }

      setError(errorMessage)
      setIsLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Please enter your email address first.")
      return
    }

    setResendLoading(true)
    setResendSuccess(false)
    setError(null)

    try {
      const result = await resendConfirmationEmail(email)
      if (result.success) {
        setResendSuccess(true)
        setError(null)
        setTimeout(() => {
          setResendSuccess(false)
        }, 5000)
      } else {
        setError(result.error || "Failed to resend confirmation email.")
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend confirmation email.")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">Welcome Back to SLTC Uni Votes</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Login to participate in campus elections
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 rounded-lg bg-muted p-1">
          <Button
            type="button"
            variant={!isAdminMode ? "default" : "ghost"}
            className="flex-1"
            size="sm"
            onClick={() => handleModeSwitch(false)}
          >
            Student
          </Button>
          <Button
            type="button"
            variant={isAdminMode ? "default" : "ghost"}
            className="flex-1"
            size="sm"
            onClick={() => handleModeSwitch(true)}
          >
            Admin
          </Button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder={isAdminMode ? "admin@sltc.ac.lk" : "student@sltc.ac.lk"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>
              <button
                type="button"
                onClick={() => {
                  setResetPasswordOpen(true)
                  setError(null)
                }}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
            <Input
              id="login-password"
                type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
                className="pr-10"
            />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {showResendConfirmation && (
            <div className="space-y-2">
              <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
                <AlertDescription className="text-sm">
                  Need a new confirmation email? Click the button below to resend it.
                </AlertDescription>
              </Alert>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendConfirmation}
                disabled={resendLoading || resendSuccess}
              >
                {resendLoading
                  ? "Sending..."
                  : resendSuccess
                    ? "Confirmation email sent! Check your inbox."
                    : "Resend Confirmation Email"}
              </Button>
            </div>
          )}
          {resendSuccess && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <AlertDescription className="text-sm">
                Confirmation email sent! Please check your inbox (and spam folder) and click the confirmation link.
              </AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : `Login as ${isAdminMode ? "Admin" : "Student"}`}
          </Button>
        </form>

        <ResetPasswordModal open={resetPasswordOpen} onOpenChange={setResetPasswordOpen} />
      </DialogContent>
    </Dialog>
  )
}
