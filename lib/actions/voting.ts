"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth"

export async function submitVote(electionId: string, candidateId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "You must be logged in to vote" }
    }

    const supabase = await createClient()

    // Check if election is active
    const { data: election, error: electionError } = await supabase
      .from("elections")
      .select("status")
      .eq("id", electionId)
      .single()

    if (electionError || !election) {
      return { success: false, error: "Election not found" }
    }

    if (election.status !== "active") {
      return { success: false, error: "This election is not currently active" }
    }

    // Check if user has already voted
    const { data: existingVote } = await supabase
      .from("votes")
      .select("id")
      .eq("election_id", electionId)
      .eq("voter_id", user.id)
      .single()

    if (existingVote) {
      return { success: false, error: "You have already voted in this election" }
    }

    // Verify candidate belongs to this election
    const { data: candidate, error: candidateError } = await supabase
      .from("candidates")
      .select("id")
      .eq("id", candidateId)
      .eq("election_id", electionId)
      .single()

    if (candidateError || !candidate) {
      return { success: false, error: "Invalid candidate" }
    }

    const { error: voteError } = await supabase.from("votes").insert({
      election_id: electionId,
      candidate_id: candidateId,
      voter_id: user.id,
    })

    if (voteError) {
      console.error("[v0] Vote submission error:", voteError)
      return { success: false, error: "Failed to submit vote. Please try again." }
    }

    await supabase
      .from("candidates")
      .update({ vote_count: supabase.rpc("increment_vote_count", { candidate_id: candidateId }) })
      .eq("id", candidateId)

    revalidatePath("/student")
    return { success: true }
  } catch (error) {
    console.error("[v0] Unexpected voting error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function hasUserVoted(electionId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return false
    }

    const supabase = await createClient()
    const { data } = await supabase
      .from("votes")
      .select("id")
      .eq("election_id", electionId)
      .eq("voter_id", user.id)
      .maybeSingle()

    return !!data
  } catch {
    return false
  }
}

export async function getUserVotedElections() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return []
    }

    const supabase = await createClient()
    const { data } = await supabase.from("votes").select("election_id").eq("voter_id", user.id)

    return data?.map((v) => v.election_id) || []
  } catch {
    return []
  }
}
