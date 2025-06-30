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
      console.error('No transcript provided in request');
      return res.status(400).json({ error: 'No transcript provided' });
    }

    console.log('Received transcript:', transcript.substring(0, 50) + '...');

    // Run the Python script
    const options = {
      mode: 'text',
      pythonPath: 'C:\\Users\\muham\\Desktop\\meeting-assistant\\ai\\venv\\Scripts\\python.exe',
      scriptPath: path.join(__dirname, '../../ai'),
      args: [transcript],
      stderr: true // Capture stderr
    };

    const { results, error, stderr } = await PythonShell.run('summarize.py', options);
    if (error) {
      console.error('PythonShell error:', error, 'Stderr:', stderr);
      return res.status(500).json({ error: 'Python execution failed', details: error.message, stderr });
    }

    if (!results || results.length === 0) {
      console.error('No results from Python script. Stderr:', stderr);
      return res.status(500).json({ error: 'No results from Python script', stderr });
    }

    const result = JSON.parse(results[0]);
    console.log('Summarization result:', result);
    res.json(result);
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: 'Summarization failed', details: error.message });
  }
});

export default router;