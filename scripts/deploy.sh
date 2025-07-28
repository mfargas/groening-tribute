#!/bin/bash

echo "🚀 Starting deployment preparation..."

# Clean install
echo "📦 Cleaning and reinstalling dependencies..."
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Build test
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files created in ./build/"
    echo "🚀 Ready for deployment!"
else
    echo "❌ Build failed!"
    exit 1
fi 