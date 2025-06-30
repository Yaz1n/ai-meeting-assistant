import React, { useState } from 'react';
import axios from 'axios';

const UploadComponent = ({ onSummary }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send file to /transcribe endpoint
      const transcribeResponse = await axios.post('http://localhost:5000/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const transcript = transcribeResponse.data.transcript;

      // Send transcript to /summarize endpoint
      const summarizeResponse = await axios.post('http://localhost:5000/summarize', { transcript });
      onSummary(summarizeResponse.data); // Pass summary to parent component
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-component">
      <h2>Upload Meeting File</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="audio/*,video/*,text/plain"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Upload and Process'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UploadComponent;