import { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, setCartItems,getTotalCartAmount } = useContext(StoreContext); // Include setCartItems in the context
  const { food_list } = useContext(StoreContext);
  
  const navigate=useNavigate()
  // Calculate subtotal based on cart items and prices
  const subtotal = food_list.reduce((total, item) => {
    return total + (cartItems[item._id] || 0) * item.price; // Use item._id for matching
  }, 0);

  const deliveryFee = subtotal > 0 ? 2 : 0;
  

  const handleRemoveFromCart = (itemId) => {
    if (cartItems[itemId] > 1) {
      removeFromCart(itemId);
    } else {
      const updatedCartItems = { ...cartItems };
      delete updatedCartItems[itemId]; // Remove the item from cartItems
      setCartItems(updatedCartItems); // Update cartItems state
    }
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        <div>
          {food_list.map((item, index) => {
            if (cartItems[item._id] > 0) {
              return (
                <div className="cart-items-title cart-items-item" key={index}>
                  <img 
                    src={item.image} 
                    alt="" 
                    onClick={() => navigate('/product/' + item._id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <p 
                    onClick={() => navigate('/product/' + item._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.name}
                  </p>
                  <p>{item.price}</p>
                  <p>{cartItems[item._id]}</p> {/* Use item._id for matching */}
                  <p>{cartItems[item._id] * item.price}</p> {/* Use item._id for matching */}
                  <p onClick={() => handleRemoveFromCart(item._id)} className="cross">Remove</p>
                </div>
              );
            }
            return null; // Ensure to return null if condition is not met
          })}
        </div>

        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${subtotal}</p>
              </div>
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${deliveryFee}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Total</p>
                <p>${getTotalCartAmount()+deliveryFee}</p>
              </div>
            </div>
            <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
          </div>
          <div className="cart-promocode">
            <div>
              <p>If you have a promo code, Enter it here</p>
              <div className="cart-promocode-input">
                <input type="text" placeholder="promo code " />
                <button>Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
