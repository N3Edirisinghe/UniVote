"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getEmailValidationError } from "@/lib/email-validation"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: "login" | "register"
}

export function AuthModal({ open, onOpenChange, defaultTab = "login" }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [adminCode, setAdminCode] = useState("")
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleModeSwitch = (adminMode: boolean) => {
    setIsAdminMode(adminMode)
    setError(null)
    setSuccess(null)
    setAdminCode("")
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      // Check user role and redirect
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", (await supabase.auth.getUser()).data.user?.id)
        .single()

      if (profile?.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/student")
      }
      onOpenChange(false)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
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
          },
        },
      })

      if (error) {
        throw error
      }

      if (data.user && data.user.email_confirmed_at) {
        setSuccess("Registration successful! Redirecting to your dashboard...")

        setTimeout(() => {
          router.push(isAdminMode ? "/admin" : "/student")
          router.refresh()
          onOpenChange(false)
        }, 1500)
      } else {
        setSuccess(
          "Registration successful! Please check your email inbox (and spam folder) for a confirmation link. Click the link to activate your account before logging in.",
        )
      }

      setEmail("")
      setPassword("")
      setFullName("")
      setStudentId("")
      setAdminCode("")
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          setError(
            "Unable to connect to the authentication service. Please check your internet connection and try again.",
          )
        } else if (error.message.includes("User already registered")) {
          setError("This email is already registered. Please try logging in instead.")
        } else {
          setError(error.message)
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to SLTC Uni Votes</DialogTitle>
          <DialogDescription>Login or register to participate in campus elections</DialogDescription>
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

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
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
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : `Login as ${isAdminMode ? "Admin" : "Student"}`}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
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
                <Input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
