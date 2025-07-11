# Vercel Deployment Guide

## Quick Setup

1. **Build the project locally** (optional, for testing):
   ```bash
   npm run build
   # Or use the build script
   ./build-vercel.sh
   ```

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard:
     - `GOOGLE_API_KEY` (your Google Gemini API key)
     - `NODE_ENV=production`
   - In Vercel project settings, set:
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist/public`
     - **Install Command**: `npm install`

3. **Vercel will automatically**:
   - Build the frontend (React/Vite)
   - Deploy the API serverless functions
   - Serve static files from `dist/public`
   - Handle routing

## Critical Fix Applied

🔧 **MIME Type Issue Resolved**: 
- Removed conflicting `/public/index.html` file
- Vercel now serves the correct built files from `/dist/public/`
- Static assets (JS, CSS) are properly served with correct MIME types

## Fixed Issues

✅ **Module Resolution**: Fixed ES module imports with `.js` extensions  
✅ **Serverless Functions**: Proper API routes using `/api/index.ts`  
✅ **Static Files**: Frontend served from `/public/` directory  
✅ **Favicon**: Added proper favicon.svg  
✅ **CORS**: Configured for cross-origin requests  
✅ **Runtime Configuration**: Fixed Vercel build configuration with proper `@vercel/node` usage  

## File Structure

```
api/
└── index.ts          # Vercel serverless API entry point

public/
├── index.html        # Frontend entry with proper meta tags  
└── favicon.svg       # App icon

server/
├── routes.ts         # API route definitions (fixed imports)
├── gemini.ts         # AI integration
├── storage.ts        # Database abstraction
└── prod.ts           # Production server (legacy)

vercel.json           # Vercel deployment configuration
```

## Environment Variables Required

- `GOOGLE_API_KEY`: Your Google Gemini API key for AI features
- `NODE_ENV`: Set to "production" for Vercel deployment

The deployment should now work properly without module resolution errors!