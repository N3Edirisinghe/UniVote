"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

interface StorageFile {
  name: string
  id: string
  created_at: string
  metadata: {
    size: number
  }
}

interface ProfileImage {
  id: string
  email: string
  full_name: string
  avatar_url: string
}

interface CandidateImage {
  id: string
  name: string
  position: string
  image_url: string
}

export default function GalleryPage() {
  const [profileImages, setProfileImages] = useState<ProfileImage[]>([])
  const [candidateImages, setCandidateImages] = useState<CandidateImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = supabaseUrl && supabaseKey
    ? createBrowserClient(supabaseUrl, supabaseKey)
    : null

  useEffect(() => {
    if (!supabase) {
      setError("Supabase client not initialized. Please check environment variables.")
      setLoading(false)
      return
    }

    const fetchImages = async () => {
      try {
        setLoading(true)

        // Fetch profile images
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("id, email, full_name, avatar_url")
          .not("avatar_url", "is", null)

        if (profileError) throw profileError
        setProfileImages(profiles || [])

        // Fetch candidate images
        const { data: candidates, error: candidateError } = await supabase
          .from("candidates")
          .select("id, name, position, image_url")
          .not("image_url", "is", null)

        if (candidateError) throw candidateError
        setCandidateImages(candidates || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch images")
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-slate-600">Loading images...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Image Gallery</h1>
        <p className="text-slate-600 mb-8">View all stored profile and candidate images</p>

        <Tabs defaultValue="profiles" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profiles">Profile Images ({profileImages.length})</TabsTrigger>
            <TabsTrigger value="candidates">Candidate Images ({candidateImages.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="mt-8">
            {profileImages.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-slate-600">No profile images uploaded yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileImages.map((profile) => (
                  <Card key={profile.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{profile.full_name}</CardTitle>
                      <p className="text-sm text-slate-600">{profile.email}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="relative w-full h-48 bg-slate-200 rounded-lg overflow-hidden">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${profile.avatar_url}`}
                          alt={profile.full_name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/abstract-profile.png"
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-3 break-all">{profile.avatar_url}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="candidates" className="mt-8">
            {candidateImages.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-slate-600">No candidate images uploaded yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidateImages.map((candidate) => (
                  <Card key={candidate.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{candidate.name}</CardTitle>
                      <p className="text-sm text-slate-600">{candidate.position}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="relative w-full h-48 bg-slate-200 rounded-lg overflow-hidden">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${candidate.image_url}`}
                          alt={candidate.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/candidate.png"
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-3 break-all">{candidate.image_url}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
