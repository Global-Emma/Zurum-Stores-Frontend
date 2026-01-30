import { useEffect, useState } from "react"
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import axios from "axios";
import LoadingScreen from "./assets/LoadingScreen";
import { useNavigate } from "react-router";
import LoadingPopup from "./assets/LoadingPopup";


const Cart = ({ cart, loadUserData, deliveryOptions, token, loadDelivery, details, address, error, API_URL }) => {

  const [cartUpdate, setCartUpdate] = useState(0);
  const [isLoading, setIsLoading] = useState(true)
  const [popup, setPopup] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  document.title = 'Checkout Page'

  const navigate = useNavigate();
  useEffect(() => {
    const load = async () => {
      try {
        await loadUserData();
        await loadDelivery();
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [loadUserData, loadDelivery])

  if (errorMsg) {
    setTimeout(() => {
      setErrorMsg('')
    }, 5000)
    return <h2>{errorMsg}</h2>
  }

  let cartQuantity = 0
  cart.forEach((item) => {
    cartQuantity += item.quantity
  });

  let productPrice = 0;
  let deliveryPrice = 0;

  if (isLoading) return <LoadingScreen />

  if (error) {
    return <h2>Some Error Occured...Please Check Your Internet connection and Try Again</h2>
  }

  return (
    <>
      <nav className="nav-bar-cart">
        <div className="logo-img">
          <a href="/"><img src="images/zurum-stores-high-resolution-logo-transparent.png" alt="" className="full" /></a>
        </div>
        <div className="item-no">
          Checkout (<a href="/" className="js-quantity-link">{cartQuantity} Items</a>)
        </div>

        <div className="lock-img">
          <img src="images/icons/checkout-lock-icon.png" alt="" />
        </div>

      </nav>

      <div className="review">
        <p>Review Your Order</p>
      </div>
      <div className="order-sum-container">
        <div className="order-container js-order-container">

          {/* order 1  */}

          {cart.map((item) => {
            const product = item.productId;
            const selectedDeliveryOption = deliveryOptions.find((option) => {
              return option.id === item.deliveryOptionsId
            })

            productPrice += product.priceCents * item.quantity;
            deliveryPrice += selectedDeliveryOption.priceCents;
            return (
              <div className="order" key={product._id}>
                <div className="date">
                  Delivery Date: {dayjs().add(selectedDeliveryOption.deliveryDuration, 'days').format('dddd, MMMM D')}
                </div>
                <div className="order-body">
                  <div className="order-img">
                    <img src={product.image} alt="" />
                  </div>
                  <div className="order-details">
                    <div className="lower-sec">
                      <p className="name">{product.name}</p>
                      <p className="price">${((product.priceCents) / 100).toFixed(2)}</p>
                      <p className="quantity">Quantity: <span style={{ color: '#034188' }}>{item.quantity}</span></p>
                      <button className="delete-btn" onClick={
                        async () => {
                          setPopup(true)
                          try {
                            await axios.delete(`${API_URL}/cart/delete-cart-item/${item._id}`, {
                              headers: {
                                Authorization: `Bearer ${token}`
                              },
                              withCredentials: true
                            })
                            await loadUserData()
                            setCartUpdate(cartUpdate + 1)
                          } catch (error) {
                            if (axios.isAxiosError(error)) {
                              if (error.response?.data?.message === 'JWT Expired') {
                                setErrorMsg("User Logged Out...Please Login Again")
                                setPopup(false)
                              } else {
                                setErrorMsg(error.response.data.message)
                                setPopup(false)
                              }
                            }
                          } finally {
                            setPopup(false)
                          }
                        }
                      }>Delete</button>
                    </div>
                  </div>
                  <div className="delivery-option">
                    <p className="name-head">Choose a Delivery Option</p>
                    {deliveryOptions.map((option) => {
                      const date = dayjs();
                      const addDays = date.add(option.deliveryDuration, 'days')
                      const dateString = addDays.format('MMMM D')
                      const priceString = option.priceCents === 0 ? 'FREE Shipping' : `$${(option.priceCents / 100).toFixed(2)}`
                      const handleRadioChange = async () => {
                        setPopup(true)
                        try {
                          await axios.put(`${API_URL}/cart/update-cart`, {
                            cartId: item._id,
                            optionId: option.id
                          },
                            {
                              headers: {
                                Authorization: `Bearer ${token}`
                              },
                              withCredentials: true
                            })
                          await loadUserData()
                          setCartUpdate(cartUpdate + 1)
                        } catch (error) {
                          if (axios.isAxiosError(error)) {
                            if (error.response?.data?.message === 'JWT Expired') {
                              setErrorMsg("User Logged Out...Please Login Again")
                              setPopup(false)
                            } else {
                              setErrorMsg(error.response.data.message)
                              setPopup(false)
                            }
                          }
                        } finally {
                          setPopup(false)
                        }
                      }

                      return (
                        <div className="options" key={option._id}>
                          <input type="radio"
                            onChange={handleRadioChange}
                            checked={item.deliveryOptionsId === option.id}
                            name={`cart-delivery-option-${item._id}`}
                          />
                          <label onClick={handleRadioChange}>
                            {dateString}
                            <p>{priceString}</p>
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )

          })}

        </div>

        <div className="order-summary js-order-summary">
          <div className="sum-txt" style={{ color: '#034188', fontWeight: 'bolder' }}>
            Order Summary
          </div>
          <div className="sum-body">
            <div className="charge">
              <pre>Items({cartQuantity})</pre>
              <pre className="line-text">Shipping & handling</pre>
              <pre>Total beFore Tax</pre>
              <pre>Estimated tax(10%)</pre>
            </div>
            <div className="amount">
              <p>${(productPrice / 100).toFixed(2)}</p>
              <p className="line">${(deliveryPrice / 100).toFixed(2)}</p>
              <p>${((deliveryPrice + productPrice) / 100).toFixed(2)}</p>
              <p>${((((deliveryPrice + productPrice) * 10) / 100) / 100).toFixed(2)}</p>
            </div>
          </div>
          <div className="last-line"></div>
          <div className="amt-total">
            <p className="first-p">Order Total:</p>
            <p className="second-p">${(((((deliveryPrice + productPrice) * 10) / 100) + (deliveryPrice + productPrice)) / 100).toFixed(2)}</p>
          </div>

          <button className="order-btn" onClick={
            async () => {
              setPopup(true)
              try {
                if (cart.length === 0) {
                  alert("Your cart is empty. Please add items to your cart before placing an order.");
                  setIsLoading(false);
                  navigate('/');
                  return;
                }

                if (!address) {
                  alert("Please set your delivery address before placing an order.");
                  setIsLoading(false);
                  navigate('/address');
                  return;
                }
                await axios.post(`${API_URL}/orders/create-order`, {}, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  },
                  withCredentials: true
                })

                const response = await axios.get(`${API_URL}/users/get-user-details`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                  })

                const orders = response.data.data.orderIds

                await axios.post(`${API_URL}/payment/initialize-payment`, {
                  email: details.email,
                  amountCents: Math.round(((((((deliveryPrice + productPrice) * 10) / 100) + (deliveryPrice + productPrice))) * 1500)),
                  orderId: orders[orders.length - 1]._id
                }, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  },
                  withCredentials: true
                }).then((response) => {
                  console.log(response.data.data.authorization_url);
                  window.location.href = response.data.data.authorization_url;
                })

              } catch (error) {
                if (axios.isAxiosError(error)) {
                  if (error.response?.data?.message === 'JWT Expired') {
                    setErrorMsg("User Logged Out...Please Login Again")
                    setPopup(false)
                  } else {
                    setErrorMsg(error.response.data.message)
                    setPopup(false)
                  }
                }
              }
            }
          }>
            Place Your Order
          </button>

        </div>
      </div>

      {popup && <LoadingPopup />}
    </>
  )
}

export default Cart