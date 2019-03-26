import React, { Component } from 'react';
import RotateTool from './editor-tools/RotateTool';
import TextTool from './editor-tools/TextTool';
import './Editor.css';

class Editor extends Component {
  canvasRef = React.createRef()

  componentDidMount () {
    this.__resetCanvas(this.props.file);
  }

  componentDidUpdate (props) {
    if (this.props.file !== props.file) {
      this.__resetCanvas(this.props.file);
    }
  }

  drawImage (ctx, img) {
    this.setState({
      lastImageDrawn: img
    });

    const { cropScale, rot } = this.state || {};

    const $canvas = this.getCanvas(false);

    let rat = img.width / img.height,
        appendWidth = $canvas.width,
        appendHeight = appendWidth / rat;
    console.log('rat', rat);
    console.log('cropScale', cropScale);
    // FLIP!
    if (appendHeight > $canvas.height) {
        appendHeight = $canvas.height;
        appendWidth = appendHeight * rat;
    }

    console.log($canvas.width / 2 - appendWidth / 2, $canvas.height / 2 - appendHeight / 2, appendWidth, appendHeight);

    let cs = cropScale || 1,
        rotation = rot || 0;


    if (rotation) {
      ctx.save();
      ctx.translate($canvas.width / 2, $canvas.height / 2);
      ctx.rotate(rot * Math.PI / 180);
    }

    // translated is if the ctx translation has been changed
    if (rotation) {
      ctx.drawImage(img, -(appendWidth * cs) / 2, -(appendHeight * cs) / 2, appendWidth * cs, appendHeight * cs);
      ctx.restore();
    } else {
      ctx.drawImage(img, $canvas.width / 2 - appendWidth * cs / 2, $canvas.height / 2 - appendHeight * cs / 2, appendWidth * cs, appendHeight * cs);
    }
  }

  __resetCanvas (imageUrl) {
    const ctx = this.getCanvas();
    let img = new Image();
    img.onload = () => this.drawImage(ctx, img);
    img.src = imageUrl; // base64 or url? Could bypass axios, but editor would be sitting here...
  }

  getCanvas (ctx = true) {
    // better done as a pojo for destructuring
    return ctx ? this.canvasRef.current.getContext('2d') : this.canvasRef.current;
  }

  __clearCanvas () {
    let ctx = this.getCanvas(),
        canvas = this.getCanvas(false);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  __enterCroppingMode () {
    this.setState({
      mode: 'crop'
    });
  }

  __enterRotateMode () {
    this.setState({
      mode: 'rotate'
    });
  }

  __enterTextMode () {
    this.setState({
      mode: 'text'
    });
  }

  __getModeTool (mode, props) {
    const mainAct = (type, arg) => {
      console.log('mainAct called', type, arg);
      this[type](arg);
    };

    // These components could use polymorphism and dynamic invocation...
    return {
      crop: <div>
        <input
          type="range"
          min=".1"
          max="5"
          step=".1"
          value={(this.state || {}).cropScale || "1"}
          onChange={this.setCropScale.bind(this)} />
      </div>,
      rotate: <RotateTool action={mainAct} />,
      text: <TextTool action={mainAct} />
    }[mode];
  }

  rotate (amt) {
    let ctx = this.getCanvas(),
        canvas = this.getCanvas(false),
        img = this.state.lastImageDrawn;

    this.setState({
      rot: amt
    }, () => {
      this.__clearCanvas();
      this.drawImage(ctx, img, true);
    })
  }

  text ({ textVal, font, color, size }) {
    let ctx = this.getCanvas(),
        canvas = this.getCanvas(false);

    // better added as layers to be redrawn on command
    ctx.font = `${size}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(textVal, canvas.width / 2, canvas.height / 2);
  }

  setCropScale (e) {
    this.setState({
      cropScale: e.target.value
    }, () => {
      this.__clearCanvas();
      this.drawImage(this.getCanvas(), this.state.lastImageDrawn);
    });
  }

  __exitMode () {
    this.setState({ mode: null });
  }

  __export () {
    // This should just be an anchor triggered
    // + there might be an easier way to pull mimetype
    const mimeType = this.props.file.match(/^data:(image\/\w*);/)[1];
    window.location.href = this.getCanvas(false).toDataURL(mimeType).replace(mimeType, "image/octet-stream");
  }

  render () {
    const { mode } = this.state || {};

    return (
      <div className="interactive__editor">
        {mode ?
          <div className="editor__overlay">
            <div>
              <button type="button" onClick={this.__exitMode.bind(this)}>
                Exit {mode} mode
              </button>
            </div>
            {this.__getModeTool(mode)}
          </div> :
          <div className="editor__toolbelt">
            <button type="button" onClick={this.__enterCroppingMode.bind(this)}>Crop</button>
            <button type="button" onClick={this.__enterRotateMode.bind(this)}>Rotate</button>
            <button type="button" onClick={this.__enterTextMode.bind(this)}>Add Text</button>
            <button type="button" onClick={this.__export.bind(this)}>Export</button>
          </div>
        }
        <canvas
          width="800"
          height="400" // h/w could be dynamic. Image scaling needs these.
          ref={this.canvasRef}
        />
      </div>
    )
  }
}

export default Editor;
