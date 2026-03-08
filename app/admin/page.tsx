"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminHeader } from "@/components/admin-header"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [elections, setElections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

      // Load profile and check admin role
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setProfile(profileData)

      if (profileData?.role !== "admin") {
        router.push("/student")
        return
      }

      // Load elections
      const { data: electionsData } = await supabase
        .from("elections")
        .select("*")
        .order("created_at", { ascending: false })
      setElections(electionsData || [])

      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/dashboard-bg.jpg)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-slate-800/15 to-blue-900/20 backdrop-blur-[2px]" />
      </div>
      <div className="relative z-10">
        <AdminHeader
          userEmail={user?.email}
          userName={profile?.full_name}
          avatarUrl={profile?.avatar_url}
          profile={profile}
        />
        <AdminDashboard elections={elections} profile={profile} />
      </div>
    </div>
  )
}
