"use client"

import type React from "react"

import { useState } from "react"
import { updateProfile } from "@/lib/actions/profile"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProfileEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: {
    id: string
    full_name: string | null
    email: string
    student_id: string | null
    role: string
    avatar_url?: string | null
    faculty?: string | null
    mobile_number?: string | null
    current_year?: string | null
    reg_no?: string | null
    position?: string | null
    contact_number?: string | null
  }
}

export function ProfileEditModal({ open, onOpenChange, profile }: ProfileEditModalProps) {
  const isStudent = profile.role === "student"

  const [fullName, setFullName] = useState(profile.full_name || "")
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "")
  const [faculty, setFaculty] = useState(profile.faculty || "")
  const [mobileNumber, setMobileNumber] = useState(profile.mobile_number || "")
  const [currentYear, setCurrentYear] = useState(profile.current_year || "")
  const [regNo, setRegNo] = useState(profile.reg_no || "")
  const [position, setPosition] = useState(profile.position || "")
  const [contactNumber, setContactNumber] = useState(profile.contact_number || "")
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB")
      return
    }

    setUploading(true)
    setError("")

    try {
      // Convert image to base64 for simple storage
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string)
        setUploading(false)
      }
      reader.onerror = () => {
        setError("Failed to read image file")
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError("Failed to upload image")
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!fullName.trim()) {
      setError("Full name is required")
      return
    }

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const result = await updateProfile({
        fullName: fullName.trim(),
        avatarUrl: avatarUrl || undefined,
        ...(isStudent
          ? {
              faculty: faculty.trim() || undefined,
              mobileNumber: mobileNumber.trim() || undefined,
              currentYear: currentYear || undefined,
              regNo: regNo.trim() || undefined,
            }
          : {
              position: position.trim() || undefined,
              contactNumber: contactNumber.trim() || undefined,
            }),
      })

      if (!result.success) {
        setError(result.error || "Failed to update profile")
        return
      }

      setSuccess("Profile updated successfully!")
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white text-gray-900 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Edit Profile</DialogTitle>
          <DialogDescription className="text-gray-600">Update your profile information and photo</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl || undefined} alt={fullName} />
              <AvatarFallback className="bg-blue-100 text-2xl text-blue-600">
                {fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                  <span>
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Photo
                      </>
                    )}
                  </span>
                </Button>
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <p className="text-xs text-gray-500">Max size: 2MB</p>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full-name" className="text-gray-900">
              Full Name
            </Label>
            <Input
              id="full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="bg-white text-gray-900"
            />
          </div>

          {isStudent ? (
            <>
              {/* Registration Number */}
              <div className="space-y-2">
                <Label htmlFor="reg-no" className="text-gray-900">
                  Registration Number
                </Label>
                <Input
                  id="reg-no"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  placeholder="Enter registration number"
                  className="bg-white text-gray-900"
                />
              </div>

              {/* Faculty */}
              <div className="space-y-2">
                <Label htmlFor="faculty" className="text-gray-900">
                  Faculty
                </Label>
                <Select value={faculty} onValueChange={setFaculty}>
                  <SelectTrigger className="bg-white text-gray-900">
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computing">Computing</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Humanities">Humanities</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Current Year */}
              <div className="space-y-2">
                <Label htmlFor="current-year" className="text-gray-900">
                  Current Year
                </Label>
                <Select value={currentYear} onValueChange={setCurrentYear}>
                  <SelectTrigger className="bg-white text-gray-900">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <Label htmlFor="mobile-number" className="text-gray-900">
                  Mobile Number
                </Label>
                <Input
                  id="mobile-number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter mobile number"
                  className="bg-white text-gray-900"
                />
              </div>
            </>
          ) : (
            <>
              {/* Position */}
              <div className="space-y-2">
                <Label htmlFor="position" className="text-gray-900">
                  Position
                </Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Enter your position"
                  className="bg-white text-gray-900"
                />
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <Label htmlFor="contact-number" className="text-gray-900">
                  Contact Number
                </Label>
                <Input
                  id="contact-number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Enter contact number"
                  className="bg-white text-gray-900"
                />
              </div>
            </>
          )}

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900">
              Email
            </Label>
            <Input id="email" value={profile.email || ""} disabled className="bg-gray-100 text-gray-600" />
          </div>

          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1" disabled={saving || uploading}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
