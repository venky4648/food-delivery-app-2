import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { food_list, cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundProduct = food_list.find((item) => String(item._id) === String(id));
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id, food_list]);

  if (!product) {
    return (
      <div className="product-details-container">
        <h2>Product not found or loading...</h2>
        <button onClick={() => navigate('/')} className="back-btn">Go Back</button>
      </div>
    );
  }

  const isServerImage = typeof product.image === "string" && !product.image.includes("/") && !product.image.startsWith("data:");
  const resolvedImageSrc = isServerImage ? `${url}/images/${product.image}` : product.image;

  return (
    <div className="product-details-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        &#8592; Back
      </button>
      
      <div className="product-details-content">
        <div className="product-details-image-section">
          <img src={resolvedImageSrc} alt={product.name} className="product-details-image" />
        </div>
        
        <div className="product-details-info">
          <h1>{product.name}</h1>
          <div className="product-rating">
            <img src={assets.rating_starts} alt="rating stars" />
          </div>
          <h2 className="product-price">${product.price}</h2>
          <p className="product-description">{product.description}</p>
          <div className="product-category">
            <strong>Category:</strong> {product.category}
          </div>

          <div className="product-cart-controls">
            {!cartItems[id] ? (
              <button className="add-to-cart-btn" onClick={() => addToCart(id)}>
                Add to Cart
              </button>
            ) : (
              <div className="product-counter">
                <img
                  onClick={() => removeFromCart(id)}
                  src={assets.remove_icon_red}
                  alt="Remove"
                  className="counter-icon"
                />
                <span className="counter-value">{cartItems[id]}</span>
                <img
                  onClick={() => addToCart(id)}
                  src={assets.add_icon_green}
                  alt="Add"
                  className="counter-icon"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
