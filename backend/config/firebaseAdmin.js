const admin = require('firebase-admin');

if (!admin.apps.length) {
  // Option A: service account JSON file (preferred for production)
  // Set FIREBASE_SERVICE_ACCOUNT_PATH in .env pointing to your downloaded service account JSON
  // OR set individual env vars FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY

  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } else if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId:   process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Railway/Render store multiline as escaped \n — fix it:
        privateKey:  (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      })
    });
  } else {
    // Fallback: Application Default Credentials (works on Google Cloud)
    admin.initializeApp();
  }
}

module.exports = admin;
