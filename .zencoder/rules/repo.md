---
description: Repository Information Overview
alwaysApply: true
---

# Getkkul Partners Information

## Summary
Getkkul Partners is a partner sales platform for Getkkul Shopping, allowing users to sell top 1000 products and earn commissions, similar to Coupang Partners. It includes features for partner dashboard, product management, order management, and settlement management.

## Structure
- **app/**: Next.js App Router directory containing pages, API routes, and layout files
- **src/**: Source code with components, hooks, contexts, types, and utilities
- **prisma/**: Database schema and Prisma configuration for PostgreSQL
- **public/**: Static assets including images and company introduction documents

## Language & Runtime
**Language**: TypeScript/JavaScript  
**Version**: Node.js (required for Next.js), TypeScript 5.x  
**Build System**: Next.js  
**Package Manager**: npm  

## Dependencies
**Main Dependencies**:  
- next: 16.0.1  
- react: 19.2.0  
- react-dom: 19.2.0  
- @prisma/client: ^6.19.0  
- prisma: ^6.19.0  
- next-auth: ^4.24.13  
- axios: ^1.13.2  
- framer-motion: ^12.23.24  
- react-hot-toast: ^2.6.0  
- react-icons: ^5.5.0  
- zustand: ^5.0.8  

**Development Dependencies**:  
- @types/node: ^20  
- @types/react: ^19  
- @types/react-dom: ^19  
- eslint: ^9  
- eslint-config-next: 16.0.1  
- tailwindcss: ^4  
- @tailwindcss/postcss: ^4  
- typescript: ^5  

## Build & Installation
```bash
npm install
npm run build
npm run start
```

Development server:  
```bash
npm run dev
```

## Main Files & Resources
**Entry Point**: app/page.tsx  
**API Routes**: app/api/  
**Database Schema**: prisma/schema.prisma  
**Configuration**: next.config.ts, tsconfig.json  
**Styling**: app/globals.css, Tailwind CSS  

## Testing
No testing framework or test files found in the repository.