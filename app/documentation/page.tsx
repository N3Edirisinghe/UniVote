"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

export default function DocumentationPage() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">SLTC Uni Votes</h1>
            <p className="text-slate-600">Complete Project Documentation</p>
          </div>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <Button onClick={handlePrint} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4" />
              Print to PDF
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8 print:space-y-6">
          {/* Section 1: Overview */}
          <Card className="p-8 print:p-6 print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Project Overview</h2>
            <p className="text-slate-700 mb-4">
              SLTC Uni Votes is a secure, professional voting system designed for Sri Lanka Technological Campus (SLTC).
              It enables students to vote in university elections and allows administrators to manage elections and view
              results.
            </p>
            <div className="grid grid-cols-2 gap-4 print:grid-cols-2">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Target Users:</h3>
                <ul className="text-slate-700 space-y-1 text-sm">
                  <li>• Students (voters)</li>
                  <li>• Administrators (election managers)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Key Features:</h3>
                <ul className="text-slate-700 space-y-1 text-sm">
                  <li>• Secure authentication</li>
                  <li>• Real-time voting</li>
                  <li>• Results display</li>
                  <li>• Profile management</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Section 2: Technology Stack */}
          <Card className="p-8 print:p-6 print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Technology Stack</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Frontend:</h3>
                <ul className="text-slate-700 space-y-1 text-sm">
                  <li>• Next.js 15 - React framework with App Router</li>
                  <li>• React 19 - UI library</li>
                  <li>• TypeScript - Type-safe JavaScript</li>
                  <li>• Tailwind CSS v4 - Utility-first styling</li>
                  <li>• shadcn/ui - Pre-built components</li>
                  <li>• Lucide React - Icon library</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Backend:</h3>
                <ul className="text-slate-700 space-y-1 text-sm">
                  <li>• Supabase - PostgreSQL database</li>
                  <li>• Supabase Auth - Authentication</li>
                  <li>• Supabase Storage - File storage</li>
                  <li>• Server Actions - Secure backend functions</li>
                  <li>• Row Level Security (RLS) - Database security</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Development Tools:</h3>
                <ul className="text-slate-700 space-y-1 text-sm">
                  <li>• ESLint - Code quality</li>
                  <li>• TypeScript - Static type checking</li>
                  <li>• Vercel - Deployment platform</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Section 3: Database Schema */}
          <Card className="p-8 print:p-6 print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Database Schema</h2>

            <div className="space-y-4 text-sm">
              <div className="bg-slate-50 p-4 rounded border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">profiles (Users)</h3>
                <ul className="text-slate-700 space-y-1 font-mono text-xs">
                  <li>• id (UUID) - Primary key</li>
                  <li>• email - User email</li>
                  <li>• full_name - User name</li>
                  <li>• role - student or admin</li>
                  <li>• student_id - Student ID</li>
                  <li>• faculty - Faculty name</li>
                  <li>• mobile_number - Contact number</li>
                  <li>• current_year - Academic year</li>
                  <li>• reg_no - Registration number</li>
                  <li>• position - Admin position</li>
                  <li>• contact_number - Admin contact</li>
                  <li>• avatar_url - Profile photo</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">elections</h3>
                <ul className="text-slate-700 space-y-1 font-mono text-xs">
                  <li>• id (UUID) - Primary key</li>
                  <li>• title - Election name</li>
                  <li>• description - Election details</li>
                  <li>• status - active or ended</li>
                  <li>• start_date - Start time</li>
                  <li>• end_date - End time</li>
                  <li>• created_by - Admin ID</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">candidates</h3>
                <ul className="text-slate-700 space-y-1 font-mono text-xs">
                  <li>• id (UUID) - Primary key</li>
                  <li>• name - Candidate name</li>
                  <li>• position - Position applying for</li>
                  <li>• manifesto - Campaign details</li>
                  <li>• image_url - Candidate photo</li>
                  <li>• vote_count - Total votes</li>
                  <li>• election_id - Foreign key</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">votes</h3>
                <ul className="text-slate-700 space-y-1 font-mono text-xs">
                  <li>• id (UUID) - Primary key</li>
                  <li>• voter_id - Student ID (FK)</li>
                  <li>• candidate_id - Candidate ID (FK)</li>
                  <li>• election_id - Election ID (FK)</li>
                  <li>• voted_at - Timestamp</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Section 4: Key Features */}
          <Card className="p-8 print:p-6 print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Key Features</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Authentication:</h3>
                <ul className="text-slate-700 space-y-1 text-sm">
                  <li>• Email/password registration and login</li>
                  <li>• Supabase Auth with JWT tokens</li>
                  <li>• Role-based access control</li>
                  <li>• Automatic profile creation on signup</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Student Features:</h3>
                <ul className="text-slate-700 space-y-1 text-sm">
                  <li>• View active elections</li>
                  <li>• Vote for candidates (one vote per election)</li>
                  <li>• View real-time results</li>
                  <li>• Edit profile with image upload</li>
                  <li>• View faculty, mobile number, registration number</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Admin Features:</h3>
                <ul className="text-slate-700 space-y-1 text-sm">
                  <li>• Create and manage elections</li>
                  <li>• Add candidates with images</li>
                  <li>• View voting results</li>
                  <li>• Edit profile with position and contact number</li>
                  <li>• Manage election status (active/ended)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Security:</h3>
                <ul className="text-slate-700 space-y-1 text-sm">
                  <li>• Row Level Security (RLS) policies</li>
                  <li>• Duplicate vote prevention</li>
                  <li>• Server-side validation</li>
                  <li>• Encrypted passwords</li>
                  <li>• Secure image storage</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Section 5: Backend Architecture */}
          <Card className="p-8 print:p-6 print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Backend Architecture</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Authentication Flow:</h3>
                <div className="bg-slate-50 p-4 rounded text-sm text-slate-700 font-mono">
                  User Registration → Supabase Auth → Profile Created → JWT Token → Logged In
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Voting Flow:</h3>
                <div className="bg-slate-50 p-4 rounded text-sm text-slate-700 font-mono">
                  View Elections → Select Candidate → Submit Vote → Duplicate Check → Store Vote → Update Count →
                  Results Updated
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Server Actions:</h3>
                <ul className="text-slate-700 space-y-1 text-sm">
                  <li>• signUp() - User registration</li>
                  <li>• signIn() - User login</li>
                  <li>• signOut() - User logout</li>
                  <li>• submitVote() - Vote submission</li>
                  <li>• createElection() - Create election (admin)</li>
                  <li>• addCandidate() - Add candidate (admin)</li>
                  <li>• updateProfile() - Update user profile</li>
                  <li>• uploadImage() - Upload profile/candidate image</li>
                  <li>• endElection() - End election (admin)</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Section 6: Security Policies */}
          <Card className="p-8 print:p-6 print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Security Policies (RLS)</h2>

            <ul className="text-slate-700 space-y-2 text-sm">
              <li>• Users can only view their own profile</li>
              <li>• Users can only vote once per election</li>
              <li>• Admins can only manage their own elections</li>
              <li>• Votes are immutable after submission</li>
              <li>• Profile images are private to user</li>
              <li>• Duplicate votes are prevented at database level</li>
              <li>• All data is encrypted in transit</li>
              <li>• Server-side validation on all operations</li>
            </ul>
          </Card>

          {/* Section 7: Deployment */}
          <Card className="p-8 print:p-6 print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Deployment & Production</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 print:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Deployment Platform:</h3>
                  <p className="text-slate-700 text-sm">Vercel</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Database:</h3>
                  <p className="text-slate-700 text-sm">Supabase PostgreSQL</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Storage:</h3>
                  <p className="text-slate-700 text-sm">Supabase Storage</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Authentication:</h3>
                  <p className="text-slate-700 text-sm">Supabase Auth</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded">
                <p className="text-green-900 font-semibold">Status: Production Ready ✓</p>
                <p className="text-green-800 text-sm mt-1">All features tested and deployed successfully</p>
              </div>
            </div>
          </Card>

          {/* Section 8: Contact Information */}
          <Card className="p-8 print:p-6 print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. SLTC Contact Information</h2>

            <div className="space-y-3 text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-900">Email:</h3>
                <p className="text-sm">info@sltc.ac.lk</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Phone:</h3>
                <p className="text-sm">+94 11 7999 000</p>
                <p className="text-sm">+94 11 2100 500</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Address:</h3>
                <p className="text-sm">SLTC Research University</p>
                <p className="text-sm">Ingiriya Road, Padukka</p>
              </div>
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center text-slate-600 text-sm py-8 print:py-4">
            <p>SLTC Uni Votes - Complete Project Documentation</p>
            <p>Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid;
          }
          .print\\:space-y-6 > * + * {
            margin-top: 1.5rem;
          }
          .print\\:p-6 {
            padding: 1.5rem;
          }
          .print\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .print\\:py-4 {
            padding-top: 1rem;
            padding-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
