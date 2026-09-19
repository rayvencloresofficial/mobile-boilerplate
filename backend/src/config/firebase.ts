import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import { ENV } from './env.js';

/**
 * Verifies Firebase ID tokens. Credentials are intentionally supplied by the
 * environment (for example GOOGLE_APPLICATION_CREDENTIALS), never by clients.
 */
export const verifyFirebaseIdToken = async (token: string): Promise<DecodedIdToken> => {
  if (!ENV.FIREBASE_PROJECT_ID) {
    throw new Error('Firebase authentication is not configured. Set FIREBASE_PROJECT_ID and application credentials.');
  }

  const app = getApps()[0] ?? initializeApp({
    credential: applicationDefault(),
    projectId: ENV.FIREBASE_PROJECT_ID,
  });

  return await getAuth(app).verifyIdToken(token);
};
