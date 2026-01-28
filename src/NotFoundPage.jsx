import React from 'react'

const NotFoundPage = () => {
  return (
    <div><div className='not-found-page'>
      <h1>404 - Page Not Found</h1> 
      <button onClick={() => window.location.href = '/'}>Return To Home Page</button>
      </div></div>
  )
}

export default NotFoundPage