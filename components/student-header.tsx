"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProfileEditModal } from "@/components/profile-edit-modal"
import Image from "next/image"

interface StudentHeaderProps {
  userEmail?: string
  userName?: string
  userAvatar?: string | null
  profile: {
    full_name: string
    email: string
    student_id: string
    avatar_url?: string | null
  } | null
  onProfileUpdate: () => void
}

export function StudentHeader({ userEmail, userName, userAvatar, profile, onProfileUpdate }: StudentHeaderProps) {
  const router = useRouter()
  const [profileModalOpen, setProfileModalOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <>
      <header className="border-b border-border/50 bg-white/90 shadow-lg backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Image src="/sltc-logo.jpg" alt="SLTC Logo" width={150} height={50} className="h-12 w-auto" />
            <div className="border-l border-border/50 pl-3">
              <p className="text-sm font-medium text-muted-foreground">Student Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-12 w-12 rounded-full ring-2 ring-primary/10 transition-all hover:ring-primary/30"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={userAvatar || undefined} alt={userName || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-lg font-semibold text-white">
                      {userName?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white shadow-xl">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1.5 py-2">
                    <p className="text-base font-semibold text-foreground">{userName || "Student"}</p>
                    <p className="text-sm text-muted-foreground">{userEmail}</p>
                    {profile?.student_id && <p className="text-xs text-muted-foreground/70">{profile.student_id}</p>}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {profile && (
                  <>
                    <DropdownMenuItem onClick={() => setProfileModalOpen(true)} className="cursor-pointer py-3">
                      <User className="mr-3 h-4 w-4" />
                      <span className="font-medium">Edit Profile</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="icon"
              onClick={handleLogout}
              className="h-10 w-10 border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-all bg-transparent"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {profile && (
        <ProfileEditModal
          open={profileModalOpen}
          onOpenChange={setProfileModalOpen}
          profile={profile}
          onProfileUpdate={onProfileUpdate}
        />
      )}
    </>
  )
}
