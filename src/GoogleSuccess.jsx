import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

function GoogleSuccess() {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem('isLoggedIn', JSON.stringify(true))
      window.location.href = '/'
    }
  }, []);

  return <h1>Logging you in with Google...</h1>;
}

export default GoogleSuccess;
