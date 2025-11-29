# GreenGenesis - Environmental Awareness Platform

## Overview
GreenGenesis is a student-led environmental awareness platform focused on Azerbaijan. The application educates users about environmental facts, provides an impact calculator, offers a rewards program for purchasing trees/plants, and facilitates donations for environmental projects.

## Tech Stack
- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI, Wouter (routing)
- **Backend**: Express.js, TypeScript
- **Storage**: In-memory storage with Object Storage integration for file uploads
- **State Management**: TanStack Query (React Query)

## Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # Shadcn UI components
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── ObjectUploader.tsx
│   │   ├── pages/          # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Awareness.tsx
│   │   │   ├── GreenRewards.tsx
│   │   │   ├── SupportUs.tsx
│   │   │   └── AboutUs.tsx
│   │   ├── lib/            # Utilities and data
│   │   │   ├── data.ts     # Static data (facts, team members)
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   ├── App.tsx         # Main app with routing
│   │   └── index.css       # Global styles with CSS variables
│   └── index.html
├── server/                 # Backend Express application
│   ├── routes.ts           # API routes
│   ├── storage.ts          # In-memory data storage
│   ├── objectStorage.ts    # Object storage service
│   ├── objectAcl.ts        # Access control for objects
│   └── index.ts            # Server entry point
└── shared/
    └── schema.ts           # Shared TypeScript types and Zod schemas
```

## Features

### 1. Home Page
- Hero section with call-to-action buttons
- Statistics display (trees planted, members, funds raised)
- 10 environmental facts about Azerbaijan
- CTA band for tree planting

### 2. Environmental Awareness Page
- Impact calculator (driving distance → CO2 → trees needed)
- Interactive slider for calculations
- Impact comparison cards (car emissions, flights, etc.)
- Benefits of tree planting

### 3. GreenRewards Page
- Receipt upload with image preview
- Form to submit vendor, amount, and date
- User rewards dashboard (points, submissions)
- Partner vendor listings
- Point conversion information

### 4. Support Us Page
- Funding progress bar
- Donation form with preset amounts
- Anonymous donation option
- Recent supporters list
- Fund allocation breakdown

### 5. About Us Page
- Team member profiles with avatars
- Mission statement
- Origin story
- Contact information

## API Endpoints

### Receipts
- `GET /api/receipts` - Get user's receipts
- `POST /api/receipts` - Submit a new receipt
- `PUT /api/receipts/image` - Normalize uploaded image path

### Rewards
- `GET /api/rewards` - Get user's reward points

### Donations
- `GET /api/donations/recent` - Get recent donations
- `POST /api/donations` - Create a donation

### Fund
- `GET /api/fund/stats` - Get fund statistics

### Object Storage
- `POST /api/objects/upload` - Get presigned upload URL
- `GET /objects/:objectPath` - Serve uploaded objects
- `GET /public-objects/:filePath` - Serve public objects

## Design System
- **Primary Color**: Green (HSL 142)
- **Font**: Outfit, Inter
- **Theme**: Light/Dark mode support
- **Border Radius**: 0.375rem (md) to 0.5625rem (lg)

## Development
The application runs on port 5000 with hot-reload enabled in development mode.

## User Preferences
- Visitor ID is stored in cookies for tracking rewards
- Theme preference is stored in localStorage
