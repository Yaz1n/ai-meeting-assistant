import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

const UploadComponent = ({ onSummary }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
    setProgress('');
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a meeting title');
      return;
    }

    // Validate file type and size
    const validTypes = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'video/mp4', 'text/plain'];
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
      const summaryData = summarizeResponse.data;

      setProgress('Saving meeting...');
      await axios.post('http://localhost:5000/meetings/save', {
        title,
        transcript,
        summaryData
      });

      onSummary(summaryData);
      setProgress('Processing complete!');
      setTitle(''); // Clear title input
      setFile(null); // Clear file input
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
          type="text"
          placeholder="Enter meeting title"
          value={title}
          onChange={handleTitleChange}
          disabled={loading}
        />
        <input
          type="file"
          accept="audio/mpeg,audio/mp4,audio/wav,video/mp4,text/plain"
          onChange={handleFileChange}
          disabled={loading}
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