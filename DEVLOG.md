## Day 1 — 2026-05-07

**Hours worked:** 3

**What I did:**
- Read the complete Credex Round 1 assignment requirements carefully
- Planned the product direction and decided to build BURNRATE AI as a SaaS-style AI spend optimization platform
- Installed Cursor IDE, Node.js, Git, and configured the local development environment
- Created a public GitHub repository for the project
- Initialized the project using Next.js App Router with TypeScript and Tailwind CSS
- Connected the local repository to GitHub and pushed the initial project setup
- Deployed the initial version of the application to Vercel
- Installed and configured shadcn/ui for reusable component architecture
- Planned the scalable folder structure for app routes, components, pricing data, business logic, and TypeScript types

**What I learned:**
- Learned how modern Next.js App Router projects are structured
- Understood the GitHub + Vercel deployment workflow
- Learned how production SaaS projects organize scalable frontend architecture
- Improved understanding of how Cursor can accelerate frontend development workflows

**Blockers / what I'm stuck on:**
- Still exploring the best structure for deterministic audit recommendation logic
- Need to improve confidence using Cursor efficiently for large feature generation

**Plan for tomorrow:**
- Build the premium SaaS landing page
- Create the multi-step audit form flow
- Create the pricing data structure and audit engine skeleton


## Day 2 — 2026-05-08

**Hours worked:** 4

**What I did:**
- Built the core BURNRATE AI frontend architecture using Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui
- Created a premium SaaS landing page with responsive design and strong product branding
- Implemented the multi-step audit flow for collecting AI tool usage and spending information
- Added reusable UI components and organized the project into scalable folders
- Built structured pricing datasets for multiple AI tools and plans
- Implemented the deterministic audit engine structure and recommendation logic
- Added savings calculations for monthly and yearly optimization opportunities
- Connected the audit form flow to dynamic results pages
- Added localStorage persistence for audit form state and generated results
- Improved the results dashboard UI with premium SaaS styling and recommendation sections
- Debugged and fixed hydration mismatch issues caused by client-side rendering differences in Next.js

**What I learned:**
- Learned how hydration mismatches happen in Next.js applications using SSR and client-side state
- Improved understanding of deterministic business logic architecture
- Learned how SaaS products structure pricing systems, recommendation engines, and results dashboards
- Improved understanding of reusable component architecture and state persistence

**Blockers / what I'm stuck on:**
- Need to improve CTA functionality and polish some user interactions
- Need to add all required documentation files for final submission
- Need to further refine recommendation realism and UI polish

**Plan for tomorrow:**
- Add all required repository documentation files
- Improve CTA interactions and overall UX polish
- Refine audit recommendation realism further
- Prepare the project for final deployment and review

 ## Day 3 — 2026-05-09

**Hours worked:** 4–5

**What I did:**
- Integrated Supabase backend into the BURNRATE AI project for persistent data storage
- Created and configured `audits` and `leads` tables in Supabase
- Set up Row Level Security (RLS) policies to allow secure insert operations from frontend
- Connected Next.js API routes (`/api/audits` and `/api/leads`) with Supabase client
- Implemented lead capture system for collecting user details (email, company name, role, source)
- Debugged multiple backend integration issues including:
  - Supabase schema mismatch between frontend code and database tables
  - RLS policy blocking insert operations
  - Schema cache errors (table/column not found issues)
- Fixed runtime errors related to incorrect numeric type handling (bigint conversion issues)
- Integrated CTA flows:
  - “Notify me about future optimizations” lead submission
  - “Talk to Credex” modal submission flow
  - “Request walkthrough” email CTA handling
- Verified end-to-end flow: frontend → API routes → Supabase database
- Stabilized audit result page with backend persistence working

**What I learned:**
- Understood how Supabase Row Level Security directly affects frontend data writes
- Learned how schema mismatches break full-stack SaaS flows even when UI works
- Gained experience debugging end-to-end issues across frontend, API routes, and database
- Learned why schema cache issues appear in Supabase and how they affect table visibility
- Understood limitations of mailto-based CTAs in real production apps

**Blockers / what I'm stuck on:**
- Supabase schema alignment issues caused repeated table/column errors
- RLS policies initially blocked database inserts
- Schema cache inconsistencies caused confusion during debugging
- Mailto CTA behavior depends on system email configuration

**Plan for tomorrow:**
- Clean up Supabase schema structure and align with codebase
- Improve API error handling and debugging logs
- Replace or enhance mailto CTA with proper backend tracking (optional)
- Improve UI/UX polish for audit results interactions
- Add loading and error states for all API flows
- Prepare project for production deployment readiness
