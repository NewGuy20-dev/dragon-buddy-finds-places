# Travel Buddy - AI-Powered Location Discovery App

## Overview

This is a modern full-stack web application that helps users discover places like hotels, restaurants, and landmarks using Gemini AI-powered recommendations. The app features a React frontend with a Node.js/Express backend, using PostgreSQL for data storage and Drizzle ORM for database operations. Place cards are clickable and open directly in Google Maps for navigation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom Dragon Buddy theme
- **State Management**: TanStack Query for server state management
- **Routing**: React Router for client-side navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: In-memory storage (development) with PostgreSQL session store setup
- **API**: RESTful endpoints with `/api` prefix

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility functions
├── server/           # Express backend
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database abstraction layer
│   └── vite.ts       # Development server setup
├── shared/           # Shared types and schemas
│   └── schema.ts     # Database schema definitions
└── migrations/       # Database migration files
```

## Key Components

### AI Integration
- **Gemini AI**: Google's Gemini 2.5 Flash model for intelligent place search
- **Real-time Chat**: Travel Buddy powered by Gemini AI for travel assistance
- **Smart Recommendations**: AI-filtered hotels, restaurants, and landmarks
- **Web Search**: Gemini uses web search capabilities to find current, accurate place data with verified authenticity
- **Data Integrity**: All place recommendations are verified through web search to ensure they exist and are currently operating

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Connection**: Supabase PostgreSQL database with automatic fallback to in-memory storage
- **Schema**: Centralized in `shared/schema.ts` with Zod validation
- **Migrations**: Automated schema changes in `migrations/` directory
- **Storage**: Dual implementation (SupabaseStorage for production, MemStorage for development)

### Frontend Components
- **Location Detection**: Browser geolocation API integration
- **Place Categories**: Hotel, restaurant, and landmark browsing
- **AI Chat Interface**: Interactive travel assistant (Travel Buddy)
- **Google Maps Integration**: Click-to-open place cards in Google Maps
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Storage Interface
- **Abstract Storage**: `IStorage` interface in `server/storage.ts`
- **Development**: In-memory storage implementation
- **Production**: PostgreSQL-backed storage (to be implemented)
- **User Management**: Basic user CRUD operations

## Data Flow

1. **User Location**: Browser geolocation → LocationDetector component
2. **Category Selection**: User selects place type → PlaceCategories component
3. **Place Discovery**: Category + location → PlacesList component (mock data)
4. **AI Interaction**: User queries → TravelBuddy chat interface
5. **Data Storage**: User data → Storage abstraction → Database

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessibility
- **Animations**: Embla Carousel for image carousels
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React icon library

### Backend Dependencies
- **Database**: Supabase with postgres client for PostgreSQL
- **ORM**: drizzle-orm with drizzle-kit for migrations
- **Session Store**: connect-pg-simple for PostgreSQL sessions
- **Validation**: Zod for runtime type checking
- **AI Integration**: @google/genai for Gemini AI with web search capabilities

### Development Tools
- **Build**: esbuild for production builds
- **Dev Server**: Vite with HMR and React Fast Refresh
- **Type Checking**: TypeScript with strict mode
- **CSS**: PostCSS with Tailwind CSS processing

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution
- **Database**: Neon Database serverless (development instance)
- **Environment**: NODE_ENV=development

### Production
- **Frontend**: Static build in `dist/public/`
- **Backend**: Compiled JavaScript in `dist/`
- **Database**: PostgreSQL with connection pooling
- **Environment**: NODE_ENV=production
- **Build Process**: 
  1. `vite build` for frontend
  2. `esbuild` for backend bundling
  3. `node dist/index.js` for server start

### Configuration
- **Database**: Environment variable `DATABASE_URL` required
- **Build Output**: Frontend static files served by Express
- **API Routes**: All backend routes prefixed with `/api`
- **Session Management**: PostgreSQL session store in production

The application follows a modern full-stack architecture with clear separation of concerns, type safety throughout, and a scalable foundation for adding more features like real location APIs, user authentication, and advanced AI recommendations.