---
description: Repository Information Overview
alwaysApply: true
---

# Getkkul Partners Information

## Summary
Getkkul Partners is a Next.js App Router partner platform for Getkkul Shopping.
The current codebase includes Auth.js/NextAuth v5 based social login, Drizzle + Neon
database access, business-registration flows, Toss seller integration, and dashboard/admin pages.

## Structure
- **app/**: Next.js App Router pages, layouts, and route handlers
- **src/auth.ts**: Auth.js configuration entry point
- **src/db/**: Drizzle schema and runtime DB initialization
- **src/lib/auth/**: edge-auth, OAuth provider helpers, user sync helpers
- **src/lib/business-registration/**: store, duplicate-check, formatting helpers
- **src/lib/toss/**: Toss seller helper utilities
- **docs/**: Toss integration notes
- **public/**: static assets and company introduction images

## Language & Runtime
**Language**: TypeScript/JavaScript  
**Runtime**: Node.js / Next.js / Cloudflare Pages  
**Build System**: Next.js 16 + `@cloudflare/next-on-pages`  
**Package Manager**: npm  

## Dependencies
**Main Dependencies**:  
- next: 16.0.1  
- react: 19.2.0  
- react-dom: 19.2.0  
- next-auth: ^5.0.0-beta.30  
- @auth/drizzle-adapter: ^1.11.1  
- drizzle-orm: ^0.45.1  
- @neondatabase/serverless: ^1.0.2  
- jose: ^6.1.3  
- react-hot-toast: ^2.6.0  
- react-icons: ^5.5.0  
- zustand: ^5.0.8  

**Development Dependencies**:  
- drizzle-kit: ^0.31.8  
- eslint: ^9  
- eslint-config-next: 16.0.1  
- tailwindcss: ^4  
- @tailwindcss/postcss: ^4  
- typescript: ^5  

## Build & Installation
```bash
npm install
npm run dev
npm run build
npm run build:pages
```

## Main Files & Resources
**App Entry**: `app/page.tsx`  
**Auth Config**: `src/auth.ts`  
**API Routes**: `app/api/`  
**Database Schema**: `src/db/schema.ts`  
**Configuration**: `next.config.mjs`, `wrangler.toml`, `tsconfig.json`  
**Styling**: `app/globals.css`, Tailwind CSS  

## Repository Notes
- `README.md`, `package.json`, `wrangler.toml`, and actual code are the primary source of truth.
- Several root-level `*_PROPOSAL.md`, `*_SUMMARY.md`, and `*_FINAL.md` files are historical notes and may not reflect the latest structure.
- There is currently no dedicated automated test script in `package.json`.