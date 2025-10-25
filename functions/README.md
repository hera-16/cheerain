# Firebase Functions for Cheerain

This folder contains a Cloud Function that periodically deletes expired `venueCodes` documents from Firestore.

## Files
- `index.js` - Implements `deleteExpiredVenueCodes`, scheduled to run every hour.
- `package.json` - Node dependencies and helper scripts.

## Setup & Deploy
1. Install Firebase CLI (if you haven't):

```powershell
npm install -g firebase-tools
```

2. Login and initialize functions (only if you haven't initialized this project for Firebase):

```powershell
firebase login
# If you haven't initialized functions for the project, run:
firebase init functions
# Follow prompts and choose JavaScript, Node 18 runtime
```

3. Install dependencies and deploy functions:

```powershell
cd functions
npm install
firebase deploy --only functions
```

## Local testing with emulator

```powershell
cd functions
npm install
# Start functions emulator
firebase emulators:start --only functions
# The scheduled function won't auto-run exactly like in prod, but you can trigger it via the emulator UI or call the exported function locally
```

## Notes
- The function deletes documents where `expiresAt <= now` in the `venueCodes` collection.
- Make sure your Firestore timestamps are stored as Firestore `Timestamp` objects (serverTimestamp / Timestamp.fromDate), not plain strings.
- If you prefer TypeScript or cloud-run cron jobs, this directory can be adapted.
