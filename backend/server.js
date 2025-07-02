import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import transcribeRoutes from './routes/transcribe.js';
import summarizeRoutes from './routes/summarize.js';
import meetingsRoutes from './routes/meetings.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/transcribe', transcribeRoutes);
app.use('/summarize', summarizeRoutes);
app.use('/meetings', meetingsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});