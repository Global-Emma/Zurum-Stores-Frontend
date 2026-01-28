// import { useNavigate } from 'react-router'
import NavBar from './NavBar'
import axios from 'axios';
import { useState } from 'react';
import LoadingScreen from './assets/LoadingScreen';
import { NavLink } from 'react-router';
import LoadingPopup from './assets/LoadingPopup';


const Users = ({ API_URL }) => {

  const [refresh, setRefresh] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [popup, setPopup] = useState(false)

  const handleSignInSubmit = async (event) => {
    event.preventDefault()
    let username = document.querySelector('#user-name').value
    let password = document.querySelector('#pass-word').value
    setIsLoading(true)
    try {
      const response = await axios.post(`${API_URL}/users/sign-in`, {
        username,
        password
      })
      const token = response.data.accessToken
      if (token) {
        localStorage.setItem('token', JSON.stringify(token))
        localStorage.setItem('isLoggedIn', JSON.stringify(true))
      }
      if (response.data.userDetails.role === "admin") {
        setIsLoading(false)
        alert('Welcome Back Admin')
        return window.location.href = '/admin'
      }
      if (response.data.message === 'User Signed In SuccessFully') {
        localStorage.setItem('isLoggedIn', JSON.stringify(true))
        setIsLoading(false)
        alert(`Welcome Back, ${response.data.userDetails.username}`)
        setRefresh(refresh + 1)
        window.location.href = '/'
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          setIsLoading(false)
          setErrorMsg(error.response.data.message)
        }
      }
    }
    document.querySelector('#user-name').value = ''
    document.querySelector('#pass-word').value = ''
  }

  const handleSignUpSubmit = async (event) => {
    event.preventDefault()
    let username = document.querySelector('#username').value
    let email = document.querySelector('#email').value
    let password = document.querySelector('#password').value
    let firstname = document.querySelector('#firstname').value
    let lastname = document.querySelector('#lastname').value
    let phone = document.querySelector('#phone').value
    console.log(username, password, email)
    setIsLoading(true)
    try {
      const response = await axios.post(`${API_URL}/users/sign-up`, {
        firstname,
        lastname,
        phone,
        username,
        email,
        password
      })
      if (response.data.message === 'New User Signed Up SuccessFully') {
        setIsLoading(false)
        alert('User Registration Successful...Please Login To Continue')
        document.querySelector('.sign-up-form').style.display = "none";
        document.querySelector('.sign-in-form').style.display = "flex";
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          setIsLoading(false)
          setErrorMsg(error.response.data.message)
        }
      }
      document.querySelector('#username').value = ''
      document.querySelector('#email').value = ''
      document.querySelector('#password').value = ''
    }
  }

  if (isLoading) return <LoadingScreen />
  return (
    <>

      <NavLink to="/" id="logo"><img src="images/zurum-stores-high-resolution-logo-transparent.png" alt="Zurum-logo" />
      </NavLink>

      <div className="user-sign-in">
        {/* user Login */}
        <form action="" method="post" className="sign-in-form" onSubmit={handleSignInSubmit}>

          <button id='google-btn' onClick={
            () => {
              setPopup(true)
              window.location.href = `${API_URL}/users/google-login`;
            }
          } >
            <img src="https://cdn.brandfetch.io/domain/google.com?c=1idk8KN1acSgJG8iGOF" alt="Logo by Brandfetch" style={{ width: "20px", marginRight: "10px" }} />
            Sign in with Google
          </button>
          {errorMsg && <p style={{color: 'red'}}>{errorMsg}</p>}
          <label htmlFor="username">Enter Username</label>
          <input type="text" name="username" placeholder="username" required id='user-name' />
          <label htmlFor="password">Enter Password</label>
          <input type="text" name="password" placeholder="password" required id='pass-word' />
          <NavLink to="/">
            <p style={{ color: 'blue' }}>forgot password?</p>
          </NavLink>
          <button type="submit" className="user-btn">Log-In</button>
          <p>Don't Have an Account? <span onClick={
            () => {
              document.querySelector('.sign-up-form').style.display = "flex";
              document.querySelector('.sign-in-form').style.display = "none";
            }
          }>Sign-Up</span></p>
        </form>

        {/* user Registration */}
        <form className="sign-up-form" onSubmit={handleSignUpSubmit}>
          <label htmlFor="firstname">Enter Firstname</label>
          <input type="text" name="firstname" placeholder="Firstname" required id='firstname' /><br />
          <label htmlFor="lastname">Enter Lastname</label>
          <input type="text" name="lastname" placeholder="Lastname" required id='lastname' /><br />
          <label htmlFor="phone">Enter Phone Number</label>
          <input type="number" name="phone" placeholder="Phone Number" required id='phone' /><br />
          <label htmlFor="username">Enter Username</label>
          <input type="text" name="username" placeholder="Username" required id='username' /><br />
          <label htmlFor="email">Enter Email</label>
          <input type="email" name="username" placeholder="email" required id='email' /><br />
          <label htmlFor="password">Enter Password</label>
          <input type="text" name="password" placeholder="password" required id='password' /><br />
          <button type="submit" className="user-btn">Register</button>
          <p>Already Have an Account? <span onClick={
            () => {
              document.querySelector('.sign-up-form').style.display = "none";
              document.querySelector('.sign-in-form').style.display = "flex";
            }
          }>Sign-In</span></p>
        </form>
      </div>
          {popup && <LoadingPopup />}
    </>


  )
}

export default Users