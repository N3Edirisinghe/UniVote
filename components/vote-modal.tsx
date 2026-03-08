"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Candidate {
  id: string
  name: string
  position: string
  manifesto: string | null
  image_url: string | null
}

interface VoteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidate: Candidate | null
  electionId: string
  onVoteSuccess: () => void
}

export function VoteModal({ open, onOpenChange, candidate, electionId, onVoteSuccess }: VoteModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVote = async () => {
    if (!candidate) return

    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error: voteError } = await supabase.from("votes").insert({
        election_id: electionId,
        candidate_id: candidate.id,
        voter_id: user.id,
      })

      if (voteError) throw voteError

      onVoteSuccess()
      onOpenChange(false)
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("duplicate")) {
          setError("You have already voted in this election")
        } else {
          setError(error.message)
        }
      } else {
        setError("An error occurred while voting")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Your Vote</DialogTitle>
          <DialogDescription>Are you sure you want to vote for this candidate?</DialogDescription>
        </DialogHeader>

        {candidate && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {candidate.image_url ? (
                <img
                  src={candidate.image_url || "/placeholder.svg"}
                  alt={candidate.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <span className="text-2xl font-bold">{candidate.name.charAt(0)}</span>
                </div>
              )}
              <div>
                <h3 className="font-semibold">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground">{candidate.position}</p>
              </div>
            </div>

            {candidate.manifesto && (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm">{candidate.manifesto}</p>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleVote} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Confirm Vote"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
