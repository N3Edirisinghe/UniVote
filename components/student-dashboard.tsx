"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VoteModal } from "@/components/vote-modal"
import { ElectionResults } from "@/components/election-results"
import { Calendar, CheckCircle2, Clock, TrendingUp, Users, Award, Star, Zap } from "lucide-react"

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

interface StudentDashboardProps {
  elections: Election[]
  votedElectionIds: string[]
}

export function StudentDashboard({
  elections: initialElections,
  votedElectionIds: initialVotedIds,
}: StudentDashboardProps) {
  const [elections, setElections] = useState(initialElections)
  const [votedElectionIds, setVotedElectionIds] = useState(initialVotedIds)
  const [selectedElection, setSelectedElection] = useState<Election | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [voteModalOpen, setVoteModalOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

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

  const handleVoteClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setVoteModalOpen(true)
  }

  const handleVoteSuccess = () => {
    if (selectedElection) {
      setVotedElectionIds([...votedElectionIds, selectedElection.id])
      loadCandidates(selectedElection.id)
    }
  }

  useEffect(() => {
    if (!selectedElection) return

    const supabase = createClient()

    // Subscribe to candidate changes
    const channel = supabase
      .channel(`candidates-${selectedElection.id}`)
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
      .channel("elections")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "elections",
        },
        () => {
          // Reload elections when any election changes
          supabase
            .from("elections")
            .select("*")
            .order("start_date", { ascending: false })
            .then(({ data }) => {
              if (data) setElections(data)
            })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const activeElections = elections.filter((e) => e.status === "active")
  const upcomingElections = elections.filter((e) => e.status === "upcoming")
  const endedElections = elections.filter((e) => e.status === "ended")

  const hasVoted = selectedElection ? votedElectionIds.includes(selectedElection.id) : false

  useEffect(() => {
    if (activeElections.length > 0 && !selectedElection) {
      handleElectionSelect(activeElections[0])
    }
  }, [])

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 shadow-xl backdrop-blur-sm">
              <Award className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">Student Dashboard</h1>
              <p className="mt-1 text-base text-white/95">Participate in campus elections and make your voice heard</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Card className="overflow-hidden border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-900">Elections</CardTitle>
                    <CardDescription className="text-sm text-slate-600">Select to view</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-muted/50 h-8">
                    <TabsTrigger
                      value="active"
                      className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Active
                    </TabsTrigger>
                    <TabsTrigger
                      value="upcoming"
                      className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Upcoming
                    </TabsTrigger>
                    <TabsTrigger
                      value="ended"
                      className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Ended
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="active" className="mt-3 space-y-2">
                    {activeElections.length === 0 ? (
                      <div className="rounded-xl bg-muted/30 p-4 text-center">
                        <Clock className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                        <p className="text-xs font-medium text-slate-600">No active elections</p>
                      </div>
                    ) : (
                      activeElections.map((election) => (
                        <Button
                          key={election.id}
                          variant={selectedElection?.id === election.id ? "default" : "outline"}
                          className={`w-full justify-start text-left text-sm transition-all h-9 ${
                            selectedElection?.id === election.id
                              ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-600/30 hover:bg-blue-700"
                              : "text-slate-900 hover:bg-blue-50 hover:border-blue-200"
                          }`}
                          onClick={() => handleElectionSelect(election)}
                        >
                          <div className="flex w-full items-center justify-between gap-2">
                            <span className="truncate font-medium">{election.title}</span>
                            {votedElectionIds.includes(election.id) && (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                            )}
                          </div>
                        </Button>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="upcoming" className="mt-3 space-y-2">
                    {upcomingElections.length === 0 ? (
                      <div className="rounded-xl bg-muted/30 p-4 text-center">
                        <Calendar className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                        <p className="text-xs font-medium text-slate-600">No upcoming elections</p>
                      </div>
                    ) : (
                      upcomingElections.map((election) => (
                        <Button
                          key={election.id}
                          variant={selectedElection?.id === election.id ? "default" : "outline"}
                          className={`w-full justify-start text-left text-sm transition-all h-9 ${
                            selectedElection?.id === election.id
                              ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-600/30 hover:bg-blue-700"
                              : "text-slate-900 hover:bg-blue-50 hover:border-blue-200"
                          }`}
                          onClick={() => handleElectionSelect(election)}
                        >
                          <span className="truncate font-medium">{election.title}</span>
                        </Button>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="ended" className="mt-3 space-y-2">
                    {endedElections.length === 0 ? (
                      <div className="rounded-xl bg-muted/30 p-4 text-center">
                        <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                        <p className="text-xs font-medium text-slate-600">No ended elections</p>
                      </div>
                    ) : (
                      endedElections.map((election) => (
                        <Button
                          key={election.id}
                          variant={selectedElection?.id === election.id ? "default" : "outline"}
                          className={`w-full justify-start text-left text-sm transition-all h-9 ${
                            selectedElection?.id === election.id
                              ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-600/30 hover:bg-blue-700"
                              : "text-slate-900 hover:bg-blue-50 hover:border-blue-200"
                          }`}
                          onClick={() => handleElectionSelect(election)}
                        >
                          <span className="truncate font-medium">{election.title}</span>
                        </Button>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {selectedElection ? (
              <div className="space-y-4">
                {selectedElection.status === "ended" ? (
                  <ElectionResults
                    electionTitle={selectedElection.title}
                    electionDescription={selectedElection.description}
                    candidates={candidates}
                  />
                ) : (
                  <>
                    <Card className="overflow-hidden border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50 pb-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-slate-900">
                              {selectedElection.title}
                            </CardTitle>
                            <CardDescription className="text-sm text-slate-600">
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
                            className="text-xs font-bold px-3 py-1 shrink-0"
                          >
                            {selectedElection.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-3 shadow-sm">
                            <Calendar className="h-5 w-5 text-blue-600 shrink-0" />
                            <span className="text-sm font-semibold text-slate-900">
                              {new Date(selectedElection.start_date).toLocaleDateString()} -{" "}
                              {new Date(selectedElection.end_date).toLocaleDateString()}
                            </span>
                          </div>
                          {hasVoted && (
                            <div className="flex items-center gap-3 rounded-xl bg-green-100 p-3 text-green-700 shadow-sm">
                              <CheckCircle2 className="h-5 w-5 shrink-0" />
                              <span className="text-sm font-semibold">You have voted in this election</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Candidates</h2>
                      </div>
                      {candidates.length === 0 ? (
                        <Card className="border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
                          <CardContent className="py-12 text-center">
                            <Users className="mx-auto mb-3 h-16 w-16 text-muted-foreground/30" />
                            <p className="text-base font-medium text-slate-600">No candidates yet</p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-3">
                          {candidates.map((candidate, index) => (
                            <Card
                              key={candidate.id}
                              className="group overflow-hidden border-0 bg-white/95 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] hover:-translate-y-1"
                            >
                              <CardHeader className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 pb-4 relative">
                                {/* Rank badge */}
                                <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg">
                                  <span className="text-xs font-bold text-white">#{index + 1}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                  {candidate.image_url ? (
                                    <img
                                      src={candidate.image_url || "/placeholder.svg"}
                                      alt={candidate.name}
                                      className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white shadow-xl transition-transform group-hover:scale-110"
                                    />
                                  ) : (
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-xl ring-4 ring-white transition-transform group-hover:scale-110">
                                      <span className="text-3xl font-bold text-white">{candidate.name.charAt(0)}</span>
                                    </div>
                                  )}
                                  <div className="flex-1 space-y-1">
                                    <CardTitle className="text-lg font-bold text-slate-900">{candidate.name}</CardTitle>
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                      <CardDescription className="text-xs font-semibold text-blue-600">
                                        {candidate.position}
                                      </CardDescription>
                                    </div>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3 pt-4">
                                {candidate.manifesto && (
                                  <div className="space-y-1">
                                    <p className="text-xs font-semibold text-slate-700">Manifesto</p>
                                    <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">
                                      {candidate.manifesto}
                                    </p>
                                  </div>
                                )}
                                <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 p-3 shadow-sm border border-blue-100">
                                  <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-md">
                                      <TrendingUp className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold text-slate-600">Votes</p>
                                      <p className="text-lg font-bold text-blue-600">{candidate.vote_count}</p>
                                    </div>
                                  </div>
                                  {selectedElection.status === "active" && !hasVoted && (
                                    <Button
                                      onClick={() => handleVoteClick(candidate)}
                                      className="bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg transition-all hover:shadow-xl hover:scale-105 text-white font-semibold text-xs h-8 px-2"
                                    >
                                      <Zap className="mr-1 h-3 w-3" />
                                      Vote
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Card className="border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
                <CardContent className="py-20 text-center">
                  <Clock className="mx-auto mb-4 h-20 w-20 text-muted-foreground/30" />
                  <p className="text-lg font-semibold text-slate-600">Select an election to view candidates</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <VoteModal
        open={voteModalOpen}
        onOpenChange={setVoteModalOpen}
        candidate={selectedCandidate}
        electionId={selectedElection?.id || ""}
        onVoteSuccess={handleVoteSuccess}
      />
    </div>
  )
}
