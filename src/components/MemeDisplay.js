// src/components/MemeDisplay.js
import React from 'react';

const MemeDisplay = ({ meme }) => {
  return (
    <div>
      <h2>{meme.name}</h2>
      <img src={meme.url} alt={meme.name} />
    </div>
  );
};

export default MemeDisplay;
