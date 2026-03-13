# StratoView

Real-time global aircraft tracking and visualization platform built with Next.js, TypeScript, and Leaflet.

![StratoView](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- **Real-Time Aircraft Tracking**: Visualize thousands of aircraft worldwide in real-time
- **Interactive Map**: Powered by Leaflet.js with OpenStreetMap tiles
- **Advanced Filtering**: Filter aircraft by altitude, speed, country, callsign, and ICAO24
- **Planes Above Me**: Find aircraft near your location with configurable radius
- **Aircraft Clustering**: Performance-optimized marker clustering for thousands of aircraft
- **User Accounts**: Save favorite aircraft and preferences with Google OAuth
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Production Ready**: Includes comprehensive testing, error handling, and logging

## Tech Stack

### Frontend

- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Leaflet.js** for interactive maps
- **OpenStreetMap** tiles

### Backend

- **Next.js API Routes**
- **Node.js**
- **Server-side caching** (in-memory)

### Database

- **CockroachDB** (PostgreSQL compatible)
- **Prisma ORM**

# StratoView

StratoView is a real-time global aircraft tracking and visualization platform built with Next.js, TypeScript, and Leaflet.

## Quick Start

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

- `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

3. **Push database schema:**

```bash
npm run prisma:generate
npm run prisma:push
```

4. **Run the app:**

```bash
npm run dev
```

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run test` — Run unit tests
- `npm run test:e2e` — Run end-to-end tests
- `npm run lint` — Lint code
- `npm run format` — Format code

## License

MIT License 3. **Environment variables are already configured** in `.env`:
