# CGSG404 Casino Guide - Agent Instructions

## Build/Lint/Test Commands
- `npm run dev` - Development server (port 3000)
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - ESLint check
- `npm run format` - Format with Prettier
- `npm run type-check` - TypeScript check without build
- `npm run clean` - Clean build artifacts

## Architecture & Structure
- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + custom CSS (src/styles/)
- **Components**: src/components/ (TSX files)
- **API**: app/api/ routes for backend functionality
- **Authentication**: Supabase Auth with custom middleware
- **Key APIs**: Banner management, CRUD operations, maintenance mode

## Code Style & Conventions
- **Imports**: Use `@/src/components/` prefix for components
- **Components**: PascalCase filenames (e.g., SimpleNavbar.tsx)
- **Navigation**: Use `SimpleNavbar` component (not old Navbar)
- **CSS**: Tailwind classes + CSS modules in src/styles/
- **Types**: Define interfaces for component props
- **Error Handling**: Try-catch with fallback UI states
- **Z-Index Layers**: Navbar (50) > Cookie (40) > Content (20) > Scroll (15) > Banner (10)
