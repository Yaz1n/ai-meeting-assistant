import React from 'react';

const MeetingListComponent = () => {
  // Placeholder data (to be replaced with Firebase data on Day 7)
  const meetings = [
    { id: 1, title: 'Project Kickoff', date: '2025-06-28', summary: 'Discussed project goals...' },
    { id: 2, title: 'Sprint Planning', date: '2025-06-29', summary: 'Planned tasks for next sprint...' }
  ];

  return (
    <div className="meeting-list-component">
      <h2>Past Meetings</h2>
      <ul>
        {meetings.length > 0 ? (
          meetings.map((meeting) => (
            <li key={meeting.id}>
              <strong>{meeting.title}</strong> - {meeting.date}
              <p>{meeting.summary}</p>
            </li>
          ))
        ) : (
          <li>No past meetings available</li>
        )}
      </ul>
    </div>
  );
};

export default MeetingListComponent;