import React from 'react';

import './Message.scss';

const Message = ( props ) => { // ({ message, authorId })

  let { message, authorId, localUserId } = props;  // destrukturyzacja teraz, zamiast w atrybutach funkcji - potzrebny dostęp do "props"

  function convertTimestampToHMSString ( timestamp ) {
    const convertedTime = new Date( timestamp ); // tu to "prawdziwy" timestamp, czyli wyrażony w milisekundach (nie trzeba mnożyć przez 1k)
    // po prostu czas z dopełenieniem zerowym elementów (jak w lokalnych ustawieniach komputera/przeglądarki) 
    // zawsze dodaje zero przed "tekstem czasu", by potem dwa ostatnie znaki napisu tylko wyświetlić
    return ( "0" + convertedTime.getHours() ).substr(-2) + ':' + ( "0" + convertedTime.getMinutes() ).substr(-2) + ':' + ( "0" + convertedTime.getSeconds() ).substr(-2);
  }

  let handleClickOnX = (event) => { // lokalna obsług akliknięcia.. ale wywoła metodę z komponentu rodzica dla wszanych parametrów wywołania
    if ( props.onClick ) {
      // console.log("ZDARZENIE_CLICK_MESSAGE", event);
      props.onClick( message ); // wyślij zwrotnie obiekt konkretnej wiadomości (cztery atrybuty)
    }
   }

   let handleClickToEditMessage = (event) => {
     // onEdit={ this.handleClickToPrepareMessageEditing }
    if ( props.onEdit && message.localUserId === localUserId ) { // WERYFIKACJA, CZY TO WIADOMOŚĆ W SESJI TEGO SAMEGO UŻYTKOWNIKA
      // console.log("ZDARZENIE_CLICK_EDIT_MESSAGE", event);
      props.onEdit( message.id ); // wyślij zwrotnie wartość atrybutu dla tego obiektu wyrenderowanej wiadomości
    }
    
   }

  return (
    <article className="message" >
      <section>
        <div className="delete-me" title="Usuń wiadomość" onClick={ handleClickOnX } >
            &times;
        </div>
        <div className={ ( message.authorId === authorId ) && ( message.localUserId === localUserId ) ? "message-container my-message" : "message-container" } >
          <p className="author">
            <strong>{ message.authorId }</strong> o&nbsp;
            <strong className="time">{ convertTimestampToHMSString( message.timestamp ) }</strong>
          </p>
          <p className={ ( message.authorId === authorId ) && ( message.localUserId === localUserId ) ? "my-post-text" : "" } >
            { message.text }
            { ( message.authorId === authorId ) && ( message.localUserId === localUserId ) && (
              <button className="edit" onClick={ handleClickToEditMessage }>Edytuj</button>
            )}
          </p>
        </div>
      </section>
    </article>
  )
} // Message-END

export { Message };
