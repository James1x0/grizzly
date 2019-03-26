import React, { Component } from 'react';
import './DragDrop.css';

const classNames = require('classnames');

const eventBindings = [
  'dragenter',
  'dragleave',
  'dragover',
  'drop'
];

class DragDrop extends Component {
  ddRef = React.createRef()

  __dragenter () {
    this.setState({
      active: true
    });
  }

  __dragleave () {
    this.setState({
      active: false
    });
  }

  __handleEvent (eventName) {
    return (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      if (this[`__${eventName}`]) {
        this[`__${eventName}`](ev);
      }

      if (!this.props[`on${eventName}`]) {
        return;
      }

      this.props[`on${eventName}`](ev);
    };
  }

  componentDidMount () {
    let $dd = this.ddRef.current;
    eventBindings.map(ev => $dd.addEventListener(ev, this.__handleEvent(ev)))
  }

  componentWillUnmount () {
    let $dd = this.ddRef.current;
    eventBindings.map(ev => $dd.removeEventListener(ev, this.__handleEvent(ev)))
  }

  render () {
    const { active } = this.state || {};

    return (
      <div
      className={classNames("interactive__dragdrop", {
        'interactive__dragdrop--active': active
      })}
      ref={this.ddRef}
      >
        {this.props.children || false}
      </div>
    )
  }
}

export default DragDrop;
