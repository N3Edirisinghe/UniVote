"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp } from "lucide-react"

interface Candidate {
  id: string
  name: string
  position: string
  manifesto: string | null
  image_url: string | null
  vote_count: number
}

interface ElectionResultsProps {
  electionTitle: string
  electionDescription: string | null
  candidates: Candidate[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF6B9D"]

export function ElectionResults({ electionTitle, electionDescription, candidates }: ElectionResultsProps) {
  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.vote_count, 0)

  const winner = candidates.reduce(
    (prev, current) => (current.vote_count > prev.vote_count ? current : prev),
    candidates[0],
  )

  const sortedCandidates = [...candidates].sort((a, b) => b.vote_count - a.vote_count)

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <Card className="border-slate-200 bg-white/95 shadow-lg backdrop-blur">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-gray-900">{electionTitle}</CardTitle>
              <CardDescription className="text-gray-600">{electionDescription}</CardDescription>
            </div>
            <Badge variant="outline" className="border-green-500 text-green-700">
              Results
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span className="font-medium">Total Votes: {totalVotes}</span>
          </div>
        </CardContent>
      </Card>

      {/* Winner Card */}
      {totalVotes > 0 && (
        <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-white shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <CardTitle className="text-gray-900">Winner</CardTitle>
                <CardDescription className="text-gray-600">Congratulations to the elected candidate!</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {winner.image_url ? (
                <img
                  src={winner.image_url || "/placeholder.svg"}
                  alt={winner.name}
                  className="h-20 w-20 rounded-full border-4 border-yellow-400 object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-yellow-400 bg-yellow-100">
                  <span className="text-3xl font-bold text-yellow-600">{winner.name.charAt(0)}</span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">{winner.name}</h3>
                <p className="text-gray-600">{winner.position}</p>
                <div className="mt-2 flex items-center gap-4">
                  <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                    {winner.vote_count} votes
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {totalVotes > 0 ? ((winner.vote_count / totalVotes) * 100).toFixed(1) : "0"}% of total votes
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {totalVotes > 0 && (
        <Card className="border-slate-200 bg-white/95 shadow-lg backdrop-blur">
          <CardHeader>
            <CardTitle className="text-gray-900">Vote Distribution</CardTitle>
            <CardDescription className="text-gray-600">
              Visual breakdown of votes received by each candidate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedCandidates.map((candidate, index) => {
                const percentage = totalVotes > 0 ? (candidate.vote_count / totalVotes) * 100 : 0
                const color = COLORS[index % COLORS.length]

                return (
                  <div key={candidate.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                        <span className="font-medium text-gray-900">{candidate.name}</span>
                      </div>
                      <span className="text-gray-600">
                        {candidate.vote_count} votes ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-8 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Results */}
      <Card className="border-slate-200 bg-white/95 shadow-lg backdrop-blur">
        <CardHeader>
          <CardTitle className="text-gray-900">Detailed Results</CardTitle>
          <CardDescription className="text-gray-600">Complete breakdown of all candidates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedCandidates.map((candidate, index) => {
              const percentage = totalVotes > 0 ? ((candidate.vote_count / totalVotes) * 100).toFixed(1) : "0"
              return (
                <div
                  key={candidate.id}
                  className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
                    {index + 1}
                  </div>
                  {candidate.image_url ? (
                    <img
                      src={candidate.image_url || "/placeholder.svg"}
                      alt={candidate.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-lg font-bold text-blue-600">{candidate.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                    <p className="text-sm text-gray-600">{candidate.position}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{candidate.vote_count}</div>
                    <div className="text-sm text-gray-600">{percentage}%</div>
                  </div>
                  {index === 0 && <Trophy className="h-6 w-6 text-yellow-500" />}
                </div>
              )
            })}
          </div>
          {totalVotes === 0 && (
            <div className="py-8 text-center text-gray-600">
              <p>No votes were cast in this election</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
