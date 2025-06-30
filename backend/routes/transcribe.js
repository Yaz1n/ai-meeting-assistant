import { Router } from 'express';
import { AssemblyAI } from 'assemblyai';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const upload = multer({ dest: 'uploads/' });
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const transcript = await client.transcripts.transcribe({
      audio: req.file.path
    });
    res.json({ transcript: transcript.text });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

export default router;