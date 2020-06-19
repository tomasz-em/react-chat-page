import React from 'react';

import './Message.scss';

const Message = ( props ) => { // ({ message, authorId })

  function convertTimestampToHMSString ( timestamp ) {
    const convertedDate = new Date( timestamp ); // tu to "prawdziwy" timestamp, czyli wyrażony w milisekundach (nie trzeba mnożyć przez 1k)
    // return convertedDate.toUTCString() + " " + convertedDate.toLocaleString();  // po prostu godzina z dopełenieniem zerowym (jak w lokalnych ustawieniach komputera/przeglądarki) 
    // zawsze dodaje zero przed "tekstem czasu", by potem dwa ostatnie znaki napisu tylko wyświetlić
    return ( "0" + convertedDate.getHours() ).substr(-2) + ':' + ( "0" + convertedDate.getMinutes() ).substr(-2) + ':' + ( "0" + convertedDate.getSeconds() ).substr(-2);
  }

  let handleClickOnX = (event) => { // lokalna obsług akliknięcia.. ale wywoła metodę z komponentu rodzica dla wszanych parametrów wywołania
    if ( props.onClick ) {
      console.log("ZDARZENIE_CLICK_MESSAGE", event);
      props.onClick( props.message ); // wyślij zwrotnie obiekt konkretnej wiadomości (cztery atrybuty)
    }
   }

  return (
    <div className={ props.message.authorId === props.authorId ? "message my-message" : "message" }>
      <span className="delete-me" title="Usuń wiadomość" onClick={ handleClickOnX } >&times;</span>
      <span className="time">{ convertTimestampToHMSString( props.message.timestamp ) } </span>
      { props.message.authorId }:{' '}
      { props.message.authorId === props.authorId ? (
      <span className="my-post-text">{ props.message.text }</span>
      ) : (
          props.message.text
      )}
    </div>

  )
} // MEssages-END

export { Message };

{/* <form>
<BookTitle onTitleChange={handleTitleChange} title={title} />
</form>
 */}