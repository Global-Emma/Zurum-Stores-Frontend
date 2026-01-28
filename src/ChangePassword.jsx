import axios from 'axios'
import React, { useState } from 'react'
import LoadingPopup from './assets/LoadingPopup'

const ChangePassword = ({ API_URL, token }) => {

  const [popup, setPopup] = useState(false)
  const [input, setInput] = useState({})
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInput({ ...input, [name]: value })

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setPopup(true)
      const response = await axios.post(`${API_URL}/users/change-password`, {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      alert(response?.data?.message)
      window.location.href = "/user-details"
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          setPopup(false)
          setErrorMsg(error.response.data.message)
        }
      }
    } finally {
      setPopup(false)
    }
  }
  return (
    <>
      <div className="user-sign-in">
        <form action="" method="post" className="sign-in-form" onSubmit={handleSubmit}>

          {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
          <label htmlFor="username">Current Password</label>
          <input type="text" name="currentPassword" placeholder="Current Password" value={input.currentPassword} required id='user-name' onChange={handleChange} />
          <label htmlFor="password">New Password</label>
          <input type="text" name="newPassword" placeholder="New Password" value={input.newPassword} required id='pass-word' onChange={handleChange} />
          <button type="submit" className="user-btn">Change Password</button>
        </form>
      </div>

      {popup && <LoadingPopup />}
    </>
  )
}

export default ChangePassword