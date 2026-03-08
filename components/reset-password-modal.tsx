"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { verifyMobileNumber, resetPasswordByMobileNumberDirect } from "@/lib/actions/auth"
import { Eye, EyeOff } from "lucide-react"

interface ResetPasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResetPasswordModal({ open, onOpenChange }: ResetPasswordModalProps) {
  const [step, setStep] = useState<"verify" | "reset">("verify")
  const [mobileNumber, setMobileNumber] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [verifiedEmail, setVerifiedEmail] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleVerifyMobile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setSuccessMessage("")

    // Mobile number validation
    const cleanMobileNumber = mobileNumber.trim().replace(/[\s-]/g, "")
    if (!cleanMobileNumber || cleanMobileNumber.length < 9) {
      setError("Please enter a valid mobile number (at least 9 digits).")
      setIsLoading(false)
      return
    }

    try {
      const result = await verifyMobileNumber(cleanMobileNumber)
      if (result.success) {
        setVerifiedEmail(result.email || "")
        setStep("reset")
        setError(null)
      } else {
        setError(result.error || "Mobile number verification failed.")
      }
    } catch (err: any) {
      setError(err.message || "Mobile number verification failed.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setSuccessMessage("")

    // Password validation
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long.")
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      return
    }

    const cleanMobileNumber = mobileNumber.trim().replace(/[\s-]/g, "")

    try {
      // First verify mobile number again
      const verifyResult = await verifyMobileNumber(cleanMobileNumber)
      if (!verifyResult.success) {
        setError("Mobile number verification failed. Please start over.")
        setStep("verify")
        setIsLoading(false)
        return
      }

      // Reset password directly using mobile number
      const resetResult = await resetPasswordByMobileNumberDirect(cleanMobileNumber, newPassword)

      if (!resetResult.success) {
        setError(resetResult.error || "Failed to reset password. Please try again.")
        setIsLoading(false)
        return
      }

      // Direct password reset successful
      setSuccess(true)
      setSuccessMessage(
        `Password has been reset successfully! You can now login with your new password.`
      )

      // Reset form after delay
      setTimeout(() => {
        setMobileNumber("")
        setNewPassword("")
        setConfirmPassword("")
        setStep("verify")
        setSuccess(false)
        setSuccessMessage("")
        setVerifiedEmail("")
        onOpenChange(false)
      }, 5000)
    } catch (err: any) {
      setError(err.message || "Failed to reset password.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setStep("verify")
    setNewPassword("")
    setConfirmPassword("")
    setError(null)
    setSuccess(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">Reset Password</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {step === "verify"
              ? "Enter your mobile number to verify your account"
              : "Enter your new password. You'll receive an email link to complete the reset."}
          </DialogDescription>
        </DialogHeader>

        {step === "verify" ? (
          <form onSubmit={handleVerifyMobile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-mobile">Mobile Number</Label>
              <Input
                id="reset-mobile"
                type="tel"
                placeholder="0771234567"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter the mobile number you used during registration
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify Mobile Number"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {verifiedEmail && (
              <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
                <AlertDescription className="text-sm">
                  Verified: {verifiedEmail}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                <AlertDescription className="text-sm">{successMessage}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1" disabled={isLoading}>
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading || success}>
                {isLoading ? "Resetting..." : success ? "Email Sent!" : "Reset Password"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

