import axios from 'axios'

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (res)=>{
    return res
  },

  async (error)=>{
    const originalRequest = error.config;

    if(error.response?.status === 401 && 
      error.response.data.message === 'JWT Expired' && 
      !originalRequest._retry){
      originalRequest._retry = true;

      try {
        // ask Backend for the new access token
        axios.post("http://localhost:3000/api/users/refresh",
          {},
          {withCredentials: true }
        )
        .then((response)=>{
          const newToken = response.data.accessToken

          // fix the failed request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // save the new token to local storage
          localStorage.setItem('token', JSON.stringify(newToken));
        

          // Retry axios Request
          return axios(originalRequest)

        })
      } catch(error) {
        // Refresh Token Expired or Invalid
        localStorage.removeItem('token');
        localStorage.setItem('isLoggedIn', JSON.stringify(false))
        if(axios.isAxiosError(error)){
          localStorage.setItem('error', JSON.stringify(error.response.data.message))
          window.location.href = '/users'
        }
      }
    }

    return Promise.reject(error)
  }
)