import React from 'react';

import './ProductsSite.scss';

import siteLogo from '../assets/img/logo-min.png';

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
          <h2>Najlepsze narzędzia tylko u nas!</h2>
          <nav>
            <section>
              <div className="logo-area">
                <a href="#empty">
                  <img src={ siteLogo } alt="Znana Firma" />
                </a>
                <a href="#empty">
                  <p className="logo-text">Znana<br /> Firma</p>                  
                </a>
                <h2>Najlepsze narzędzia tylko u nas!</h2>
              </div>
              <ul className="nav">
                <li>Główna</li>
                <li className="active">Produkty</li>
                <li>Usługi</li>
                <li>Sklep</li>
                <li>O nas</li>
                <li>Szukaj</li>
                <li>Kontakt</li>
              </ul>
            </section>
          </nav>

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