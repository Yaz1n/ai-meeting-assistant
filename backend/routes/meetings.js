import { Router } from 'express';
import db from '../firebase.js';

const router = Router();

router.post('/save', async (req, res) => {
  try {
    const { title, transcript, summaryData } = req.body;
    if (!title || !transcript || !summaryData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const meetingData = {
      title,
      date: new Date().toISOString(),
      transcript,
      summary: summaryData.summary,
      key_points: summaryData.key_points || [],
      decisions: summaryData.decisions || [],
      action_items: summaryData.action_items || [],
      conclusion: summaryData.conclusion || ''
    };

    const docRef = await db.collection('meetings').add(meetingData);
    res.json({ id: docRef.id, message: 'Meeting saved successfully' });
  } catch (err) {
    console.error('Error saving meeting:', err);
    res.status(500).json({ error: 'Failed to save meeting', details: err.message });
  }
});

router.get('/meetings', async (req, res) => {
  try {
    const snapshot = await db.collection('meetings').get();
    const meetings = [];
    snapshot.forEach((doc) => {
      meetings.push({ id: doc.id, ...doc.data() });
    });
    res.json(meetings);
  } catch (err) {
    console.error('Error retrieving meetings:', err);
    res.status(500).json({ error: 'Failed to retrieve meetings', details: err.message });
  }
});

export default router;