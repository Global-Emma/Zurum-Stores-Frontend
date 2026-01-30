import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaUser, FaUserCheck } from "react-icons/fa"

const NavBar = ({ cart, logIn, details }) => {

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

  let userDetails = {
    flexGrow: '1',
    width: '20px',
    zIndex: '5',
    alignSelf: 'flex-end',
    display: 'flex'
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
        <div className="img-div" onClick={() => {
          searchBarActive()
        }}>
          <img src="/images/icons/search-icon.png" alt="" />
        </div>
      </div>


      <div className="users" onClick={
        () => {
          if (!details.username) {
            navigate('/users')
          } else {
            navigate('/user-details')
          }
        }
      }>

        {details.username ? <FaUserCheck className='user-icons' /> : <FaUser className='user-icons' />}

        {logIn && <div className="user-details" style={userDetails}>
          <p>Hey, <span>{details.username ? details.username : 'user'}</span></p>
        </div>}
      </div>



      <div className="returns">
        <NavLink to="/orders">
          <p>Returns</p>
          <span>& Orders</span>
        </NavLink>
      </div>
      <div className="cart-icon">
        <NavLink to="/cart">
          <img src="/images/icons/cart-icon.png" alt="" />
          <div className="cart-quantity js-cart-quantity" style={{ color: '#502501' }}>{cartQuantity}</div>
          <div className="ptag">
            <p>Cart</p>
          </div>
        </NavLink>
      </div>
    </div>
  )
}

export default NavBar