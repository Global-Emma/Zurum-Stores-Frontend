import { Routes, Route } from 'react-router-dom';
import './orders.css'
import './App.css'
import './cart.css'
import './users.css'
import './userDetails.css'
import './admin-pages/admin.css'
import './address.css'
import Cart from './Cart'
import HomePage from './homePage'
import { useState, useEffect, useCallback } from 'react'
import Orders from './Orders'
import axios from 'axios';
import Users from './Users';
import UserDetails from './UserDetails';
import Admin from './admin-pages/Admin';
import LoadingScreen from './assets/LoadingScreen';
import Payment from './assets/Payment';
import NotFoundPage from './NotFoundPage';
import AddressPage from './Address';
import GoogleSuccess from './GoogleSuccess';
import ChangePassword from './ChangePassword';

function App() {
  const token = JSON.parse(localStorage.getItem('token'))
  let isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false
  const API_URL = import.meta.env.VITE_API_URL;
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [cart, setCart] = useState([])
  const [details, setDetails] = useState({})
  const [returns, setReturns] = useState([])
  const [address, setAddress] = useState({});

  const getUserData = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/users/get-user-details`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })
      setCart(response.data.data.cartIds);
      setReturns(response.data.data.orderIds)
      setAddress(response.data.data.address)
      setDetails(response.data.data)
      setErrorMsg('')
    } catch (error) {
      if(axios.isAxiosError(error)){
        if(error.response?.data?.message){
          setIsLoading(false)
          setErrorMsg(error.response.data.message)
        }
      }

    } finally {
      setIsLoading(false)
    }
  }, [token, API_URL]);

  const [deliveryOptions, setDeliveryOptions] = useState([]);

  // Fetch delivery options from the backend API
  const fetchDeliveryOptions = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/delivery/all-delivery-options`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      setDeliveryOptions(response.data.data);
    } catch (error) {
      console.error('Error fetching delivery options:', error);
    } finally {
      setIsLoading(false)
    }
  }, [token, API_URL]);


  useEffect(() => {
    getUserData();
    fetchDeliveryOptions();
  }, [getUserData, fetchDeliveryOptions]);


  if (isLoading) return <LoadingScreen />

  return (
    <Routes>
      <Route path='/' element={<HomePage cart={cart} error={errorMsg} API_URL={API_URL} loadUserData={getUserData} details={details} token={token} login={isLoggedIn} />} />

      <Route path='/cart' element={<Cart address={address} API_URL={API_URL} cart={cart} details={details} loadUserData={getUserData} deliveryOptions={deliveryOptions} error={errorMsg} loadDelivery={fetchDeliveryOptions} orders={returns} token={token} />} />

      <Route path='/orders' element={<Orders cart={cart} API_URL={API_URL} details={details} loadUserData={getUserData} deliveryOptions={deliveryOptions} loadDelivery={fetchDeliveryOptions} error={errorMsg} token={token} returns={returns} login={isLoggedIn} />} />

      <Route path='/users' element={<Users cart={cart} API_URL={API_URL} error={errorMsg} token={token} details={details} login={isLoggedIn} />} />

      <Route path='/user-details' element={<UserDetails API_URL={API_URL} error={errorMsg} details={details} address={address} cart={cart} token={token} login={isLoggedIn} loadUserData={getUserData} />} />

      <Route path='/admin' element={<Admin API_URL={API_URL} deliveryOptions={deliveryOptions} token={token} />} />

      <Route path='/google-success' element={<GoogleSuccess />} />

      <Route path='/address' element={<AddressPage API_URL={API_URL} details={details} cart={cart} deliveryOptions={deliveryOptions} token={token} login={isLoggedIn} loadUserData={getUserData} />} />

      <Route path='/change-password' element={<ChangePassword token={token} API_URL={API_URL} />} />

      <Route path='*' element={<NotFoundPage />} />

      <Route path='/payment-success' element={<div className='payment-success-page'><h1>Payment Successful!</h1><p>Thank you for your purchase. Your payment has been processed successfully.</p><button onClick={() => window.location.href = '/orders'}>View Your Orders</button></div>} />

      <Route path='/payment-failure' element={<div className='payment-failure-page'><h1>Payment Failed</h1><p>Unfortunately, your payment could not be processed. Please try again.</p><button onClick={() => window.location.href = '/cart'}>Return to Cart</button></div>} />

      <Route path='/verify-payment' element={<Payment token={token} API_URL={API_URL} loadUserData={getUserData} />} />
    </Routes>

  )
}

export default App
