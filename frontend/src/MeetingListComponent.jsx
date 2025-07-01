import React from 'react';

const MeetingListComponent = () => {
  // Mock Firebase data
  const meetings = [
    {
      id: 'meeting_001',
      title: 'Project Kickoff',
      date: '2025-06-28T10:00:00Z',
      summary: 'The team discussed project goals and timelines.'
    },
    {
      id: 'meeting_002',
      title: 'Sprint Planning',
      date: '2025-06-29T14:00:00Z',
      summary: 'Planned tasks for the next sprint and assigned roles.'
    }
  ];

  return (
    <div className="meeting-list-component">
      <h2>Past Meetings</h2>
      <ul>
        {meetings.length > 0 ? (
          meetings.map((meeting) => (
            <li key={meeting.id}>
              <strong>{meeting.title}</strong> - {new Date(meeting.date).toLocaleString()}
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