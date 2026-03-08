"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "./auth"

export async function createCandidate(formData: {
  electionId: string
  name: string
  position: string
  manifesto: string
  imageUrl?: string
}) {
  try {
    await requireAdmin()
    const supabase = await createClient()

    // Verify election exists
    const { data: election, error: electionError } = await supabase
      .from("elections")
      .select("id")
      .eq("id", formData.electionId)
      .single()

    if (electionError || !election) {
      return { success: false, error: "Election not found" }
    }

    const { error } = await supabase.from("candidates").insert({
      election_id: formData.electionId,
      name: formData.name,
      position: formData.position,
      manifesto: formData.manifesto,
      image_url: formData.imageUrl || null,
      vote_count: 0,
    })

    if (error) {
      console.error("[v0] Candidate creation error:", error)
      return { success: false, error: "Failed to create candidate" }
    }

    revalidatePath("/admin")
    revalidatePath("/student")
    return { success: true }
  } catch (error) {
    console.error("[v0] Unexpected candidate creation error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteCandidate(candidateId: string) {
  try {
    await requireAdmin()
    const supabase = await createClient()

    // Delete all votes for this candidate first
    await supabase.from("votes").delete().eq("candidate_id", candidateId)

    // Delete the candidate
    const { error } = await supabase.from("candidates").delete().eq("id", candidateId)

    if (error) {
      console.error("[v0] Candidate deletion error:", error)
      return { success: false, error: "Failed to delete candidate" }
    }

    revalidatePath("/admin")
    revalidatePath("/student")
    return { success: true }
  } catch (error) {
    console.error("[v0] Unexpected candidate deletion error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getCandidatesByElection(electionId: string) {
  try {
    const supabase = await createClient()

    const { data: election, error: electionError } = await supabase
      .from("elections")
      .select("id")
      .eq("id", electionId)
      .single()

    if (electionError || !election) {
      console.error("[v0] Election not found:", electionError)
      return []
    }

    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("election_id", electionId)
      .order("vote_count", { ascending: false })

    if (error) {
      console.error("[v0] Candidates fetch error:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("[v0] Unexpected candidates fetch error:", error)
    return []
  }
}

export async function updateCandidate(
  candidateId: string,
  formData: {
    name?: string
    position?: string
    manifesto?: string
    imageUrl?: string
  },
) {
  try {
    await requireAdmin()
    const supabase = await createClient()

    const updateData: Record<string, string | null> = {}
    if (formData.name !== undefined) updateData.name = formData.name
    if (formData.position !== undefined) updateData.position = formData.position
    if (formData.manifesto !== undefined) updateData.manifesto = formData.manifesto
    if (formData.imageUrl !== undefined) updateData.image_url = formData.imageUrl

    const { error } = await supabase.from("candidates").update(updateData).eq("id", candidateId)

    if (error) {
      console.error("[v0] Candidate update error:", error)
      return { success: false, error: "Failed to update candidate" }
    }

    revalidatePath("/admin")
    revalidatePath("/student")
    return { success: true }
  } catch (error) {
    console.error("[v0] Unexpected candidate update error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
