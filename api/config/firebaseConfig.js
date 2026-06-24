import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccountPath = './serviceAccount.json';

if (!admin.apps.length) {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    // Fallback to Application Default Credentials or environment variables
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT
    });
  }
}

export const db = admin.firestore();
export { admin };
