"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"
import {
  Shield,
  Smartphone,
  TrendingUp,
  UserCheck,
  Settings,
  Database,
  Lightbulb,
  Users,
  Scale,
  Sprout,
  Mail,
  Phone,
  MapPin,
  Zap,
  Code,
  Cloud,
  Lock,
} from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Image src="/sltc-logo.jpg" alt="SLTC Logo" width={180} height={60} className="h-14 w-auto" priority />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-blue-600">Uni Votes</span>
            </div>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#home" className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">
              Home
            </a>
            <a href="#leadership" className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">
              Leadership
            </a>
            <a href="#manifesto" className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">
              Manifesto
            </a>
            <a href="#features" className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">
              Features
            </a>
            <a href="#about" className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">
              About
            </a>
            <a href="#contact" className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">
              Contact
            </a>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
              onClick={() => setLoginModalOpen(true)}
            >
              Login
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setRegisterModalOpen(true)}>
              Register
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/campus-bg.jpg" alt="SLTC Campus" fill className="object-cover" priority quality={90} />
        </div>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/70" />

        <div className="container relative mx-auto px-4 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            {/* Hero Content */}
            <div className="flex flex-col justify-center space-y-6 text-white">
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Professional Student Leadership Voting for <span className="text-blue-400">SLTC Council</span>
              </h1>
              <p className="text-lg leading-relaxed text-gray-200 sm:text-xl">
                Choose your <strong>Student Leadership Training Council</strong> representatives through our secure
                online voting platform. Shape the future of student leadership with transparent, democratic Uni Votes.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setRegisterModalOpen(true)}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
                <Button
                  size="lg"
                  className="bg-yellow-500 text-slate-900 hover:bg-yellow-400"
                  onClick={() => setLoginModalOpen(true)}
                >
                  <span className="mr-2">→</span>
                  Login Now
                </Button>
              </div>
            </div>

            {/* Vote Box Card */}
            <div className="flex items-center justify-center">
              <Card className="w-full max-w-md border-blue-500/20 bg-slate-800/50 p-8 backdrop-blur-sm">
                <div className="space-y-6 text-center text-white">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-blue-600">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold">Cast Your Vote</h3>
                  <p className="text-gray-300">Secure • Transparent • Democratic</p>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="space-y-1">
                      <div className="text-4xl font-bold text-blue-400">99.9%</div>
                      <div className="text-sm text-gray-400">SECURE</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-4xl font-bold text-blue-400">24/7</div>
                      <div className="text-sm text-gray-400">AVAILABLE</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 sm:text-4xl">Why Choose SLTC Uni Votes?</h2>
          <p className="mb-12 text-center text-gray-600">Secure, transparent, and accessible voting for all students</p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Leadership-Focused Security</h3>
              <p className="text-gray-600">
                Advanced encryption and secure voting protocols ensure your leadership choice is completely protected
                and confidential.
              </p>
            </Card>

            <Card className="p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Smartphone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Mobile-First Design</h3>
              <p className="text-gray-600">
                Responsive design that works perfectly on all devices - desktop, tablet, and mobile.
              </p>
            </Card>

            <Card className="p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Real-Time Results</h3>
              <p className="text-gray-600">
                Live Uni Votes results with aggregate counts displayed in real-time during active voting.
              </p>
            </Card>

            <Card className="p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">One Vote Per Leader</h3>
              <p className="text-gray-600">
                Advanced verification system ensures each student can only vote once per leadership position.
              </p>
            </Card>

            <Card className="p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Leadership Dashboard</h3>
              <p className="text-gray-600">
                Comprehensive admin panel for managing SLTC Uni Votes, leadership candidates, and student voter lists.
              </p>
            </Card>

            <Card className="p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Secure Database</h3>
              <p className="text-gray-600">
                Supabase database with proper relationships and data integrity constraints.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Positions Section */}
      <section id="leadership" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 sm:text-4xl">SLTC Leadership Positions</h2>
          <p className="mb-12 text-center text-gray-600">Choose your representatives for these key leadership roles</p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              "President",
              "Vice President",
              "Secretary",
              "Treasurer",
              "Sports Captain",
              "Cultural Secretary",
              "Academic Representative",
              "Welfare Officer",
            ].map((position) => (
              <Card key={position} className="p-6 text-center transition-shadow hover:shadow-lg">
                <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-blue-100">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{position}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section id="manifesto" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 sm:text-4xl">SLTC Leadership Manifesto</h2>
          <p className="mb-12 text-center text-gray-600">Our commitment to student leadership and development</p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 text-center transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-lg bg-yellow-100">
                <Lightbulb className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Innovation</h3>
              <p className="text-gray-600">
                Fostering creative solutions and innovative approaches to student challenges
              </p>
            </Card>

            <Card className="p-6 text-center transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-lg bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Collaboration</h3>
              <p className="text-gray-600">
                Building strong partnerships between students, faculty, and administration
              </p>
            </Card>

            <Card className="p-6 text-center transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-lg bg-blue-100">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Transparency</h3>
              <p className="text-gray-600">Ensuring open communication and accountability in all council decisions</p>
            </Card>

            <Card className="p-6 text-center transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-lg bg-emerald-100">
                <Sprout className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Growth</h3>
              <p className="text-gray-600">Supporting personal and professional development of all students</p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">About SLTC Uni Votes</h2>
              <p className="text-gray-600 leading-relaxed">
                The Student Leadership Training Council (SLTC) election system empowers students to choose their
                representatives through a secure, transparent, and accessible online platform. Built with modern web
                technologies, this system ensures fair and democratic leadership selection for the student body.
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Technology Stack</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[
                    { name: "Next.js", icon: Zap, gradient: "from-black to-gray-800" },
                    { name: "React", icon: Code, gradient: "from-blue-500 to-cyan-500" },
                    { name: "TypeScript", icon: Settings, gradient: "from-blue-600 to-indigo-600" },
                    { name: "Supabase", icon: Database, gradient: "from-green-500 to-emerald-500" },
                    { name: "Tailwind CSS", icon: Cloud, gradient: "from-cyan-500 to-blue-500" },
                    { name: "Real-time", icon: Zap, gradient: "from-purple-500 to-pink-500" },
                  ].map((tech) => {
                    const IconComponent = tech.icon
                    return (
                      <div
                        key={tech.name}
                        className={`group relative overflow-hidden rounded-lg bg-gradient-to-br ${tech.gradient} p-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <IconComponent className="h-6 w-6 text-white transition-transform group-hover:scale-110 group-hover:rotate-12" />
                          <span className="text-xs font-semibold text-white text-center">{tech.name}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Card className="p-6 text-center transition-all hover:scale-105 hover:shadow-lg bg-gradient-to-br from-blue-50 to-white border-blue-200">
                <div className="text-3xl font-bold text-blue-600">99.9%</div>
                <div className="mt-2 text-sm text-gray-600">Uptime</div>
              </Card>
              <Card className="p-6 text-center transition-all hover:scale-105 hover:shadow-lg bg-gradient-to-br from-green-50 to-white border-green-200">
                <div className="text-3xl font-bold text-green-600">256-bit</div>
                <div className="mt-2 text-sm text-gray-600">Encryption</div>
              </Card>
              <Card className="p-6 text-center transition-all hover:scale-105 hover:shadow-lg bg-gradient-to-br from-purple-50 to-white border-purple-200">
                <div className="text-3xl font-bold text-purple-600">24/7</div>
                <div className="mt-2 text-sm text-gray-600">Monitoring</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 sm:text-4xl">Get In Touch</h2>
          <p className="mb-12 text-center text-gray-600">Have questions? We're here to help</p>

          <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-3">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-lg bg-blue-100">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="mb-2 font-semibold">Email</h4>
              <p className="text-sm text-gray-600 font-medium">info@sltc.ac.lk</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-lg bg-blue-100">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="mb-2 font-semibold">Phone</h4>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 font-medium">+94 11 7999 000</p>
                <p className="text-sm text-gray-600 font-medium">+94 11 2100 500</p>
              </div>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-lg bg-blue-100">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="mb-2 font-semibold">Address</h4>
              <p className="text-sm text-gray-600 font-medium">
                SLTC Research University
                <br />
                Ingiriya Road, Padukka
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-semibold">SLTC Uni Votes</h3>
              <p className="text-gray-400">Empowering student leadership through secure online voting</p>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#home" className="hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Help
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 SLTC Uni Votes. All rights reserved. | Student Leadership Training Council
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <span className="rounded-full bg-blue-900 px-4 py-1 text-sm">Empowering Student Leaders</span>
              <span className="rounded-full bg-blue-900 px-4 py-1 text-sm">Transparent Democracy</span>
              <span className="rounded-full bg-blue-900 px-4 py-1 text-sm">Secure Voting</span>
            </div>
          </div>
        </div>
      </footer>

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      <RegisterModal open={registerModalOpen} onOpenChange={setRegisterModalOpen} />
    </div>
  )
}
