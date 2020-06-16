import React from 'react';
import * as io from 'socket.io-client';

import './Chat.scss';

class Chat extends React.Component {
  socket = null;

  constructor() {
    super();

    this.chatServerUrl = 'https://socket-chat-server-zbqlbrimfj.now.sh';   // możliwy do użycia też 'https://chat-server.fbg.pl' 
    this.nicknameMinLength = 3;  // minimlana długość imienia/ksywki
    this.nicknameMaxLength = 25;  // maksymalna długość
    this.messageMaxLength = 250;  // ilośc znaków do wpisania na kliencie; ile przyjmuje serwer?

    this.state = {
      authorId: '', // czyszczenie na starcie
      isChatExpanded: true,  // czy rozszrzony, czy zwiniety poza okno
      isLoggedInUser: false,  // czy jest "zalogowany" użytkownik
      isNicknameCorrect: true,
      nickname: '', // do odczytania z zewnątrz: ciastka/localStorage
      messages: [
        // { text: string, authorId: number }
      ]
    };
  }

  componentWillMount() {
    this.socket = io.connect( this.chatServerUrl, {
      transports: ['websocket'],
      reconnection: true
    });

    this.socket.on('chat message', message => {
      this.state.messages.push(message);
      this.setState({ messages: this.state.messages });
    });
  }

  sendMessage = () => {
    const text = this.refs.textarea.value.trim();
    if (text) {
      const message = { text, authorId: this.state.authorId };
      this.socket.emit('chat message', message);
      this.refs.textarea.value = '';
    }
  }

  handleEnterPress = event => {
    if ( ( event.keyCode === 13 ) && ( event.shiftKey) ) {  // wyśle, jeśli naciśnięto dodatkow [Shift]
      this.sendMessage();
    }
  }
  
  isEmptyString = ( someText = "" ) => {
    const isEmpty = someText.trim().length;
    // console.log(someText ,'pusty?', (isEmpty === 0) , 'długość ciągu',isEmpty);
    return isEmpty === 0;
  }

/*   isNicknameAlright = ( nickName = "" ) => {
    if ( this.isEmptyString( nickName ) || ( nickName.length < this.nicknameMinLength ) || ( nickName.length > this.nicknameMaxLength ) ) {
      console.log('BAD nickname', nickName, ( nickName.length < this.nicknameMinLength ), ( nickName.length > this.nicknameMaxLength ) );
      return false;
    }
    console.log('GOOD nickname', nickName, ( nickName.length < this.nicknameMinLength ), ( nickName.length > this.nicknameMaxLength ) );
    return true;
  } */

  performChatLoginOrWarn = ( nick ) => {
      // jeśli PUSTA WARTOŚĆ lub POZA ZAKRESEM (trudne do wykonania)
    if ( this.isEmptyString( nick ) || ( nick.length < this.nicknameMinLength ) || ( nick.length > this.nicknameMaxLength ) ) { 
      console.log('PUSTA lub BŁĘDNA WARTOŚĆ NICKU');
      this.setState({ 
        isNicknameCorrect: false,
        nickname: nick.substring(0, this.nicknameMaxLength)  // przycinanie nazwy (o ile istnieje) do jakiegoś makskimum, gdyby jakimś trafem przeszło weryfikację
       });
    }
    else { // AKCEPTOWALNA nazwa
      console.log('JEST NICK', nick);
      this.setState({ 
        authorId: nick,
        nickname: nick,   // czy ten atrybyt jest konieczny, czy trzymać się nazwy użytkownika?
        isLoggedInUser: true,
        isNicknameCorrect: true
      });  // przypisanie nazwy z formularza
    }
  } // performChatLoginOrWarn-END

