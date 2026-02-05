import { Link, NavLink, useNavigate } from 'react-router-dom'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { LuUserRound, LuUserRoundCheck } from "react-icons/lu";
import { FaTruckArrowRight } from "react-icons/fa6";
import { FaOpencart } from "react-icons/fa6";
import { useState } from 'react';
import LoadingPopup from './assets/LoadingPopup';
import axios from 'axios';

const NavBar = ({ cart, API_URL, details, token }) => {

  const [showLinks, setShowLinks] = useState(false)
  const [popup, setPopup] = useState(false)

  let cartQuantity = 0
  function updateCart() {
    cart.forEach((item) => {
      cartQuantity += item.quantity
    });
  }
  updateCart();
  function searchBarActive() {
    const searchBar = document.querySelector('#search-text').value.toUpperCase();
    const allProducts = document.querySelector('.js-all-products');
    const productContainer = document.querySelectorAll('#product');
    const productName = allProducts.getElementsByTagName('h3')

    for (let i = 0; i < productName.length; i++) {
      let ProductMatch = productContainer[i].getElementsByTagName('h3')[0];

      if (ProductMatch) {
        let textValue = ProductMatch.textContent || ProductMatch.innerHTML;
        let searchValue = textValue.toUpperCase().indexOf(searchBar);
        if (searchValue > -1) {
          productContainer[i].style.display = '';
        } else {
          productContainer[i].style.display = 'none';
        }
      }
    }
  }

  const navigate = useNavigate()

  return (
    <div className="navbar">
      <NavLink to="/" className="logo-link"><img src="/images/zurum-stores-high-resolution-logo-transparent.png" alt="Zurum-logo" />
      </NavLink>
      <div className="search">
        <input type="text" placeholder="Search" id="search-text" onKeyUp={() => {
          searchBarActive()
        }} />

      </div>

      <div className="users" style={showLinks ? {background: '#ccc'} : {background: 'transparent'}} onClick={()=>{
        showLinks ? setShowLinks(false) : setShowLinks(true)
      }}>
        {details.username || details.email ? <LuUserRoundCheck className='user-icon' /> : <LuUserRound className='user-icon' />}

        <div id={showLinks ? 'users-links' : 'users-links-off'}>
          <a href="/user-details">My Account</a>
          <a href="/orders">My Orders</a>
          {details.username || details.email ? <button onClick={() => {
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
                    window.location.reload()
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
                  }
                }

              }
            }}>Logout</button> : <button  onClick={
        () => {
            navigate('/users')
        }
      }>SignIn</button>}
        </div>

        <div className="user-details">
          <p>Hey, {details.firstname ? details.firstname : 'user'}</p>
        </div>

        {!showLinks && <MdKeyboardArrowDown className='drop-icon' />}
        {showLinks && <MdKeyboardArrowUp className='drop-icon' />}
      </div>


      <div id="cart-icon">
        <NavLink to="/cart">
          <FaOpencart className='cart-icons' />
          <div className="cart-quantity js-cart-quantity" style={{ color: '#502501' }}>{cartQuantity}
          </div>
          <div className="ptag">
            <p>Cart</p>
          </div>
        </NavLink>
      </div>

      {popup && <LoadingPopup />}
    </div>
  )
}

export default NavBar