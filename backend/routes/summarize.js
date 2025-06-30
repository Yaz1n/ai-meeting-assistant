import { Router } from 'express';
import { PythonShell } from 'python-shell';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
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

    const options = {
      mode: 'text',
      pythonPath: 'C:\\Users\\muham\\Desktop\\meeting-assistant\\ai\\venv\\Scripts\\python.exe',
      scriptPath: path.join(__dirname, '../../ai'),
      args: [transcript],
    };

    let stdoutBuffer = ''; // Renamed to clearly indicate it's for stdout
    let stderrBuffer = ''; // Renamed for clarity

    const pyshell = new PythonShell('summarize.py', options);

    pyshell.on('message', (message) => {
      stdoutBuffer += message; // This should now ideally only contain the final JSON
    });

    pyshell.on('stderr', (stderr) => {
      stderrBuffer += stderr;
      console.error('Python STDERR:', stderr); // Log stderr to diagnose issues
    });

    pyshell.end((err, code, signal) => {
      if (err) {
        console.error('Python execution failed (PythonShell error):', err);
        // Attempt to parse stdoutBuffer in case Python sent a JSON error before exiting with a non-zero code
        try {
          const parsedResult = JSON.parse(stdoutBuffer.trim());
          if (parsedResult.error) {
            console.error('Python script returned a JSON error:', parsedResult);
            return res.status(500).json(parsedResult);
          }
        } catch (parseError) {
          console.error('Failed to parse stdoutBuffer as JSON on PythonShell error:', parseError, 'Raw stdout:', stdoutBuffer);
        }
        return res.status(500).json({ error: 'Python execution failed', details: err.message, stderr: stderrBuffer });
      }

      // If PythonShell finished without an error
      try {
        const result = JSON.parse(stdoutBuffer.trim()); // Now directly parse the entire stdoutBuffer

        if (result.error) {
          console.error('Summarization result contains an error:', result.error);
          return res.status(500).json(result); // Return the error from Python
        }

        console.log('Summarization successful, result:', result);
        res.json(result);
      } catch (parseError) {
        console.error('Failed to parse Python output:', parseError, 'Raw stdout:', stdoutBuffer, 'Raw stderr:', stderrBuffer);
        res.status(500).json({ error: 'Failed to parse Python output', rawOutput: stdoutBuffer, stderr: stderrBuffer });
      }
    });
  } catch (error) {
    console.error('Summarization error (outer catch):', error);
    res.status(500).json({ error: 'Summarization failed', details: error.message });
  }
});

export default router;