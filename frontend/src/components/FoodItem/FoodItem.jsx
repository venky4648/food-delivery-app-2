import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import "./FoodItem.css";
import PropTypes from "prop-types";
import { StoreContext } from "../../context/StoreContext";
import { toast } from 'react-toastify';
import axios from "axios";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url, fetchFoodList, user, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const response = await axios.post(`${url}/api/food/remove`, { id }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          toast.success("Item deleted successfully!");
          fetchFoodList();
        } else {
          toast.error("Failed to delete item: " + response.data.message);
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Error deleting item: " + error.message);
      }
    }
  };

  // Resolve image source dynamically: database image filenames don't contain slashes or data prefix
  const isServerImage = typeof image === "string" && !image.includes("/") && !image.startsWith("data:");
  const resolvedImageSrc = isServerImage ? `${url}/images/${image}` : image;

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img 
          className="food-item-image" 
          src={resolvedImageSrc} 
          alt={name} 
          onClick={() => navigate(`/product/${id}`)}
          style={{ cursor: 'pointer' }}
        />
        {user?.role === "admin" && String(id).length > 2 && (
          <button className="delete-btn" onClick={handleDelete} title="Delete Food Item">
            🗑️
          </button>
        )}
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt=""
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt=""
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p 
            onClick={() => navigate(`/product/${id}`)} 
            style={{ cursor: 'pointer' }}
          >
            {name}
          </p>
          <img src={assets.rating_starts} alt="rating stars" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

FoodItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default FoodItem;
