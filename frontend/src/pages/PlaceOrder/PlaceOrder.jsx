import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
const PlaceOrder = () => {
  const navigate = useNavigate();
  const { getTotalCartAmount, food_list, cartItems, clearCart } = useContext(StoreContext);
  const subtotal = food_list.reduce((total, item) => {
    return total + (cartItems[item._id] || 0) * item.price;
  }, 0);

  const deliveryFee = subtotal > 0 ? 2 : 0;
  const totalAmount = getTotalCartAmount() + deliveryFee;

  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  
  // Razorpay handler
  const loadRazorpay = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };



const handlePayment = async (e) => {
  console.log("Payment initiated");
  e.preventDefault();

  // Validate form
  if (!firstName || !lastName || !email || !street || !city || !region || !zip || !country || !phone) {
    alert('Please fill all delivery information');
    return;
  }

  if (totalAmount <= 0) {
    alert('Cart is empty. Please add items before proceeding with payment.');
    return;
  }

  // Prepare items array for order
  const items = Object.entries(cartItems).map(([itemId, quantity]) => {
    const item = food_list.find((food) => food._id === itemId);
    return {
      ...item,
      quantity
    };
  });

  try {
    // STEP 0: LOAD RAZORPAY SDK
    const res = await loadRazorpay(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK Failed");
      return;
    }

    // STEP 1: CREATE PAYMENT ORDER FROM BACKEND
    const paymentRes = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
      {
        amount: totalAmount
      }
    );

    const order = paymentRes.data.order;

    // STEP 1.5: SAVE ORDER TO DATABASE
    const orderRes = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/orders/create`,
      {
        firstName,
        lastName,
        email,
        phone,
        street,
        city,
        region,
        zip,
        country,
        items,
        amount: totalAmount,
        razorpay_order_id: order.id
      }
    );

    const orderId = orderRes.data.orderId;

    // STEP 2: RAZORPAY OPTIONS
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      alert('Razorpay key is not configured in frontend. Add VITE_RAZORPAY_KEY_ID to your frontend .env file.');
      return;
    }

    const options = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: "Food Delivery App",
      description: "Food Payment",
      order_id: order.id,

      handler: async function (response) {
        try {
          // STEP 3: VERIFY PAYMENT
          const verifyResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/payment/verify-payment`,
            response
          );
          console.log('verifyResponse:', verifyResponse.data);

          if (verifyResponse.data.success) {
            // STEP 4: UPDATE ORDER WITH PAYMENT INFO
            const updateResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/orders/update-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }
            );
            console.log('updateResponse:', updateResponse.data);

            alert("Payment Successful");
            // STEP 5: CLEAR CART
            clearCart();
            // STEP 6: REDIRECT TO HOME
            navigate("/");
          } else {
            alert("Payment Verification Failed");
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          alert('Payment verification failed: ' + (error.response?.data?.message || error.message));
        }
      },

      prefill: {
        name: `${firstName} ${lastName}`,
        email: email,
        contact: phone
      },

      notes: {
        address: `${street}, ${city}, ${region}, ${zip}, ${country}`
      },

      theme: {
        color: "#F37254"
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

  } catch (error) {
    console.error('Razorpay payment error:', error);
    alert(error?.response?.data?.message || error?.message || 'Payment initialization failed. Check the console for details.');
  }
};

  return (
    <form className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </div>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Street"
          value={street}
          onChange={e => setStreet(e.target.value)}
        />
        <div className="multi-fields">
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
          <input
            type="text"
            placeholder="State"
            value={region}
            onChange={e => setRegion(e.target.value)}
          />
        </div>
        <div className="multi-fields">
          <input
            type="text"
            placeholder="Zip Code"
            value={zip}
            onChange={e => setZip(e.target.value)}
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={e => setCountry(e.target.value)}
          />
        </div>
        <input
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
      </div>
      <div className="place-order-right">
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
              <p>${totalAmount}</p>
            </div>
          </div>
          <button type="button" className="razorpay-btn" onClick={handlePayment}>
            Pay with Razorpay
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;