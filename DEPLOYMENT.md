# Deployment Guide for Matt Groening Tribute Site

## 🚀 Netlify Deployment

### Issue Resolution

The error you encountered is due to Netlify using an outdated Ubuntu 16.04 build image AND dependency conflicts with Storybook versions. The configuration files I've added will fix both issues.

### Files Added/Updated:

1. **`netlify.toml`** - Main Netlify configuration with legacy peer deps flag
2. **`.nvmrc`** - Node.js version specification
3. **`package.json`** - Fixed Storybook dependency conflicts
4. **Updated navigation** - Changed to show show names instead of generic labels

### Configuration Details:

#### `netlify.toml`

- **Build command**: `npm run build`
- **Publish directory**: `build`
- **Node.js version**: 18
- **SPA redirects**: Handles React Router properly
- **Asset optimization**: CSS/JS minification and image compression

#### `.nvmrc`

- **Node.js version**: 18 (latest LTS)

### Deployment Steps:

1. **Commit your changes**:

   ```bash
   git add .
   git commit -m "Fix Netlify deployment with updated build image"
   git push origin main
   ```

2. **In Netlify Dashboard**:

   - Go to your site settings
   - Navigate to "Build & deploy" → "Environment"
   - Verify the build settings match your `netlify.toml`

3. **Trigger a new deployment**:
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"

### Expected Results:

- ✅ **Build will succeed** with Node.js 18
- ✅ **No more Xenial error**
- ✅ **Proper SPA routing** for React
- ✅ **Optimized assets** for production

### Troubleshooting:

If you still encounter issues:

1. **Check build logs** in Netlify dashboard
2. **Verify Node.js version** is 18 or higher
3. **Clear build cache** if needed
4. **Check for any console errors** in the deployed site

### Manual Build Test:

```bash
# Test the build locally
npm run build

# Serve the build locally
npx serve -s build
```

### Performance Optimizations:

- **CSS/JS minification** enabled
- **Image compression** enabled
- **Pretty URLs** for better SEO
- **SPA redirects** for client-side routing

---

**Note**: The site should now deploy successfully with the modern build image and optimized configuration!
