import React, { Component } from 'react';
import axios from 'axios';
import 'normalize.css';
import './App.css';
import Header from './block-elements/Header';
import DragDrop from './DragDrop';
import ImportUrl from './ImportUrl';
import Editor from './Editor';

class App extends Component {
  fileIngress (e) {
    e.preventDefault();
    e.stopPropagation();

    let firstFile = e.dataTransfer.files[0];

    const reader = new FileReader();

    reader.onabort = () => console.warn('File read aborted');
    reader.onerror = (e) => console.error('File read error:', e);
    reader.onload = () => {
      this.setState({
        file: reader.result
      });
    };

    reader.readAsDataURL(firstFile);
  }

  async fileUrlIngress (url) {
    // following url is a workaround for having a proper backend proxy. :-P
    let res = await axios.get(`https://cors-anywhere.herokuapp.com/${url}`, {
      responseType: 'arraybuffer'
    });

    this.setState({
      file: new Buffer(res.data, 'binary').toString('base64')
    });
  }

  render () {
    const { file } = this.state || {};

    return (
      <div className="application__container">
        <Header />
        {file ?
          <Editor file={file} /> :
          <div>
            <ImportUrl onUrlEntry={this.fileUrlIngress.bind(this)} />
            <DragDrop ondrop={this.fileIngress.bind(this)} />
          </div>
        }

      </div>
    );
  }
}

export default App;
