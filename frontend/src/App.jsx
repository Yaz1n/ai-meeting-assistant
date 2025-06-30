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
      <h1>AI Meeting Assistant</h1>
      <UploadComponent onSummary={handleSummary} />
      <SummaryComponent summaryData={summaryData} />
      <MeetingListComponent />
    </div>
  );
}

export default App;