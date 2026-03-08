"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth"

export async function updateProfile(formData: {
  fullName?: string
  avatarUrl?: string
  studentId?: string
  faculty?: string
  mobileNumber?: string
  currentYear?: string
  regNo?: string
  position?: string
  contactNumber?: string
}) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const supabase = await createClient()

    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single()

    if (fetchError || !existingProfile) {
      return { success: false, error: "Profile not found" }
    }

    const updateData: Record<string, string> = {}
    if (formData.fullName !== undefined) updateData.full_name = formData.fullName
    if (formData.avatarUrl !== undefined) updateData.avatar_url = formData.avatarUrl
    if (formData.studentId !== undefined) updateData.student_id = formData.studentId
    if (formData.faculty !== undefined) updateData.faculty = formData.faculty
    if (formData.mobileNumber !== undefined) updateData.mobile_number = formData.mobileNumber
    if (formData.currentYear !== undefined) updateData.current_year = formData.currentYear
    if (formData.regNo !== undefined) updateData.reg_no = formData.regNo
    if (formData.position !== undefined) updateData.position = formData.position
    if (formData.contactNumber !== undefined) updateData.contact_number = formData.contactNumber

    const { error } = await supabase.from("profiles").update(updateData).eq("id", user.id)

    if (error) {
      console.error("[v0] Profile update error:", error)
      return { success: false, error: "Failed to update profile" }
    }

    revalidatePath("/student")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("[v0] Unexpected profile update error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getProfile() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated", profile: null }
    }

    const supabase = await createClient()
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error) {
      console.error("[v0] Profile fetch error:", error)
      return { success: false, error: "Failed to fetch profile", profile: null }
    }

    return { success: true, profile }
  } catch (error) {
    console.error("[v0] Unexpected profile fetch error:", error)
    return { success: false, error: "An unexpected error occurred", profile: null }
  }
}
