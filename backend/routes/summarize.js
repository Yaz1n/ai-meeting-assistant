import { Router } from 'express';
import { PythonShell } from 'python-shell';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// Get the directory name for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/', async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: 'No transcript provided' });
    }

    // Run the Python script
    const options = {
      mode: 'text',
      pythonPath: 'C:\\Users\\muham\\Desktop\\meeting-assistant\\ai\\venv\\Scripts\\python.exe', // Update this path
      scriptPath: path.join(__dirname, '../../ai'),
      args: [transcript]
    };

    const { results } = await PythonShell.run('summarize.py', options);
    const result = JSON.parse(results[0]);

    res.json(result);
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: 'Summarization failed' });
  }
});

export default router;