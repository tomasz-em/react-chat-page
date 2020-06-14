import React, { useEffect, useRef, useState } from 'react';
import * as io from 'socket.io-client';
import './App.css';

const App = () => {
  // w celu uzycia wartosci w useEffect musze skorzystac z referencji tworzonej przez useRef
  const connectionRef = useRef();
  const messagesRef = useRef([]);

  // stan aplikacji
  const [myMessage, setMyMessage] = useState('');
  const [messages, setMessages] = useState(messagesRef.current);

  useEffect(() => {
    // sprawdzam czy polaczenie zostalo juz nawiazane
    if (connectionRef.current === undefined) {
      // nawiazuje polaczenie
      connectionRef.current = io.connect('https://chat-server.fbg.pl');

      // nasluchuje na wiadomosci od serwera
      connectionRef.current.on('chat message', (message) => {
        // aktualizuje referencje do tablicy wiadomosci
        // ta aktualizacja nie wplynie na proces renderingu
        // musze recznie zaktualizowac stan, zeby powiedziec react'owi ze ma sie przerenderowac
        messagesRef.current = [...messagesRef.current, message];

        // aktualizuje stan zeby przerenderowac widok
        setMessages(messagesRef.current);
      });
    }
  }, []);

  const handleMessageChange = (event) => {
    setMyMessage(event.target.value);
  };

  const handleSend = () => {
    connectionRef.current.emit('chat message', {
      text: myMessage,
      authorId: 'Wojtek',
    });
  };

  return (
    <div>
      <div>
        <input onChange={handleMessageChange} value={myMessage} />
        <button onClick={handleSend}>send</button>
      </div>
      <ul>
        {messages.map((el, index) => (
          <li key={index}>
            <b>{el.authorId}:</b> {el.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
