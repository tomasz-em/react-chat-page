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

    this.state = {
      authorId: 'Wojtek eM',
      isChatDisplayed: true,
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
  };

  handleEnterPress = event => {
    if ( ( event.keyCode === 13 ) && ( event.shiftKey) ) {
      this.sendMessage();
    }
  };

  clickHandleClickOnOuter = () => {
    this.setState({ isChatDisplayed: !this.state.isChatDisplayed });    // negowanie stanu pokazania okna chatu
  }

  render() {
    return (
      <section className={ this.state.isChatDisplayed ? "wrapper" : "wrapper moved" }>
        <div className="chat">
          <header>
            <p>
              Szybki kontakt <span>(Ty jako <strong>{ this.state.authorId }</strong>)</span>
              <button>Wyjdź</button>
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
            <div className="chat-controls">
              <textarea className="textarea" ref="textarea" wrap="soft" maxLength="100" placeholder="Zapytaj o ofertę...  (szybka wysyłka: [Shift] + [Enter])"
                onKeyUp={this.handleEnterPress} />
              <button onClick={this.sendMessage} className="send-button">Wyślij</button>
            </div>

          </footer>

        </div>
        <div className="outer-bookmark" onClick={this.clickHandleClickOnOuter}>
            { this.state.isChatDisplayed ? "Zwiń" : "Rozwiń" } czat
        </div>
      </section>
    );
  }
}

export { Chat };
