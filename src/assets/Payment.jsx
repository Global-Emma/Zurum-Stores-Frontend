import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import { useEffect } from "react";
import { useState } from "react";
import { useCallback } from "react";


const Payment = ({ token, loadUserData, API_URL }) => {

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [params] = useSearchParams()
  const reference = params.get('reference')
  // console.log(reference);
  // console.log(params);
  const navigate = useNavigate()

  const verifyPayment = useCallback( async () => {
    try {
      const response = await axios.get(`${API_URL}/payment/verify-payment/${reference}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      if (response.data.success === true) {
        // Handle successful payment verification
        axios.delete(`${API_URL}/cart/delete-all`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        })
        loadUserData();
        navigate('/payment-success')
      } else {
        setError(response.data.message);
        navigate('/payment-failure')
      }

    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false)
    }
  }, [reference, token, navigate, loadUserData])

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment])

  if (isLoading) return <LoadingScreen />
  if (error) return <div className="error-message">{error}</div>

}

export default Payment