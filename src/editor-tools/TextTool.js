import React, { useState } from 'react';
import './RotateTool.css';

const FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Courier',
  'Verdana',
  'Georgia'
];

export default function TextTool ({ action }) {
  const [ textVal, setTextVal ] = useState(''),
        [ font, setFont ] = useState(FONTS[0]),
        [ size, setSize ] = useState(20),
        [ color, setColor ] = useState('#000000');

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    action('text', {
      textVal,
      font,
      color,
      size
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Text to add
        <input
          type="text"
          value={textVal}
          placeholder="Enter your text to be added"
          onChange={(e) => setTextVal(e.target.value)} />
      </label>
      <label>
        Size in px
        <input
          type="number"
          value={size}
          placeholder="px"
          onChange={(e) => setSize(e.target.value)} />
      </label>
      <label>
        <select value={font} onChange={(e) => setFont(e.target.value)}>
          {FONTS.map((f, i) => <option key={i} value={f}>{f}</option>)}
        </select>
      </label>
      <label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      </label>
      <button type="submit">Add Text</button>
    </form>
  )
};
