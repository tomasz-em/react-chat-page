import React from 'react';
import * as io from 'socket.io-client';

import './Chat.scss';
import { Message } from './Message'

import trashcan16x16 from '../assets/img/trashcan16x16.png';  // ikony do przycików: www.flaticon.com
import alarm16x16_on from '../assets/img/alarm16x16-on.png';
import alarm16x16_off from '../assets/img/alarm16x16-off.png';
import info16x16dark from '../assets/img/info16x16-dark.png';

import bell from '../assets/sound/notification.mp3'; // dźwięk powiadomienia i konwersja do mp3 z https://freesound.org/people/BeezleFM/sounds/512136/

class Chat extends React.Component {
  socket = null;

  constructor() {
    super();

    this.chatServerUrl = 'https://socket-chat-server-zbqlbrimfj.now.sh';   // możliwy do użycia też 'https://chat-server.fbg.pl' 
    this.nicknameMinLength = 3;  // minimlana długość imienia/ksywki
    this.nicknameMaxLength = 25;  // maksymalna długość
    this.messageMaxLength = 250;  // ilośc znaków do wpisania na kliencie; ile przyjmuje serwer?
    this.audioElem = new Audio( bell ); // wprost tworzenie elementu audio, bez budowania go poprzez React
    this.soundUsedString = 'PLAY_SOUND';  // wartość TRUE jako "stała" dla WŁĄCZONEJ obsługi dźwięku w przeglądarce (bazując na LS)

    this.state = {
      authorId: '', // czyszczenie na starcie
      isChatExpanded: true,  // czy rozszrzony, czy zwiniety poza okno
      isLoggedInUser: false,  // czy jest "zalogowany" użytkownik
      isNicknameCorrect: true,
      isSoundUsed: false,
      isInfoContentExpanded: false,
      localUserId: 0,  // do weryfikowania "toższamości lokalnej", czyli by nie podszywać się pod inne loginy i nie edytować "czyichś" wiadomości
      nickname: '', // do przechowywanie przed zalogowaniem; warto odczytać z zewnątrz: ciastka/localStorage
      messages: [
        // { authorId: string, text: string,  ...}  // można rozszerzać o dowolne atrybuty, które będą odesłane
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
      if ( this.state.isSoundUsed ) this.audioElem.play();  // podpięcie powiadamiania dźwięowego po otrzymaniu nowej wiadomości
      console.log("NOWA WIADOMOŚĆ", message); // dostajemy cztery atrybuty z wysłanych dwóch, np.
      // {text: "TREŚĆ_WIADOMOŚCI?", authorId: "NAZWA_WYSYŁAJACEGO", id: "4lOKAit8Q6", timestamp: 1592494594068}
    });

    this.setState({ nickname: this.readAndCheckNicknameFromStorage('chat-nickname') }); // odczytanie zapamiętanego z localStorage (o ile istnieje)
    this.setState({ isSoundUsed: this.readAndCheckSoundOptionsFromStorage('chat-sound') }); // odczytanie wartości konfiguracji zapamiętanej z localStorage (o ile istnieje)
  }

