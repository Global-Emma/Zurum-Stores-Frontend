import axios from "axios";
import { useState } from "react";
import LoadingPopup from "./assets/LoadingPopup";

const AddressPage = ({token, API_URL}) => {

  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa",
    "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
    "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
    "FCT"
  ];

  const [popup, setPopup] = useState(false)


  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "Nigeria",
    postalCode: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setPopup(true)
    try {
      // Example API call
      await axios.post(`${API_URL}/users/address`, {
        street: address.street,
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postalCode,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      }
    );

      alert("Address saved successfully!");
      window.location.href = '/cart';
      setPopup(false)
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  return (
    <div className="address-container">
      <h2>Delivery Address</h2>

      <form onSubmit={handleSubmit} className="address-form">

      <label htmlFor="street">Street Address</label>
        <input
          type="text"
          name="street"
          placeholder="Street Address"
          value={address.street}
          onChange={handleChange}
          required
        />

        <label htmlFor="city">City</label>
        <input
          type="text"
          name="city"
          placeholder="City"
          value={address.city}
          onChange={handleChange}
          required
        />

        <label htmlFor="state">State</label>
        <select
          name="state"
          value={address.state}
          onChange={handleChange}
          required
        >
          <option value="">Select State</option>
          {nigerianStates.map(state => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <label htmlFor="postalCode">Postal Code</label>
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={address.postalCode}
          onChange={handleChange}
        />

        <label htmlFor="country">Country</label>
        <input
          type="text"
          name="country"
          value={address.country}
          onChange={handleChange}
          readOnly
        />

        <button type="submit">Save Address</button>
      </form>

      {popup && <LoadingPopup />}
    </div>
  );
};

export default AddressPage;
