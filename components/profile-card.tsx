"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ProfileEditModal } from "@/components/profile-edit-modal"
import { Mail, Phone, GraduationCap, Calendar, Hash, Briefcase, Edit } from "lucide-react"

interface Profile {
  id: string
  email: string
  full_name: string | null
  student_id: string | null
  role: string
  avatar_url: string | null
  faculty: string | null
  mobile_number: string | null
  current_year: string | null
  reg_no: string | null
  position: string | null
  contact_number: string | null
}

interface ProfileCardProps {
  profile: Profile
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const isStudent = profile.role === "student"

  return (
    <>
      <Card className="overflow-hidden border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-2xl font-bold">
                  {profile.full_name?.charAt(0)?.toUpperCase() || profile.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{profile.full_name || "No Name"}</h2>
                <Badge variant={isStudent ? "default" : "secondary"} className="mt-1">
                  {isStudent ? "Student" : "Admin"}
                </Badge>
              </div>
            </div>
            <Button onClick={() => setEditModalOpen(true)} size="sm" variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="truncate font-medium">{profile.email}</p>
              </div>
            </div>

            {isStudent ? (
              <>
                {profile.reg_no && (
                  <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Hash className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Registration No</p>
                      <p className="font-medium">{profile.reg_no}</p>
                    </div>
                  </div>
                )}

                {profile.faculty && (
                  <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Faculty</p>
                      <p className="font-medium">{profile.faculty}</p>
                    </div>
                  </div>
                )}

                {profile.current_year && (
                  <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Current Year</p>
                      <p className="font-medium">{profile.current_year}</p>
                    </div>
                  </div>
                )}

                {profile.mobile_number && (
                  <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Mobile Number</p>
                      <p className="font-medium">{profile.mobile_number}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {profile.position && (
                  <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Position</p>
                      <p className="font-medium">{profile.position}</p>
                    </div>
                  </div>
                )}

                {profile.contact_number && (
                  <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Contact Number</p>
                      <p className="font-medium">{profile.contact_number}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <ProfileEditModal open={editModalOpen} onOpenChange={setEditModalOpen} profile={profile} />
    </>
  )
}