  sendMessage = () => {
    const text = this.refs.textarea.value.trim();
    if (text) {
      const message = { 
        text,
        authorId: this.state.authorId,
        localUserId: this.state.localUserId   // dodanie nowego atrybutu do wysyłki
      };
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

  readFromStorage = ( storageKey ) => {
    let readValue = localStorage.getItem( storageKey );
    if ( !readValue ) readValue = ""; // null dla braku zapisania (odsłona bez wcześnejszego czatowania) 
    console.log("ODCZYTANO v0.1 z LS:", storageKey, readValue, "długość ciągu", readValue.length);
    readValue = readValue.trim(); // ewentualne cięcie śmieci
    console.log("ODCZYTANO v0.2 z LS:", storageKey, readValue, "długość ciągu", readValue.length);
    return readValue;
  }

  readAndCheckNicknameFromStorage = ( nicknameKey ) => {
    let nick = this.readFromStorage( nicknameKey );
    nick = nick.substring(0, this.nicknameMaxLength); // skrócenie do wymaganej postaci
    console.log("ODCZYTANO v0.3 z LS:", nick, "długość ciągu", nick.length);
    return nick;
  }

  readAndCheckSoundOptionsFromStorage = ( soundKey ) => {
    let isSoundON = false;  // wstępnie zerowanie stanu
    let soundOption = this.readFromStorage( soundKey );
      if ( soundOption ) {  // isteniej jakaś wartość przekazana
        isSoundON = soundOption.search( this.soundUsedString ); // poszukiwania konkretego ciągu, jako wartości TAK
        console.log("ODCZYTANO v0.3 z LS:", soundOption, "treść na pozycji", isSoundON);
        if ( isSoundON >= 0 ) isSoundON = true;  // !!! taki żywy eksperyment na zmienionym typie przechowywanej wartości
        else isSoundON = false; // !!! zmieniam zawartośc zmiennej, której wartość wcześniej była testowana
        console.log("ODCZYTANO v0.4 z LS:", soundOption, "treść JEST", isSoundON);
      }
    console.log("ODCZYTANO v0.5 z LS:", soundOption, "treść JEST", isSoundON);
    return isSoundON;
  }

  saveToStorage = ( storageKey, storageValue ) => {
    // dane wejświowe powinny być poprawne (już po weryfikajci długości i zawartości), zatem można je od razu przechować
    localStorage.setItem( storageKey, storageValue );
    console.log("zapisano wartości do LS", storageKey, storageValue);  
  }

  performChatLoginOrWarn = ( nick ) => {
      // jeśli PUSTA WARTOŚĆ lub POZA ZAKRESEM (trudne do wykonania)
    if ( this.isEmptyString( nick ) || ( nick.length < this.nicknameMinLength ) || ( nick.length > this.nicknameMaxLength ) ) { 
      console.log('PUSTA lub BŁĘDNA WARTOŚĆ NICKU');
      this.setState({ 
        isNicknameCorrect: false,
        nickname: nick.substring(0, this.nicknameMaxLength)  // przycinanie nazwy (o ile istnieje) do jakiegoś makskimum, gdyby jakimś trafem przeszło weryfikację
       });
    }
    else { // AKCEPTOWALNA nazwa - ZEZWÓL NA ZALOGOWANIE
      const mySeed = Math.floor( Math.random() * 666666 ) + 1;
      console.log('JEST NICK', nick, ', a Twój szczęśliwy numer to', mySeed);
      this.setState({ 
        authorId: nick,
        nickname: nick,   // dla potrzeb zapamiętania przed i po logowaniem
        isLoggedInUser: true,
        isNicknameCorrect: true,
        localUserId: mySeed   // wylosowany właśnie numer
      });  // przypisanie nazwy z formularza
      this.saveToStorage('chat-nickname', nick);  // zapis w LS, dane są poprawane (jakość i długość nicku)
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
      isLoggedInUser: false, // stan na wylogowany, ale nazwa użytkowika nie jest usuwana z pamięci
      localUserId: 0  // zerowany jest "nr identyfikacyjny" dla rozróżniania własnych postów
    });  // przypisanie nazwy z formularza
  }

  handleClickOnOuterBookmark = () => {
    this.setState({ isChatExpanded: !this.state.isChatExpanded });    // negowanie stanu pokazania okna chatu
  }

  handleEnterOrSpacebarOnOuterBookmark = ( event ) => {
    if ( ( event.keyCode === 13 ) || ( event.keyCode === 32 ) ) { // [Enter] lub [spacja]
      this.setState({ isChatExpanded: !this.state.isChatExpanded });    // negowanie stanu pokazania okna chatu
    }
  }

  handleClickToToggleSound = () => {
    if ( this.state.isSoundUsed ) this.saveToStorage('chat-sound', 'NOT_USED'); // dowolną treść lub brak wartości można podać (też czyścić zmienną)
    if ( !this.state.isSoundUsed ) this.saveToStorage('chat-sound', this.soundUsedString );  // zapisanie do LS wartośc "TAK" - włączono obsługę dźwięku

    this.setState({ isSoundUsed: !this.state.isSoundUsed });    // negowanie stanu używania powiadomień dźwiękowych
  }

  handleClickToRemoveAllMessages = () => {
    this.setState({ messages: [] });  // zerowanie istniejacej zawartości tablicy
  }

  handleClickToToggleInfoContent = () => {
    this.setState({ isInfoContentExpanded: !this.state.isInfoContentExpanded });  // przełączanie pokaż/ukryj obszaru inforamcyjnego
  }

  handleClickToDeleteGivenMessage = ( anyMessage ) => {
    console.log("ZEWNĄTRZNE KLIKNIĘCIE!", anyMessage );

    let messageListWithoutOneElement = this.state.messages.filter( ( messageFromList, index ) => {  // zwróć wszystkie pozostałe elementy poza wskazanym 
        return anyMessage.id !== messageFromList.id;  // porównywanie atrybutów, by przypasować te dla których wartosćoi są inne -- by je zwrócić
      }
    );  // budowanie listy "zaktualizowanych" elementów, z wykluczeniem wskazanego (po atrybucie id wiadaomości czystka, bo indywidualny)

    this.setState({ messages: messageListWithoutOneElement });  // użycie "nowej listy" jako aktualnie obowiązującej
  } // handleClickToDeleteGivenMessage-END

  render() {
    return (
      <section className={ this.state.isChatExpanded ? "wrapper" : "wrapper moved" }>
        <div className="chat">
          <header>
            <h5>Szybki kontakt</h5>

            { this.state.isLoggedInUser && (  // warunkowe wyświetlenie "zalogowanego" i możliwości wylogowania
            <div className="logged-in-info">
              <span>Ty jako <strong>{ this.state.authorId }</strong></span>
              <button className="chat-logout" onClick={ this.handleClickToChatLogout }>Wyjdź</button>
            </div>  
            ) }

          </header>

          <section className="messages">
            { this.state.messages.map( message => (
              <Message key={message.id} message={ message } authorId={ this.state.authorId } localUserId={ this.state.localUserId } 
                onClick={ this.handleClickToDeleteGivenMessage } />

/*               <div key={message.id} className="message">
                <span className="time">{ this.convertTimestampToHMSString( message.timestamp ) } </span>
                {message.authorId}:{' '}
                {message.authorId === this.state.authorId ? (
                <span className="my-post">{message.text}</span>
                ) : (
                    message.text
                  )}
              </div>
 */            ))}
          </section>

          <footer>
            
            <div className="chat-controls">
              { this.state.isInfoContentExpanded && ( // pokaż zawartość gdy PRAWDA
                <div className="info-content" onClick={ this.handleClickToToggleInfoContent } >
                  <h5>Legenda</h5>
                  <div>
                    <img src={ trashcan16x16 } alt="usuwanie" title="skasuj wiadomości" /> &ndash; usuwa wszystkie wiadomości
                  </div>
                  <div>
                    <img src={ alarm16x16_on  } alt="z dźwiękiem" title="włącz dźwięk powiadomienia" /> &ndash; włącza dźwięk przy nowej wiadomości
                  </div>
                  <div>
                    <img src={ alarm16x16_off  } alt="bez dźwięku" title="wyłącz dźwięk powiadomienia" /> &ndash; wyłącza dźwięk powiadomienia
                  </div>
                  <hr />
                  <p>Przeglądarka zachowuje ostatnio użytą nazwę użytkownika i ustawienia dźwięku.</p>
                  <hr />
                  <p>Możesz edytować wiadomości utworzone przez siebie w danej sesji czatowania.</p>
                </div>
              )}
              <button className= "icon-btn delete-all-messages" title="Usuń wszystkie wyświetlone wiadomości"
                onClick={ this.handleClickToRemoveAllMessages }>
                <img src={ trashcan16x16 } alt="usuń wszystkie wiadomości" />
              </button>
              <button className= "icon-btn sound-toggle" title={`Powiadomienie dźwiękowe jest ${ this.state.isSoundUsed ? "WŁĄCZONE" : "WYŁĄCZONE" }` }
                onClick={ this.handleClickToToggleSound }>
                <img src={ this.state.isSoundUsed ? alarm16x16_off : alarm16x16_on  } alt="dźwięk włączony / bez dźwieku" /> {/* warunkowo budowan treść etykieta - określa stan BIEŻĄCY */}
                </button>
              <button className= "icon-btn more-info" title="Dodatkowe informacje, objaśnienia, legenda" onClick={ this.handleClickToToggleInfoContent } >
                <img src={ info16x16dark } alt="dodatkowe informacje" />
              </button>
            </div>

            { !this.state.isLoggedInUser && ( // wariant FALSE - warunkowe wyświetlanie dla NIEZALOGOWANEGO UŻYTKOWNIKA
            <div className="nick-selection">
              <p className="nick-info">Podaj swoje imię lub pseudonim aby pisać wiadomości. Obowiązkowo.</p>
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
            <div className="message-sending">
              <textarea className="textarea" ref="textarea" wrap="soft" maxLength={ this.messageMaxLength } placeholder="Zapytaj o ofertę... &#13;&#10;&#13;&#10;(szybka wysyłka: [Shift] + [Enter])"
                onKeyUp={ this.handleEnterPress } />
              <button onClick={ this.sendMessage } className="send-button">Wyślij</button>
            </div>
            )}

          </footer>

        </div>
        <div className="outer-bookmark" tabIndex="0" onKeyUp={ this.handleEnterOrSpacebarOnOuterBookmark } onClick={ this.handleClickOnOuterBookmark }>
            { this.state.isChatExpanded ? "Zwiń" : "Rozwiń" } czat
        </div>
      </section>
    );
  } // render-END

}

export { Chat };
