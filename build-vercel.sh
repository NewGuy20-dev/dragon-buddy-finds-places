#!/bin/bash

# Build script for Vercel deployment

echo "🔨 Building Travel Buddy for Vercel..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the frontend
echo "🌐 Building frontend..."
npm run build

# Verify build output
echo "✅ Build verification:"
ls -la dist/public/

# Check for required files
if [ -f "dist/public/index.html" ]; then
    echo "✅ index.html found"
else
    echo "❌ index.html missing"
    exit 1
fi

if [ -d "dist/public/assets" ]; then
    echo "✅ assets directory found"
    ls -la dist/public/assets/
else
    echo "❌ assets directory missing"
    exit 1
fi

echo "🚀 Build completed successfully!"
echo "Ready for Vercel deployment"