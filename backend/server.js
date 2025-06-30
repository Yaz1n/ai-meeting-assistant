import express from 'express';
import cors from 'cors';
import transcribeRouter from './routes/transcribe.js';
import summarizeRouter from './routes/summarize.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/transcribe', transcribeRouter);
app.use('/summarize', summarizeRouter);

app.get('/', (req, res) => {
  res.send('AI Meeting Assistant Backend');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});