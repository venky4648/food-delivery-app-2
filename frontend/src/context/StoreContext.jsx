import { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { food_list as static_food_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const url = import.meta.env.VITE_API_URL;

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        setFoodList(response.data.data);
      } else {
        setFoodList(static_food_list);
      }
    } catch (error) {
      console.error("Error fetching food list, falling back to static assets:", error);
      setFoodList(static_food_list);
    }
  };

  // On first load: restore session and fetch food
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    fetchFoodList();
  }, []);

  // Re-fetch food list whenever the user logs in (user changes from null to a value)
  useEffect(() => {
    if (user) {
      fetchFoodList();
    }
  }, [user]);

  const addToCart = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const removeFromCart = (itemId) => {
    if (cartItems[itemId] > 0) {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    }
  };

  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((acc, [itemId, quantity]) => {
      const item = food_list.find((food) => food._id === itemId);
      return acc + (item ? item.price * quantity : 0);
    }, 0);
  };

  const clearCart = () => {
    setCartItems({});
  };

  const contextValue = {
    cartItems,
    food_list,
    addToCart,
    removeFromCart,
    setCartItems,
    getTotalCartAmount,
    clearCart,
    url,
    fetchFoodList,
    user,
    setUser,
    token,
    setToken,
    searchQuery,
    setSearchQuery
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

StoreContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StoreContextProvider;