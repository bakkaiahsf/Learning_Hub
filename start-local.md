# SalesforceLearnHub - Local Setup Instructions

## Quick Start

1. **Stop any running dev servers**
   ```bash
   # Press Ctrl+C to stop any running processes
   ```

2. **Install dependencies** (if not done already)
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser to:**
   ```
   http://localhost:3000
   ```

## If you encounter issues:

### Port 3000 is busy:
```bash
# Kill any process using port 3000
npx kill-port 3000
# Then restart
npm run dev
```

### Network timeout issues:
```bash
# Use the non-turbo version
npm run dev
```

### Clear Next.js cache:
```bash
# Delete .next folder and restart
rm -rf .next
npm run dev
```

## Expected Behavior:

✅ **App should load instantly** on http://localhost:3000
✅ **All buttons should be clickable** 
✅ **Search should work** (try typing "admin" and clicking search)
✅ **Navigation should work** (click "Browse Learning Paths")
✅ **Subscription modal** should open when clicking "Get Free Access"

## Features to Test:

1. **Hero Search**: Type a query and click search button
2. **Popular Searches**: Click any of the suggestion pills
3. **Get Free Access**: Should open subscription modal
4. **Browse Learning Paths**: Should navigate to learning paths page
5. **Header Search**: Should work from any page
6. **Subscribe Button**: Should open subscription modal
7. **Contact Button**: Should open contact modal

## Troubleshooting:

- If UI looks broken: Check browser console for errors
- If buttons don't work: Try refreshing the page
- If port conflicts: Use `npm run dev` instead of `npm run dev:turbo`

The app is designed to work offline with mock data, so it should function perfectly even without Supabase connection.