Personal Finance Tracker
This is a modern, full-stack personal finance tracker web app built with Next.js, PostgreSQL, and Prisma ORM. It enables users to manage transactions, track budgets, and gain insights into their spending—all with a clean, responsive interface. The backend is powered by a scalable PostgreSQL database, and the app is deployed seamlessly on Vercel for fast, reliable access anywhere.

🚀 Features
Transaction Management:
Add, edit, and delete financial transactions with ease.

Budget Tracking:
Set up budgets for different categories and monitor your progress.

Analytics & Insights:
Visualize your spending patterns and receive actionable insights.

Responsive Design:
Works great on desktop and mobile devices.

Secure & Scalable:
Built with Next.js API routes, Prisma ORM, and PostgreSQL for robust data management.

🛠️ Tech Stack
Frontend: Next.js (React)

Backend: Next.js API Routes

Database: PostgreSQL (managed in production, Dockerized for local development)

ORM: Prisma

Deployment: Vercel

📦 Getting Started
1. Clone the Repository
bash
git clone https://github.com/your-username/finsight.git
cd finsight
2. Set Up the Database
Local Development (Docker)
bash
docker compose up -d
Production
Use a managed PostgreSQL service (e.g., Vercel Postgres, Neon, Supabase, AWS RDS).

Update your .env with the production DATABASE_URL.

3. Configure Environment Variables
Create a .env file based on .env.example:

text
DATABASE_URL=postgresql://user:password@localhost:5432/finsight
4. Install Dependencies
bash
npm install
5. Run Prisma Migrations
bash
npx prisma migrate dev
6. Start the Development Server
bash
npm run dev
7. Build and Deploy
For production, push your repository to GitHub and connect it to Vercel.

Vercel will handle building and deploying your app automatically.

📝 Deployment Notes
Prisma on Vercel:
Ensure your package.json includes:

json
"scripts": {
  "build": "prisma generate && next build",
  "postinstall": "prisma generate"
}
This prevents issues with Prisma Client generation on Vercel’s build cache.

Environment Variables:
Set the DATABASE_URL in your Vercel dashboard under Project Settings → Environment Variables.

📊 Screenshots
<img width="321" alt="Screenshot 2025-06-10 at 9 56 12 PM" src="https://github.com/user-attachments/assets/2432792f-3876-4509-9d7b-7b124246a89c" />


🤝 Contributing
Contributions are welcome! Please open issues or submit pull requests for new features, bug fixes, or improvements.

📄 License
This project is licensed under the MIT License.

🙏 Acknowledgments
Next.js

Prisma

PostgreSQL

Vercel

Inspired by open-source finance apps and best-practice README templates from the GitHub community.

Feel free to customize this README for your project’s specific features and branding!

Related
How should I structure a clear and professional README for my finance tracker app?
What key features and setup instructions should I include in my README
How can I highlight the unique aspects of my finance tracker project effectively
Which sections are essential to help users understand and use my app easily
How do I reflect on what I learned while building the finance tracker in the README

