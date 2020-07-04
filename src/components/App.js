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

  setTitle = pageTitle => {
    if ( typeof pageTitle !== "string" ) {
       throw new Error("Tytuł powinien być napisem!");
    }
    document.title = pageTitle;
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
