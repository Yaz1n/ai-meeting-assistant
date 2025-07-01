import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

const UploadComponent = ({ onSummary }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
    setProgress('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    // ✅ Add .m4a support
    const validTypes = [
      'audio/mpeg',   // .mp3
      'audio/mp4',    // .m4a (common)
      'audio/x-m4a',  // .m4a (alternative)
      'audio/wav',    // .wav
      'video/mp4',    // .mp4
      'text/plain'    // .txt
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload MP3, M4A, WAV, MP4, or TXT files.');
      return;
    }
    if (file.size > maxSize) {
      setError('File size exceeds 10MB limit.');
      return;
    }

    setLoading(true);
    setProgress('Uploading file...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setProgress('Transcribing audio...');
      const transcribeResponse = await axios.post('http://localhost:5000/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const transcript = transcribeResponse.data.transcript;

      setProgress('Generating summary...');
      const summarizeResponse = await axios.post('http://localhost:5000/summarize', { transcript });
      onSummary(summarizeResponse.data);
      setProgress('Processing complete!');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during processing');
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(''), 2000);
    }
  };

  return (
    <div className="upload-component">
      <h2>Upload Meeting File</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".mp3,.m4a,.wav,.mp4,.txt,audio/mpeg,audio/mp4,audio/x-m4a,audio/wav,video/mp4,text/plain"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Upload and Process'}
        </button>
      </form>
      {loading && (
        <div className="loading">
          <ClipLoader size={30} color="#007bff" />
          <p>{progress}</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default UploadComponent;
