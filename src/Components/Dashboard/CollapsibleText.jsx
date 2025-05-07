import React, { useState } from 'react';
import propTypes from 'prop-types';

function CollapsibleText({ text, limit = 100 }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = text.length > limit;

  const displayText = isLong && !isExpanded
    ? text.slice(0, limit) + '…'
    : text;

  return (
    <div>
      <span>{displayText}</span>
      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            marginLeft: 4,
            background: 'none',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
            padding: 0,
            fontSize: '0.9em'
          }}
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
}

CollapsibleText.propTypes = {
  text: propTypes.string.isRequired,
  limit: propTypes.number
};

export default CollapsibleText;
