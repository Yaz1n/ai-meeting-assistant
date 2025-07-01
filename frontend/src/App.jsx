import React, { useState } from 'react';
import './App.css';
import UploadComponent from './UploadComponent';
import SummaryComponent from './SummaryComponent';
import MeetingListComponent from './MeetingListComponent';

function App() {
  const [summaryData, setSummaryData] = useState(null);

  const handleSummary = (data) => {
    setSummaryData(data);
  };

  return (
    <div className="app">
      <header>
        <h1>AI Meeting Assistant</h1>
        <p>Upload meeting files to generate summaries and track action items</p>
      </header>
      <div className="container">
        <div className="upload-section">
          <UploadComponent onSummary={handleSummary} />
        </div>
        <div className="summary-section">
          <SummaryComponent summaryData={summaryData} />
        </div>
        <div className="meetings-section">
          <MeetingListComponent />
        </div>
      </div>
    </div>
  );
}

export default App;