"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "./auth"

export async function createElection(formData: {
  title: string
  description: string
  startDate: string
  endDate: string
}) {
  try {
    const { user } = await requireAdmin()
    const supabase = await createClient()

    // Validate dates
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const now = new Date()

    if (end <= start) {
      return { success: false, error: "End date must be after start date" }
    }

    // Determine status based on start date
    const status = start > now ? "upcoming" : "active"

    const { error } = await supabase.from("elections").insert({
      title: formData.title,
      description: formData.description,
      start_date: formData.startDate,
      end_date: formData.endDate,
      status,
      created_by: user.id,
    })

    if (error) {
      console.error("[v0] Election creation error:", error)
      return { success: false, error: "Failed to create election" }
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("[v0] Unexpected election creation error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateElectionStatus(electionId: string, status: "upcoming" | "active" | "ended") {
  try {
    await requireAdmin()
    const supabase = await createClient()

    const { error } = await supabase.from("elections").update({ status }).eq("id", electionId)

    if (error) {
      console.error("[v0] Election status update error:", error)
      return { success: false, error: "Failed to update election status" }
    }

    revalidatePath("/admin")
    revalidatePath("/student")
    return { success: true }
  } catch (error) {
    console.error("[v0] Unexpected election status update error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteElection(electionId: string) {
  try {
    await requireAdmin()
    const supabase = await createClient()

    // Delete all votes for this election first
    await supabase.from("votes").delete().eq("election_id", electionId)

    // Delete all candidates for this election
    await supabase.from("candidates").delete().eq("election_id", electionId)

    // Delete the election
    const { error } = await supabase.from("elections").delete().eq("id", electionId)

    if (error) {
      console.error("[v0] Election deletion error:", error)
      return { success: false, error: "Failed to delete election" }
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("[v0] Unexpected election deletion error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getElections() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("elections").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Elections fetch error:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("[v0] Unexpected elections fetch error:", error)
    return []
  }
}

export async function getActiveElections() {
  try {
    const supabase = await createClient()
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from("elections")
      .select("*")
      .eq("status", "active")
      .lte("start_date", now)
      .gte("end_date", now)
      .order("start_date", { ascending: false })

    if (error) {
      console.error("[v0] Active elections fetch error:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("[v0] Unexpected active elections fetch error:", error)
    return []
  }
}
