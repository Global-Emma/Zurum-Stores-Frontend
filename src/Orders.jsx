import { Fragment, useState } from "react"
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
// import { deliveryOptions } from "./Products";
import axios from "axios";
import NavBar from "./NavBar";
import LoadingScreen from "./assets/LoadingScreen";
import LoadingPopup from "./assets/LoadingPopup";


const Orders = ({ cart, loadUserData, details, deliveryOptions, returns, token, login, API_URL, error }) => {

  const [reloadPage, setReloadPage] = useState(1)

  document.title = 'Orders Page'

  const [popup, setPopup] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (error) {
    return <h2>Some Error Occured...Please Check Your Internet connection and Try Again</h2>
  }

  if (errorMsg) {
    setTimeout(() => {
      setErrorMsg('')
    }, 5000)
    return <h2>{errorMsg}</h2>
  }
  
  return (
    <Fragment>

      <NavBar cart={cart} logIn={login} details={details} />

      {/* Orders Body  */}
      <div className="order-text">
        Your Orders
      </div>

      {returns.length === 0 && <h1>No Orders Has Been Made.....</h1>}

      <div className="returns-box">
        {[...returns].reverse().map((returnItem, index) => {
          let productPrice = 0;
          let deliveryPrice = 0;
          returnItem.orderItem.forEach((item) => {
            const product = item.productId;
            productPrice += product.priceCents * item.quantity;
            const selectedDeliveryOption = deliveryOptions.find((option) => {
              return option.id === item.deliveryOptionsId
            })
            deliveryPrice += selectedDeliveryOption.priceCents
          })


          return (
            <div className="order-cover" key={index}>
              <div className="order-box">

                <div className="box-head js-con-head">
                  <div className="box-head-left">
                    Order Placed:
                    <p>{dayjs(returnItem.createdAt).format('MMMM D')}</p>
                  </div>

                  <div className="box-head-center">
                    Total:
                    <p>${(((productPrice + deliveryPrice) / 100) + ((((productPrice + deliveryPrice) * 10) / 100) / 100)).toFixed(2)}</p>
                  </div>

                  <div className="box-head-right">
                    Order ID:
                    <p>{returnItem._id}</p>
                    <p>Order Status: {returnItem.status || 'pending'}</p>
                    <p>Payment Status: {returnItem.paymentStatus || 'PENDING'}</p>
                  </div>
                </div>

                {/* Order 1 */}
                {returnItem.orderItem.map((item) => {
                  const product = item.productId;
                  productPrice += product.priceCents;
                  const selectedDeliveryOption = deliveryOptions.find((option) => {
                    return option.id === item.deliveryOptionsId
                  })
                  deliveryPrice += selectedDeliveryOption.priceCents
                  const dateString = dayjs().add(selectedDeliveryOption.deliveryDuration, 'days').format('MMMM D')
                  return (

                    <div className="pro-body js-pro-body" key={item._id}>
                      <div className="con-prod-body">

                        <div className="body-left">
                          <img src={product.image} alt="" />
                        </div>
                        <div className="mobile-body">
                          <div className="body-center">
                            {product.name}
                            <p>Arriving on: {dateString} </p>
                            <p>Quantity: {item.quantity}</p>
                            <button onClick={
                              async () => {
                                setPopup(true)
                                try {
                                  await axios.post(`${API_URL}/cart/add-to-cart`, {
                                    productId: product._id,
                                    quantity: 1,
                                    deliveryOptionsId: '1' // Default delivery option ID
                                  },
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`
                                      }
                                    })
                                  await loadUserData();
                                  setReloadPage(reloadPage + 1)
                                } catch (error) {
                                  if (axios.isAxiosError(error)) {
                                    if (error.response?.data?.message) {
                                      setErrorMsg(error.response.data.message)
                                      setPopup(false)
                                    }
                                  }
                                } finally {
                                  setPopup(false)
                                }

                              }

                            }><img src="images/icons/buy-again.png" alt="" /> Buy it again</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )


        })}

      </div>

      {popup && <LoadingPopup />}

    </Fragment>
  )

}

export default Orders