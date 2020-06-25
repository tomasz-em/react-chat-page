import React from 'react';

import './ProductsSite.scss';

class ProductsSite extends React.Component {

  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <div className="whole-container">
        <header className="page-header">
          <h1>Tytuł witryny</h1>
          <h3>I jakiś podtytuł</h3>
          <p>A wkrótce i także i lista nawigacyjna...</p>
        </header>

        <main className="main-content">
        <div>
            Tu trochę treści...
          </div>
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <div>
            I tu znówtrochę treści...
          </div>
        </main>

        <footer className="page-footer">
        <p>Tu jakieś namiary kontaktowe</p>
        <p>I tutaj też, i tu. Konkretny addres i telefony.</p>
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <p>I znów jakieś namiary kontaktowe</p>
        <p>I tutaj też, i tu. Konkretny addres i telefony.</p>        </footer>
      </div>
    );
  }
}

export { ProductsSite };