<div align="center">
  <img src="public/sltc-logo.jpg" alt="SLTC Logo" width="120"/>
  <h1>🎓 SLTC UniVote System</h1>
  <p>A modern, secure, and intuitive electronic voting platform built exclusively for SLTC</p>
  
  <p>
    <a href="https://sltc-voting.vercel.app/"><strong>Explore the Live Demo »</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  </p>
</div>

---

## 📖 Overview

**UniVote** is an advanced electronic voting web application designed to streamline student council elections and other voting processes at SLTC. It ensures transparency, security, and a seamless user experience for both administrators and student voters.

Built with performance in mind using Next.js App Router, the platform provides real-time updates and analytics to make election management efficient and completely digital.

## ✨ Key Features

- **🔐 Secure Authentication:** Seamless and secure student/admin login using Supabase Auth.
- **⚡ Real-time Analytics:** Live voting results and statistics displayed dynamically via Recharts.
- **📱 Responsive Design:** Fully optimized across desktop, tablet, and mobile interfaces.
- **🎨 Premium UI/UX:** Built with Tailwind CSS and Radix UI for highly accessible, stunning visuals.
- **🛡️ Vote Integrity:** Server-side validation to ensure each user can only cast one valid vote per election.
- **🛠️ Admin Dashboard:** Comprehensive control panel for admins to manage candidates, elections, and view deep analytics.

## 🚀 Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS 4
- **UI Components:** Radix UI Primitives, Lucide React (Icons), shadcn/ui
- **Backend & Database:** Supabase (PostgreSQL, Authentication, Realtime features)
- **Deployment:** Vercel

## 📂 Project Structure

```text
📦 UniVote
 ┣ 📂 app               # Next.js 15 App Router pages and API routes
 ┣ 📂 components        # Reusable UI components & layouts
 ┣ 📂 hooks             # Custom React Hooks for logic separation
 ┣ 📂 lib               # Utility functions and Supabase clients
 ┣ 📂 public            # Static assets (images, icons)
 ┣ 📂 scripts           # Database setup and migration scripts
 ┣ 📂 styles            # Global CSS and Tailwind configurations
 ┗ 📜 middleware.ts     # Next.js Edge Middleware for route protection
```

## ⚙️ Local Development Setup

To get a local copy up and running, follow these simple steps:

### 1. Clone the repository
```bash
git clone https://github.com/N3Edirisinghe/UniVote.git
cd UniVote
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

**Nilupul Thisaranga (N3Edirisinghe)**
- GitHub: [@N3Edirisinghe](https://github.com/N3Edirisinghe)

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
  <i>Developed with ❤️ for SLTC</i>
</div>
