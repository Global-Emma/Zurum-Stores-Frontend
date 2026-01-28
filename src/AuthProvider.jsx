/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()
const AuthProvider = ({children}) => {
  const [accessToken, setAccessToken] = useState('')
  const [role, setRole] = useState('')
  const [isLogIn, setIsLogIn] = useState(false)

  const loggingIn = ({token, role})=>{
    setAccessToken(token)
    setRole(role)
    setIsLogIn(true)
  }

  const loggingOut = ()=>{
    setAccessToken('')
    setRole('')
    setIsLogIn(false)
  }

  
  useEffect(()=>{
    console.log(accessToken)
    console.log(role)
    console.log(isLogIn)
  }, [role, accessToken, isLogIn])

  return (
    <AuthContext.Provider value={{accessToken, role, isLogIn, loggingIn, loggingOut}}>
      {children}
    </AuthContext.Provider>
  )
}
const useAuth = ()=>{
  return useContext(AuthContext)
}

export { AuthProvider, useAuth }