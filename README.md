# Mythia & Co — Website

Full-stack Next.js website for Mythia & Co: public pages (Home, About, Services, Projects, Contact) plus a password-protected team dashboard for managing projects.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- Auth via signed HTTP-only cookie (credentials in `.env.local`)
- Data stored in JSON files under `data/` (swap for a database later if needed)

## Setup

1. Install Node.js LTS: https://nodejs.org (or `winget install OpenJS.NodeJS.LTS`)
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your env file:

   ```bash
   copy .env.local.example .env.local
   ```

   Then edit `.env.local` and set `TEAM_USERNAME`, `TEAM_PASSWORD`, and a random `SESSION_SECRET`.

4. Run the dev server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

## Pages

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Landing page |
| `/about` | Public | About the team |
| `/services` | Public | Services offered |
| `/projects` | Public | Project portfolio (reads `data/projects.json`) |
| `/contact` | Public | Contact form (saves to `data/messages.json`) |
| `/login` | Public | Team login |
| `/dashboard` | Team only | Create / edit / delete projects |

## Notes

- Projects and contact messages are stored as JSON files in `data/`. For production with multiple servers, migrate to a real database (e.g., PostgreSQL via Prisma).
- The public `/projects` page shows all projects. If you want to hide internal projects, add an `isPublic` flag to the `Project` type.
