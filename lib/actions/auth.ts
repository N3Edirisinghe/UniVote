"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    return null
  }

  return profile
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/")
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  const profile = await getUserProfile(user.id)

  if (!profile || profile.role !== "admin") {
    redirect("/student")
  }

  return { user, profile }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function resendConfirmationEmail(email: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function resetPassword(email: string) {
  const supabase = await createClient()
  // Use the origin from the request or fallback to localhost
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const redirectUrl = `${baseUrl}/reset-password`

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function verifyMobileNumber(mobileNumber: string) {
  const supabase = await createClient()
  
  // Clean mobile number (remove spaces, dashes, etc.) to match registration format
  const cleanMobileNumber = mobileNumber.trim().replace(/[\s-]/g, "")
  
  // Find user by mobile number
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("mobile_number", cleanMobileNumber)
    .single()

  if (profileError || !profile) {
    return { success: false, error: "Mobile number not found. Please check your number or register first with a mobile number." }
  }

  return { success: true, userId: profile.id, email: profile.email }
}

export async function resetPasswordByMobileNumberDirect(mobileNumber: string, newPassword: string) {
  try {
    const supabase = await createClient()
    
    // Clean mobile number
    const cleanMobileNumber = mobileNumber.trim().replace(/[\s-]/g, "")
    
    // Find user by mobile number
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("mobile_number", cleanMobileNumber)
      .single()

    if (profileError || !profile) {
      console.error("[Password Reset] Profile not found:", profileError)
      return { success: false, error: "Mobile number not found. Please check your number or register first with a mobile number." }
    }

    // Validate password
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." }
    }

    // Use admin API for direct password update (REQUIRED - no email fallback)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    
    if (!serviceRoleKey || !supabaseUrl) {
      console.error("[Password Reset] Service role key or URL not configured")
      return { 
        success: false, 
        error: "Direct password reset is not configured. Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables. Get it from Supabase Dashboard → Settings → API → Service Role Key" 
      }
    }

    try {
      // Use admin client to update password directly
      const { createClient: createAdminClient } = await import("@supabase/supabase-js")
      
      const adminClient = createAdminClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      // Update password using admin API
      const { data: updatedUser, error: updateError } = await adminClient.auth.admin.updateUserById(profile.id, {
        password: newPassword,
      })

      if (updateError) {
        console.error("[Password Reset] Admin API error:", updateError)
        
        // Provide specific error message for invalid API key
        if (updateError.message.includes("Invalid API key") || updateError.message.includes("JWT")) {
          return { 
            success: false, 
            error: `Invalid service role key. Please:\n1. Go to Supabase Dashboard → Settings → API\n2. Copy the SERVICE_ROLE key (not anon key)\n3. Replace SUPABASE_SERVICE_ROLE_KEY in .env.local\n4. Restart your server` 
          }
        }
        
        return { success: false, error: `Failed to update password: ${updateError.message}. Please check your service role key configuration.` }
      }

      if (!updatedUser || !updatedUser.user) {
        console.error("[Password Reset] No user returned from update")
        return { success: false, error: "Password update failed. User not found. Please try again." }
      }

      console.log("[Password Reset] Password updated successfully for user:", profile.email)
      return { success: true, email: profile.email }
    } catch (adminError: any) {
      console.error("[Password Reset] Admin client error:", adminError)
      return { 
        success: false, 
        error: `Password update failed: ${adminError.message || "Unknown error"}. Please check your SUPABASE_SERVICE_ROLE_KEY configuration.` 
      }
    }
  } catch (error: any) {
    console.error("[Password Reset] Unexpected error:", error)
    return { success: false, error: error.message || "An unexpected error occurred. Please try again." }
  }
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
