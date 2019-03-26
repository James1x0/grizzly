import React, { useState } from 'react';
import './RotateTool.css';

export default function RotateTool ({ action }) {
  const [ rotation, setRotation ] = useState(0);

  const rotate = (amt) => {
    let newAmt = rotation + amt;
    action('rotate', newAmt);
    setRotation(newAmt);
  };

  return (
    <div>
      <button type="button" onClick={() => rotate(-10)}>&#9668;</button>
      <button type="button" onClick={() => rotate(10)}>&#9658;</button>
    </div>
  )
};
