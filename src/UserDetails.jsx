import React from 'react'
import NavBar from './NavBar'
import { NavLink, useNavigate } from 'react-router'
import axios from 'axios'
import { FaUser, FaUserCheck } from "react-icons/fa"
import { useEffect } from 'react'
import LoadingScreen from './assets/LoadingScreen'
import { useState } from 'react'
import LoadingPopup from './assets/LoadingPopup'


const UserDetails = ({ loadUserData, details, token, login, address, API_URL, error }) => {

  const [isLoading, setIsLoading] = useState(true)
  const [popup, setPopup] = useState(false)
  const [user, setUser] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
    try {
      const load = async () => {
        await loadUserData()
      }
      load()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [loadUserData])

  const [detailsData, setDetailsData] = useState({
    firstname: details.firstname ? details.firstname : '',
    lastname: details.lastname ? details.lastname : '',
    phone: details.phone ? details.phone : '',
    username: details.username ? details.username : '',
    email: details.email ? details.email : '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetailsData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      await axios.put(`${API_URL}/users/update-user`, detailsData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })
      await loadUserData();
      setIsLoading(false)
      alert('User Details Updated Successfully')
      setUser(true)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          setIsLoading(false)
          setErrorMsg(error.response.data.message)
        }
      }
    }
  };

  if (isLoading) return <LoadingScreen />
  if (error) {
    return <h2>Some Error Occured...Please Check Your Internet connection and Try Again</h2>
  }
  if (login === false) {
    return (
      <>
        <h2>Please Login To Load this Page</h2>
        <NavLink to={'/users'}>LoginPage</NavLink>
      </>
    )
  }
  return (
    <>
      <NavLink to="/" id="logo"><img src="images/zurum-stores-high-resolution-logo-transparent.png" alt="Zurum-logo" />
      </NavLink>
      {/* Body */}
      <div className="details-body">
        <div className="details-left">
          <div className="orders-link links" onClick={() => { window.location.href = '/orders' }}>
            My Orders
          </div>
          <div className="cart-link links" onClick={() => { window.location.href = '/cart' }}>
            My Cart
          </div>
          <div className="edit-user links" onClick={() => {
            setUser(false)
          }}>
            Edit Profile
          </div>
          <div className="change-password links" onClick={() => {
            navigate('/change-password')
          }}>
            Change Password
          </div>

        </div>

        {user && (
          <div className="details-right">
            <h2>Account Details</h2>
            <div className="user-image">
              <FaUser className='user-icons' />
            </div>
            <div className="user-name">
              <p style={{ alignSelf: 'center' }}>{details.firstname ? `Hi, ${details.lastname} ${details.firstname}` : `Hi, ${details.username}`}</p>
              <pre><b>Username:</b><br /> {details.username}</pre>
              <pre><b>email:</b><br /> {details.email}</pre>
              <pre><b>Phone No:</b><br /> {details.phone}</pre>
              <pre><b>Address:</b><br /> {details.address ? `${address.street}, ${address.city}, ${address.state}, ${address.country}` : <NavLink to={'/address'}>No Address Added...Click Here To Add</NavLink>}</pre>
            </div>
            <button className="logout-btn" onClick={() => {
              setPopup(true)
              try {
                axios.post(`${API_URL}/users/logout`, {},
                  {
                    headers: {
                      Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                  },

                ).then((response) => {
                  if (response.data.message === 'User Logged Out Successfully') {
                    localStorage.removeItem('token');
                    localStorage.setItem('isLoggedIn', JSON.stringify(false))
                    setPopup(false)
                    alert('User Logged Out Successfully')
                    window.location.href = '/users'
                  }
                })
              } catch (error) {
                if (axios.isAxiosError(error)) {
                  localStorage.removeItem('token');
                  localStorage.setItem('isLoggedIn', JSON.stringify(false))
                  if (error.response?.data?.message) {
                    setErrorMsg(error.response.data.message)
                    setPopup(false)
                    alert(errorMsg)
                    window.location.href = '/users'
                  }
                }

              }
            }}>logout</button>
          </div>
        )}

        {!user && (
          <div className="details-right">
            <h2>Edit Account Details</h2>
            <form action="" className='address-form' style={{ overflow: 'auto' }} onSubmit={handleSubmit}>
              {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
              <label htmlFor="firstname">Enter Firstname</label>
              <input type="text" name="firstname" value={detailsData.firstname} placeholder="Firstname" onChange={handleChange} required id='firstname' /><br />
              <label htmlFor="lastname">Enter Lastname</label>
              <input type="text" name="lastname" value={detailsData.lastname} placeholder="Lastname" onChange={handleChange} required id='lastname' /><br />
              <label htmlFor="phone">Enter Phone Number</label>
              <input type="number" name="phone" value={detailsData.phone} placeholder="Phone Number" onChange={handleChange} required id='phone' /><br />
              <label htmlFor="username">Enter Username</label>
              <input type="text" name="username" value={detailsData.username} placeholder="Username" onChange={handleChange} required id='username' /><br />
              <label htmlFor="email">Enter Email</label>
              <input type="email" name="email" value={detailsData.email} placeholder="email" onChange={handleChange} required id='email' /><br />

              <button type="submit" className="user-btn">Save Changes</button>
            </form>
          </div>
        )}
      </div>

      {popup && <LoadingPopup />}
    </>
  )
}

export default UserDetails