import React from 'react';
import { Chat } from "./components/Chat";

import './App.css';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <Chat></Chat>
    );
  }
}

export default App;
