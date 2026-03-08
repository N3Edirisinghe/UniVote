"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreateElectionModal } from "@/components/create-election-modal"
import { AddCandidateModal } from "@/components/add-candidate-modal"
import { deleteElection } from "@/lib/actions/elections"
import { Plus, Users, TrendingUp, Trash2, Calendar } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ElectionResults } from "@/components/election-results"

interface Election {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string
  status: string
}

interface Candidate {
  id: string
  name: string
  position: string
  manifesto: string | null
  image_url: string | null
  vote_count: number
}

interface Profile {
  id: string
  full_name: string | null
  email: string
  role: string
  avatar_url?: string | null
  position?: string | null
  contact_number?: string | null
}

interface AdminDashboardProps {
  elections: Election[]
  profile: Profile
}

export function AdminDashboard({ elections: initialElections, profile }: AdminDashboardProps) {
  const [elections, setElections] = useState(initialElections)
  const [selectedElection, setSelectedElection] = useState<Election | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [createElectionOpen, setCreateElectionOpen] = useState(false)
  const [addCandidateOpen, setAddCandidateOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [candidateToDelete, setCandidateToDelete] = useState<string | null>(null)
  const [deleteElectionDialogOpen, setDeleteElectionDialogOpen] = useState(false)
  const [electionToDelete, setElectionToDelete] = useState<string | null>(null)
  const [isDeletingElection, setIsDeletingElection] = useState(false)

  const loadElections = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("elections").select("*").order("created_at", { ascending: false })
    setElections(data || [])
  }

  const loadCandidates = async (electionId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from("candidates")
      .select("*")
      .eq("election_id", electionId)
      .order("vote_count", { ascending: false })
    setCandidates(data || [])
  }

  const handleElectionSelect = (election: Election) => {
    setSelectedElection(election)
    loadCandidates(election.id)
  }

  const handleDeleteCandidate = async () => {
    if (!candidateToDelete) return

    const supabase = createClient()
    await supabase.from("candidates").delete().eq("id", candidateToDelete)

    if (selectedElection) {
      loadCandidates(selectedElection.id)
    }
    setDeleteDialogOpen(false)
    setCandidateToDelete(null)
  }

  const handleDeleteElection = async () => {
    if (!electionToDelete) return

    setIsDeletingElection(true)
    try {
      const result = await deleteElection(electionToDelete)
      if (result.success) {
        // If we deleted the currently selected election, clear selection
        if (selectedElection?.id === electionToDelete) {
          setSelectedElection(null)
          setCandidates([])
        }
        // Reload elections list
        await loadElections()
        setDeleteElectionDialogOpen(false)
        setElectionToDelete(null)
      } else {
        alert(result.error || "Failed to delete election")
      }
    } catch (error) {
      console.error("Error deleting election:", error)
      alert("An error occurred while deleting the election")
    } finally {
      setIsDeletingElection(false)
    }
  }

  const handleUpdateElectionStatus = async (electionId: string, status: string) => {
    const supabase = createClient()
    await supabase.from("elections").update({ status }).eq("id", electionId)
    loadElections()
    if (selectedElection?.id === electionId) {
      setSelectedElection({ ...selectedElection, status })
    }
  }

  useEffect(() => {
    if (!selectedElection) return

    const supabase = createClient()

    const channel = supabase
      .channel(`admin-candidates-${selectedElection.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "candidates",
          filter: `election_id=eq.${selectedElection.id}`,
        },
        () => {
          loadCandidates(selectedElection.id)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedElection])

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel("admin-elections")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "elections",
        },
        () => {
          loadElections()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (elections.length > 0 && !selectedElection) {
      handleElectionSelect(elections[0])
    }
  }, [])

  const totalVotes = candidates.reduce((sum, c) => sum + c.vote_count, 0)

  return (
    <div className="min-h-screen w-full px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold text-black">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-base font-medium text-black">Manage elections and candidates</p>
        </div>
        <Button
          onClick={() => setCreateElectionOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Election
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Elections List - Reduced font size */}
        <div className="lg:col-span-1">
          <Card className="border-blue-100 bg-white/95 shadow-lg backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-slate-800">Elections</CardTitle>
              <CardDescription className="text-sm text-slate-600">{elections.length} total</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {elections.length === 0 ? (
                <p className="text-xs text-muted-foreground">No elections yet</p>
              ) : (
                elections.map((election) => (
                  <div
                    key={election.id}
                    className="flex items-center gap-1 rounded-md border border-border bg-background p-1 transition-all hover:bg-accent"
                  >
                    <Button
                      variant={selectedElection?.id === election.id ? "default" : "ghost"}
                      className="flex-1 justify-start text-sm transition-all hover:scale-[1.02]"
                      onClick={() => handleElectionSelect(election)}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="truncate text-xs font-medium">{election.title}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {election.status}
                        </Badge>
                      </div>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 hover:bg-red-100 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        setElectionToDelete(election.id)
                        setDeleteElectionDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Election Details - Full width landscape */}
        <div className="lg:col-span-3">
          {selectedElection ? (
            <div className="space-y-6">
              <Card className="border-blue-100 bg-white/95 shadow-lg backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-900">{selectedElection.title}</CardTitle>
                      <CardDescription className="mt-1 text-sm text-slate-600">
                        {selectedElection.description}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        selectedElection.status === "active"
                          ? "default"
                          : selectedElection.status === "upcoming"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-xs font-medium"
                    >
                      {selectedElection.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs">
                      {new Date(selectedElection.start_date).toLocaleDateString()} -{" "}
                      {new Date(selectedElection.end_date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {selectedElection.status === "upcoming" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateElectionStatus(selectedElection.id, "active")}
                        className="bg-gradient-to-r from-green-600 to-green-700 text-xs"
                      >
                        Start Election
                      </Button>
                    )}
                    {selectedElection.status === "active" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdateElectionStatus(selectedElection.id, "ended")}
                        className="text-xs"
                      >
                        End Election
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setElectionToDelete(selectedElection.id)
                        setDeleteElectionDialogOpen(true)
                      }}
                      className="text-xs"
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" />
                      Delete Election
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-lg">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-xs font-medium text-slate-600">Total Candidates</CardDescription>
                    <CardTitle className="text-3xl font-bold text-blue-700">{candidates.length}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="border-green-100 bg-gradient-to-br from-green-50 to-white shadow-lg">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-xs font-medium text-slate-600">Total Votes</CardDescription>
                    <CardTitle className="text-3xl font-bold text-green-700">{totalVotes}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-white shadow-lg">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-xs font-medium text-slate-600">Status</CardDescription>
                    <CardTitle className="text-3xl font-bold capitalize text-purple-700">
                      {selectedElection.status}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              {selectedElection.status === "ended" && (
                <ElectionResults
                  electionTitle={selectedElection.title}
                  electionDescription={selectedElection.description}
                  candidates={candidates}
                />
              )}

              {selectedElection.status !== "ended" && (
                <Card className="border-blue-100 bg-white/95 shadow-lg backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold text-slate-900">Candidates</CardTitle>
                        <CardDescription className="text-sm text-slate-600">
                          Manage candidates for this election
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => setAddCandidateOpen(true)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg transition-all hover:scale-105 text-xs"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Candidate
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {candidates.length === 0 ? (
                      <p className="text-center text-xs text-muted-foreground">No candidates yet</p>
                    ) : (
                      <div className="space-y-3">
                        {candidates.map((candidate) => (
                          <div
                            key={candidate.id}
                            className="flex items-center justify-between rounded-lg border border-blue-100 bg-gradient-to-r from-white to-blue-50/30 p-3 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
                          >
                            <div className="flex items-center gap-3">
                              {candidate.image_url ? (
                                <img
                                  src={candidate.image_url || "/placeholder.svg"}
                                  alt={candidate.name}
                                  className="h-12 w-12 rounded-full border-2 border-blue-200 object-cover shadow-md"
                                />
                              ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-200 bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                                  <span className="text-sm font-bold text-white">{candidate.name.charAt(0)}</span>
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{candidate.name}</p>
                                <p className="text-xs text-slate-600">{candidate.position}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                <TrendingUp className="h-3 w-3" />
                                <span>{candidate.vote_count}</span>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                                onClick={() => {
                                  setCandidateToDelete(candidate.id)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="border-blue-100 bg-white/95 shadow-lg backdrop-blur-sm">
              <CardContent className="py-16 text-center text-muted-foreground">
                <Users className="mx-auto mb-4 h-12 w-12" />
                <p className="text-sm">Select an election to manage</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <CreateElectionModal open={createElectionOpen} onOpenChange={setCreateElectionOpen} onSuccess={loadElections} />

      {selectedElection && (
        <AddCandidateModal
          open={addCandidateOpen}
          onOpenChange={setAddCandidateOpen}
          electionId={selectedElection.id}
          onSuccess={() => loadCandidates(selectedElection.id)}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this candidate? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCandidate}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteElectionDialogOpen} onOpenChange={setDeleteElectionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Election</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this election? This will permanently delete the election, all candidates,
              and all votes associated with it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingElection}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteElection}
              disabled={isDeletingElection}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingElection ? "Deleting..." : "Delete Election"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
