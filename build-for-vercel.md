# Vercel Deployment Instructions

## Build Process
1. Run `npm run build` to create the production build
   - This builds the frontend to `dist/public/`
   - Bundles the backend to `dist/index.js`

## Vercel Configuration
The project includes a `vercel.json` file that:
- Uses `server/prod.ts` as the production entry point
- Routes API calls to `/api/*` to the server
- Serves static files from the built frontend
- Handles SPA routing for the React app

## Environment Variables
Make sure to set these in your Vercel project:
- `GOOGLE_API_KEY` - Your Google Gemini API key
- `NODE_ENV=production`

## File Structure After Build
```
dist/
├── public/           # Frontend static files
│   ├── index.html
│   ├── assets/
│   └── ...
└── index.js          # Bundled backend server
```

## Troubleshooting
- Ensure your Google API key is properly set in Vercel environment variables
- Check that the build completes successfully before deployment
- Verify that `dist/public/index.html` exists after running build