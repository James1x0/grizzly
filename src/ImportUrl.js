import React, { useState } from 'react';

// const classNames = require('classnames');

export default function ImportUrlComponent (props) {
  const [ val, setVal ] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    props.onUrlEntry(val);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Drop below or enter an image URL
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
};
