"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getEmailValidationError } from "@/lib/email-validation"
import { Eye, EyeOff } from "lucide-react"

interface RegisterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RegisterModal({ open, onOpenChange }: RegisterModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [adminCode, setAdminCode] = useState("")
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleModeSwitch = (adminMode: boolean) => {
    setIsAdminMode(adminMode)
    setError(null)
    setSuccess(null)
    setAdminCode("")
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const emailError = getEmailValidationError(email)
    if (emailError) {
      setError(emailError)
      setIsLoading(false)
      return
    }

    if (isAdminMode) {
      const ADMIN_SECRET_CODE = "SLTC2025ADMIN"
      if (adminCode !== ADMIN_SECRET_CODE) {
        setError("Invalid admin code. Please contact the system administrator.")
        setIsLoading(false)
        return
      }
    }

    // Validate mobile number format
    if (!mobileNumber || mobileNumber.trim().length < 9) {
      setError("Please enter a valid mobile number (at least 9 digits).")
      setIsLoading(false)
      return
    }

    // Clean mobile number (remove spaces, dashes, etc.)
    const cleanMobileNumber = mobileNumber.trim().replace(/[\s-]/g, "")

    try {
      const supabase = createClient()

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/${isAdminMode ? "admin" : "student"}`,
          data: {
            full_name: fullName,
            student_id: isAdminMode ? "ADMIN" : studentId,
            role: isAdminMode ? "admin" : "student",
            mobile_number: cleanMobileNumber,
          },
        },
      })

      if (error) {
        console.error("[v0] Registration error:", error)
        throw error
      }

      if (data.user) {
        setSuccess("Registration successful! Redirecting to your dashboard...")

        // Clear form
        setEmail("")
        setPassword("")
        setFullName("")
        setStudentId("")
        setMobileNumber("")
        setAdminCode("")

        // Redirect after a short delay
        setTimeout(() => {
          router.push(isAdminMode ? "/admin" : "/student")
          router.refresh()
          onOpenChange(false)
        }, 1500)
      }
    } catch (error: unknown) {
      console.error("[v0] Caught error during registration:", error)

      let errorMessage = "An unexpected error occurred. Please try again."

      if (error instanceof Error) {
        // Check for connection errors
        if (error.message.includes("Failed to fetch") || error.message.includes("Load failed")) {
          errorMessage =
            "Unable to connect to the authentication service. Please check your internet connection and try again."
        }
        // Check for existing user errors
        else if (error.message.includes("User already registered")) {
          errorMessage = "This email is already registered. Please try logging in instead."
        }
        // Check if error message is the confusing "{}" string
        else if (error.message === "{}" || error.message === "[object Object]") {
          errorMessage = "A connection error occurred. Please check your network or contact support."
        } else {
          errorMessage = error.message
        }
      } else if (typeof error === "object" && error !== null) {
        // Handle cases where error might be an object but not an Error instance
        // Try to extract a message or fallback
        const msg = (error as any).message || (error as any).error_description
        if (msg && typeof msg === "string") {
          errorMessage = msg
        }
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">Welcome to SLTC Uni Votes</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Register to participate in campus elections
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

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-name">Full Name</Label>
            <Input
              id="register-name"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          {!isAdminMode && (
            <div className="space-y-2">
              <Label htmlFor="register-student-id">Student ID</Label>
              <Input
                id="register-student-id"
                type="text"
                placeholder="SLT12345"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="register-mobile">Mobile Number</Label>
            <Input
              id="register-mobile"
              type="tel"
              placeholder="0771234567"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter your mobile number (e.g., 0771234567). This will be used for password reset.
            </p>
          </div>
          {isAdminMode && (
            <div className="space-y-2">
              <Label htmlFor="admin-code">Admin Code</Label>
              <Input
                id="admin-code"
                type="password"
                placeholder="Enter admin code"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Contact system administrator for admin code</p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              placeholder={isAdminMode ? "admin@sltc.ac.lk" : "student@sltc.ac.lk"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Only @sltc.ac.lk and @sltc.edu emails are allowed</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <div className="relative">
            <Input
              id="register-password"
                type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
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
          {success && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <AlertDescription className="text-sm leading-relaxed">{success}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registering..." : `Register as ${isAdminMode ? "Admin" : "Student"}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
