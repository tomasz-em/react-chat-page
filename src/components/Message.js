import React from 'react';

import './Message.scss';

function Message({ message, authorId }) {

  function convertTimestampToHMSString ( timestamp ) {
    const convertedDate = new Date( timestamp ); // tu to "prawdziwy" timestamp, czyli wyrażony w milisekundach (nie trzeba mnożyć przez 1k)
    // return convertedDate.toUTCString() + " " + convertedDate.toLocaleString();  // po prostu godzina z dopełenieniem zerowym (jak w lokalnych ustawieniach komputera/przeglądarki) 
    // zawsze dodaje zero przed "tekstem czasu", by potem dwa ostatnie znaki napisu tylko wyświetlić
    return convertedDate.getHours() + ':' + ( "0" + convertedDate.getMinutes() ).substr(-2) + ':' + ( "0" + convertedDate.getSeconds() ).substr(-2);
  }

  return (
    <div className="message">
      <span className="time">{ convertTimestampToHMSString( message.timestamp ) } </span>
      {message.authorId}:{' '}
      {message.authorId === authorId ? (
      <span className="my-post">{message.text}</span>
      ) : (
          message.text
      )}
    </div>

  )
} // MEssages-END

export { Message };

{/* <form>
<BookTitle onTitleChange={handleTitleChange} title={title} />
</form>
 */}