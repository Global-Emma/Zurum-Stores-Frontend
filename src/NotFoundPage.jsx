import React from 'react'

const NotFoundPage = () => {
  return (
    <div>
      <div id='msg-body'>
        <h1 id="msg-txt">404 - Page Not Found</h1>
        <button id='msg-btn' onClick={() => window.location.href = '/'}>Return To Home Page</button>
      </div>
    </div>
  )
}

export default NotFoundPage