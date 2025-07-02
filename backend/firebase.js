import { initializeApp, cert } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccount = path.join(__dirname, 'meeting-assistant-firebase-adminsdk.json');
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
export default db;