# {{PROJECT_NAME}}

A fullstack app generated with
[`create-softeneers-app`](https://www.npmjs.com/package/create-softeneers-app):
**Next.js** web client + **Express / Sequelize / MySQL** JSON API, in a
Turborepo monorepo that works with **npm** or **pnpm**.

> `{{PROJECT_NAME}}` is replaced with your project name at generation time.

## Layout

```
apps/
  web/      Next.js 16 + React 19 + Tailwind v4   → http://localhost:3000
  server/   Express 5 + Sequelize 6 + mysql2      → http://localhost:4000
docker-compose.yml   MySQL 8 for local development
```

## Getting started

```bash
# 1. Install dependencies (npm shown; pnpm works too)
npm install

# 2. Configure environment
cp .env.example .env
cp apps/server/.env.example apps/server/.env

# 3. Start the database
docker compose up -d

# 4. Run migrations + seed
npm run db:migrate
npm run db:seed

# 5. Start web + server together
npm run dev
```

- Web app: <http://localhost:3000>
- API health check: <http://localhost:4000/health>
- Cars API: <http://localhost:4000/api/cars>

## Scripts

All scripts run through Turborepo, so they behave identically under npm or pnpm.

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Run web + server                   |
| `npm run build`      | Build all apps                     |
| `npm run db:migrate` | Run Sequelize migrations (server)  |
| `npm run db:seed`    | Seed the database (server)         |
| `npm run db:reset`   | Undo, re-migrate and re-seed       |
