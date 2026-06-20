import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import PropTypes from "prop-types"
import { StoreContext } from "../../context/StoreContext";
const Navbar = ({setShowLogin}) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, user, setUser, setToken, searchQuery, setSearchQuery } = useContext(StoreContext)
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);
    setToken("");
  };

  const handleNavClick = (menuName, hash) => {
    setMenu(menuName);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="navbar">
      <Link to ="/"><img src={assets.logo} alt="header image" className="logo" /></Link>
      <ul className="navbar-menu">
        <li>
          <Link
            to="/"
            className={menu === "home" ? "active" : ""}
            onClick={() => setMenu("home")}
          >
            Home
          </Link>
        </li>
        <li>
          <a
            className={menu === "menu" ? "active" : ""}
            onClick={(e) => { e.preventDefault(); handleNavClick("menu", "explore-menu"); }}
            style={{ cursor: "pointer" }}
          >
            Menu
          </a>
        </li>
        <li>
          <a
            className={menu === "mobile-app" ? "active" : ""}
            onClick={(e) => { e.preventDefault(); handleNavClick("mobile-app", "app-download"); }}
            style={{ cursor: "pointer" }}
          >
            Mobile App
          </a>
        </li>
        <li>
          <a
            className={menu === "contact-us" ? "active" : ""}
            onClick={(e) => { e.preventDefault(); handleNavClick("contact-us", "footer"); }}
            style={{ cursor: "pointer" }}
          >
            Contact Us
          </a>
        </li>
      </ul>
      <div className="navbar-right">
        {location.pathname !== '/cart' && (
          <div className="navbar-search" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {showSearch && (
              <input 
                type="text" 
                placeholder="Search food..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid #ccc',
                  outline: 'none',
                  width: '150px',
                  animation: 'fadeIn 0.3s'
                }}
              />
            )}
            <img 
              src={assets.search_icon} 
              alt="search" 
              onClick={() => setShowSearch(!showSearch)}
              style={{ cursor: "pointer" }}
            />
          </div>
        )}
        <div className="navbar-serach-icon">
          <Link to="/cart"><img src={assets.basket_icon} alt="" /></Link>
          <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
        {!user ? (
          <button onClick={()=>{setShowLogin(true)}}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="profile" />
            <ul className="nav-profile-dropdown">
              <li className="user-info">{user.name} ({user.role})</li>
              <hr />
              <li onClick={handleLogout}>
                <img src={assets.logout_icon} alt="logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};


Navbar.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};
export default Navbar;