  handleEnterOnNicknameInput = ( event ) => {
    if ( event.keyCode === 13 ) {  // przejmij dane, tylko jeśli naciśnięto [Enter] -- tu standardowo, bez modyfikatorów
      let nicknameFromInput = event.target.value.trim(); // obcięcie z ewentualnego nadmiaru pustych znaków
      this.performChatLoginOrWarn( nicknameFromInput ); // przeprowadzeni "zalogowania do czatu" lub komunikatu o złych danych wejściowych
      console.log('Enter na',  event.target.name, event.target.innerText, ', treść odczytano bezpośrednio',  nicknameFromInput);
    }
  } // handleEnterOnNicknameInput-END

  handleClickToChatLogin = ( event ) => {
    let nicknameFromInput = this.refs.nickname.value.trim(); // obcięcie z ewentualnego nadmiaru pustych znaków
    this.performChatLoginOrWarn( nicknameFromInput ); // przeprowadzeni lokalnego "zalogowania" lub komunikatu o złych danych wejściowych
    console.log('Kliknięto na',  event.target.name, event.target.innerText, ', odczytano sąsiedni INPUT',  nicknameFromInput);
  } // handleClickToChatLogin-END

  handleClickToChatLogout = () => {
    this.setState({ 
      isLoggedInUser: false // stan na wylogowany, ale nazwa użytkowika nie jest usuwana z pamięci
    });  // przypisanie nazwy z formularza
  }

  clickHandleClickOnOuterBookmark = () => {
    this.setState({ isChatExpanded: !this.state.isChatExpanded });    // negowanie stanu pokazania okna chatu
  }

  render() {
    return (
      <section className={ this.state.isChatExpanded ? "wrapper" : "wrapper moved" }>
        <div className="chat">
          <header>
            <p>Szybki kontakt

              { this.state.isLoggedInUser && (  // warunkowe wyświetlenie "zalogowanego" i możliwości wylogowania
              <>
                <span>(Ty jako <strong>{ this.state.authorId }</strong>)</span>
                <button className="chat-logout" onClick={ this.handleClickToChatLogout }>Wyjdź</button>
              </>  
              ) }

            </p>
          </header>

          <section>
            {this.state.messages.map(message => (
              <div key={message.id} className="message">
                {message.authorId}:{' '}
                {message.authorId === this.state.authorId ? (
                  <span>{message.text}</span>
                ) : (
                    message.text
                  )}
              </div>
            ))}
          </section>

          <footer>
            
            { !this.state.isLoggedInUser && ( // wariant FALSE - warunkowe wyświetlanie dla NIEZALOGOWANEGO UŻYTKOWNIKA
            <div className="nick-selection">
              <p className="nick-info">Wpisz swoje imię lub pseudonim by móc pisać wiadomości. Obowiązkowo.</p>
              <div>
                <input type="text" className={ this.state.isNicknameCorrect ? "nick-input" : "nick-input bad-or-empty" } ref="nickname" minLength={ this.nicknameMaxLength } maxLength={ this.nicknameMaxLength }
                    onKeyUp={ this.handleEnterOnNicknameInput } placeholder="Janek" defaultValue={ this.state.nickname } required />
                <button className="chat-login" onClick={ this.handleClickToChatLogin } >Wejdź</button>
              </div>
              { !this.state.isNicknameCorrect && (
              <div className="nickname-error">Brak nazwy lub za krótka (min. 3 znaki).</div>
              )}
            </div>
            )}

            { this.state.isLoggedInUser && (  // - wariant TRUE - warunkowe wyświetlanie dla ZALOGOWANEGO/WPISANEGO użytkownika
            <div className="chat-controls">
              <textarea className="textarea" ref="textarea" wrap="soft" maxLength={ this.messageMaxLength } placeholder="Zapytaj o ofertę...  &#13;&#10;(szybka wysyłka: [Shift] + [Enter])"
                onKeyUp={ this.handleEnterPress } />
              <button onClick={ this.sendMessage } className="send-button">Wyślij</button>
            </div>
            )}

          </footer>

        </div>
        <div className="outer-bookmark" onClick={ this.clickHandleClickOnOuterBookmark }>
            { this.state.isChatExpanded ? "Zwiń" : "Rozwiń" } czat
        </div>
      </section>
    );
  } // render-END

}

export { Chat };
