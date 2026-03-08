"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { StudentHeader } from "@/components/student-header"
import { StudentDashboard } from "@/components/student-dashboard"

export default function StudentPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [elections, setElections] = useState<any[]>([])
  const [votedElectionIds, setVotedElectionIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const loadProfile = async (userId: string) => {
    const supabase = createClient()
    const { data: profileData } = await supabase.from("profiles").select("*").eq("id", userId).single()
    setProfile(profileData || null)
  }

  useEffect(() => {
    const supabase = createClient()

    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/")
        return
      }

      setUser(user)

      await loadProfile(user.id)

      // Load elections
      const { data: electionsData } = await supabase
        .from("elections")
        .select("*")
        .order("start_date", { ascending: false })
      setElections(electionsData || [])

      // Load votes
      const { data: votesData } = await supabase.from("votes").select("election_id").eq("voter_id", user.id)
      setVotedElectionIds(votesData?.map((v) => v.election_id) || [])

      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleProfileUpdate = () => {
    if (user) {
      loadProfile(user.id)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-xl text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/dashboard-bg.jpg)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-slate-800/10 to-blue-900/20" />
      </div>
      <div className="relative z-10">
        <StudentHeader
          userEmail={user?.email}
          userName={profile?.full_name}
          userAvatar={profile?.avatar_url}
          profile={profile}
          onProfileUpdate={handleProfileUpdate}
        />
        <StudentDashboard elections={elections} votedElectionIds={votedElectionIds} />
      </div>
    </div>
  )
}
