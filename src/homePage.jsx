import { Fragment, useEffect, useState, } from "react"

import axios from 'axios';
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./assets/LoadingScreen";
import LoadingPopup from "./assets/LoadingPopup";

const HomePage = ({ loadUserData, cart, token, login, details, API_URL }) => {

  const [homeUpdate, setHomeUpdate] = useState(0);

  document.title = 'Amazon(React)'

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [popup, setPopup] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        await loadUserData()

        axios.get(`${API_URL}/products/all-products`)
          .then(response => {
            setProducts(response.data.data);
          });
      } catch (error) {
        console.error('Error Loading Products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    load()

  }, [loadUserData, API_URL])

  const [selectedNo, setSelectedNo] = useState(1)

  const navigate = useNavigate()

  if (isLoading) return <LoadingScreen />

  if (errorMsg) {
    setTimeout(() => {
      setErrorMsg('')
    }, 5000)
    return <h2>{errorMsg}</h2>
  }
  
  return (
    <>

      <NavBar cart={cart} logIn={login} details={details} />


      {/* Products Container  */}
      <div className="cover-products">NO PRODUCT IN DISPLAY</div>
      <div className="all-products js-all-products">
        {products.map((product) => (
          <div className="products-container" id="product" key={product._id}>
            <div className="products-img">
              <img src={product.image} alt="" />
            </div>
            <div className="products-details">
              <h3 className="name">{product.name}</h3>
              <div className="rating">
                <img src={`images/ratings/rating-${(product.rating.stars) * 10}.png`} alt="" width="100px" />
                <p>{product.rating.count}</p>
              </div>
              <div className="price">${((product.priceCents) / 100).toFixed(2)}</div>

              <select name="quantity" id="" style={{ cursor: 'pointer' }} onChange={
                (event) => {
                  setSelectedNo(Number(event.target.value))
                }
              }>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>

            <button className="cart-btn" onClick={
              async () => {
                if (login === false) {
                  navigate('/users')
                }
                setPopup(true)
                try {

                  await axios.post(`${API_URL}/cart/add-to-cart`, {
                    productId: product._id,
                    quantity: selectedNo,
                    deliveryOptionsId: '1' // Default delivery option ID
                  },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`
                      },
                      withCredentials: true
                    })
                  await loadUserData();
                  setHomeUpdate(homeUpdate + 1);
                } catch (error) {
                  if (axios.isAxiosError(error)) {
                    if (error.response?.data?.message === 'JWT Expired') {
                      setErrorMsg("User Logged Out...Please Login Again")
                      setPopup(false)
                    }
                  }
                } finally {
                  setPopup(false)
                }
              }
            }>Add to Cart</button>
          </div>
        ))}

      </div >

      {popup && <LoadingPopup />}
    </>
  )
}


export default HomePage