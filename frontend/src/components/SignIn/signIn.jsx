import React, { useState, useContext } from 'react';
import PropTypes from "prop-types";
import axios from "axios";
import { assets } from "../../assets/assets";
import { toast } from 'react-toastify';
import { StoreContext } from "../../context/StoreContext";

const SignIn = ({ setShowLogin, setShowSignIn }) => {
    const { setUser, setToken, url } = useContext(StoreContext);
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/api/signIn`, values);
            const data = response.data;
            if (data.status) {
                toast.success("Sign up successful!");
                sessionStorage.setItem("user", JSON.stringify(data.user));
                sessionStorage.setItem("token", data.token);
                setUser(data.user);
                setToken(data.token);
                setShowSignIn(false);
            } else {
                toast.error(data.message || "Sign up failed");
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Sign up failed");
            }
            console.log(err);
        }
    };

    return (
        <div className="login-popup">
            <form className="login-popup-cointainer" onSubmit={handleSubmit}>
                <div className="login-popup-title">
                    <h2>Sign Up</h2>
                </div>
                <div className="login-popup-inputs">
                    <input onChange={handleChange} name="name" type="text" placeholder="Your Name" required />
                    <input onChange={handleChange} name="email" type="email" placeholder="Your Email" required />
                    <input onChange={handleChange} name="password" type="password" placeholder="Password" required />
                    
                    <select onChange={handleChange} name="role" value={values.role} required style={{ outline: 'none', border: '1px solid #c9c9c9', padding: '10px', borderRadius: '4px', background: 'white', color: '#555' }}>
                        <option value="user">User Role (Browse & Order)</option>
                        <option value="admin">Admin Role (Manage Menu)</option>
                    </select>
                </div>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
                <button type="submit">Submit</button>
                <p>
                    Already have an account?
                    <span>
                        <a
                            onClick={() => {
                                setShowSignIn(false);
                                setShowLogin(true);
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            Login
                        </a>
                    </span>
                </p>
            </form>
        </div>
    );
};

SignIn.propTypes = {
    setShowLogin: PropTypes.func.isRequired,
    setShowSignIn: PropTypes.func.isRequired,
};

export default SignIn;