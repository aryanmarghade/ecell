import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { FeedbackSubmission } from '../types';

/**
 * Submits patient feedback document to Firestore 'feedback' collection
 */
export async function submitFeedbackToFirestore(feedbackData: Omit<FeedbackSubmission, 'createdAt'>): Promise<{
  success: boolean;
  docId: string;
}> {
  if (!db) {
    throw new Error('Firebase is not configured. Add the VITE_FIREBASE values to .env and retry.');
  }

  const docRef = await addDoc(collection(db, 'feedback'), {
    ...feedbackData,
    createdAt: serverTimestamp(),
    feedbackVersion: 'v2',
  });

  return { success: true, docId: docRef.id };
}
