import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MeetingListComponent = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/meetings');
        setMeetings(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load meetings');
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  return (
    <div className="meeting-list-component">
      <h2>Past Meetings</h2>
      {loading && <p>Loading meetings...</p>}
      {error && <p className="error">{error}</p>}
      <ul>
        {meetings.length > 0 ? (
          meetings.map((meeting) => (
            <li key={meeting.id}>
              <strong>{meeting.title}</strong> - {new Date(meeting.date).toLocaleString()}
              <p>{meeting.summary}</p>
            </li>
          ))
        ) : (
          !loading && <li>No past meetings available</li>
        )}
      </ul>
    </div>
  );
};

export default MeetingListComponent;