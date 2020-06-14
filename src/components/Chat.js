import React from 'react';
import * as io from 'socket.io-client';

import './Chat.scss';

class Chat extends React.Component {
  socket = null;

  constructor() {
    super();

    this.chatServerUrl = 'https://socket-chat-server-zbqlbrimfj.now.sh';   // możliwy do użycia też 'https://chat-server.fbg.pl' 

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
    if (event.keyCode === 13) {
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
          <header>Contact us!</header>
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
            <textarea
              ref="textarea"
              className="textarea"
              onKeyUp={this.handleEnterPress}
              placeholder="Type a message here and press enter..."
            />
            <button onClick={this.sendMessage} className="button">Send</button>
          </footer>

        </div>
        <div className="outer-click" onClick={this.clickHandleClickOnOuter}>
            { this.state.isChatDisplayed ? "Ukryj" : "Pokaż" } czat
        </div>
      </section>
    );
  }
}

export { Chat };
