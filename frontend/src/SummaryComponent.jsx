import React from 'react';

const SummaryComponent = ({ summaryData }) => {
  if (!summaryData || summaryData.error) {
    return <p>No summary available</p>;
  }

  const { summary, key_points, decisions, action_items, conclusion } = summaryData;

  return (
    <div className="summary-component">
      <h2>Meeting Summary</h2>
      <h3>Summary</h3>
      <p>{summary || 'No summary provided'}</p>

      <h3>Key Points</h3>
      <ul>
        {key_points && key_points.length > 0 ? (
          key_points.map((point, index) => <li key={index}>{point}</li>)
        ) : (
          <li>No key points available</li>
        )}
      </ul>

      <h3>Decisions</h3>
      <ul>
        {decisions && decisions.length > 0 ? (
          decisions.map((decision, index) => <li key={index}>{decision}</li>)
        ) : (
          <li>No decisions recorded</li>
        )}
      </ul>

      <h3>Action Items</h3>
      <ul>
        {action_items && action_items.length > 0 ? (
          action_items.map((item, index) => (
            <li key={index}>
              {item.task} (Assigned to: {item.assignee.join(', ')})
            </li>
          ))
        ) : (
          <li>No action items assigned</li>
        )}
      </ul>

      <h3>Conclusion</h3>
      <p>{conclusion || 'No conclusion provided'}</p>
    </div>
  );
};

export default SummaryComponent;