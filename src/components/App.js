import React from 'react';
import { Chat } from "./Chat";
import { ProductsSite } from "./ProductsSite";

import './App.css';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
    };
  }

  setTitle = (title) => {
    if ( typeof title !== "string" ) {
       throw new Error("Title should be an string!");
    }
    document.title = title;
  }

  componentDidMount() {
    this.setTitle("React Chat -- Wybór Produktów Znanej Firmy"); // ustalenie nowego tytułu dla strony
  }

  render() {
    return (
      <>
        <ProductsSite></ProductsSite>
        <Chat></Chat>
      </>  
    );
  }
}

export default App;
