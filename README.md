# SLTC Voting System

Welcome to the SLTC Voting System! This is a modern, secure, and user-friendly web application built to facilitate seamless voting processes. 

🌐 **Live Demo:** [https://sltc-voting.vercel.app/](https://sltc-voting.vercel.app/)

## 🚀 Technologies Used
This project is built using a cutting-edge modern tech stack:
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI Library:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [Radix UI](https://www.radix-ui.com/) (Accessible headless components) & [Lucide React](https://lucide.dev/) (Icons)
- **Database / Backend:** [Supabase](https://supabase.com/)
- **Deployment:** Vercel (Configured with `vercel.json` for easy deployment)

## ✨ Features
- **Secure Voting Process:** Ensures integrity through Supabase authentication and backend rules.
- **Responsive Design:** Fully responsive interface that works flawlessly on desktop and mobile devices.
- **Modern UI/UX:** Clean, intuitive, and accessible interface built with Tailwind CSS and Radix UI components.
- **Analytics Dashboard:** Visual representation of voting statistics using Recharts.
- **Fast Performance:** Optimized rendering and fast load times with Next.js App Router capabilities.

## 🛠️ Getting Started

First, make sure you have installed the required node modules:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Next, configure your environment variables by checking the `.env.local` or `.env.example` file (you will need Supabase URLs and Keys).

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

## 📁 Project Structure

- `/app`: Contains all Next.js App Router pages, layouts, and API routes.
- `/components`: Includes reusable UI components built on top of Radix UI.
- `/lib`: Helper functions, utilities, and Supabase client configuration.
- `/public`: Static assets like images (e.g., SLTC logos, backgrounds).
- `/scripts`: Custom scripts for project maintenance or setup.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📜 License
This project is open-source and available under the MIT License.
