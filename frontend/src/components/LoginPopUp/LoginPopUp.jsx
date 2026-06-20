/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { assets } from "../../assets/assets";
import "./LoginPopUp.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import { StoreContext } from "../../context/StoreContext";

const LoginPopUp = ({ setShowLogin, setShowSignIn }) => {
  const navigate = useNavigate();
  const { setUser, setToken, url } = useContext(StoreContext);
  const [values, setValues] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/login`, values);
      const data = response.data;
      if (data.status) {
        toast.success("Login successful!");
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("token", data.token);
        setUser(data.user);
        setToken(data.token);
        setShowLogin(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Login failed: " + (err.response?.data?.message || err.message));
      console.log(err);
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-cointainer" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>LogIn</h2>
        </div>
        <div className="login-popup-inputs">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={values.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        <button type="submit">Login</button>
        <p>
          create a new account
          <span>
            <a onClick={() => { setShowLogin(false); setShowSignIn(true); navigate('/signIn'); }} style={{ cursor: "pointer" }}>Sign In</a>
          </span>
        </p>
      </form>
    </div>
  );
};

LoginPopUp.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};

export default LoginPopUp;