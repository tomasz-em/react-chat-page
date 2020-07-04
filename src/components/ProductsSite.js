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
          <div className="products-title">
            <h1>Nasze produkty</h1>
          </div>
          <section className="products-main">
            <h3>Skorzystaj z poniższego filtrowania, by łatwiej wybrać poszukiwany produkt.</h3>
            <div className="products-selection">
              <button className="all-items">Wszystkie</button>
              <button>Typ A</button>
              <button className="selected">Typ B</button>
              <button>Typ C</button>
              <button>Typ D</button>
              <button className="selected">Typ G</button>
              <button className="selected">Typ P</button>
              <button>Typ W</button>
            </div>
            <p>Jeśli gubisz się w produktach, zapraszamy do skorzystania z czatu. 
              Nasi pracownicy chętnie pomogą Ci w wyborze.
            </p> 
          </section>
          <ul>
            <li>
              <h2>Produkt</h2>
              <p>Dane szczegółowe tego produktu ...</p>
              <hr />
            </li>
            <li>
              <h2>Produkt</h2>
              <p>Dane szczegółowe tego produktu ...</p>
              <hr />
            </li>
            <li>
              <h2>Produkt</h2>
              <p>Dane szczegółowe tego produktu ...</p>
              <hr />
            </li>
            <li>
              <h2>Produkt</h2>
              <p>Dane szczegółowe tego produktu ...</p>
              <hr />
            </li>
            <li>
              <h2>Produkt</h2>
              <p>Dane szczegółowe tego produktu ...</p>
              <hr />
            </li>
            <li>
              <h2>Produkt</h2>
              <p>Dane szczegółowe tego produktu ...</p>
            </li>
          </ul>
          <p>...</p>
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