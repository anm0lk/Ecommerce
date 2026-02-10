import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePostReq } from "../../hooks/useHttp";
import { AuthContext } from "../../context/AuthContext";

function useScript(src) {
  const [status, setStatus] = useState(src ? "loading" : "idle");

  React.useEffect(() => {
    if (!src) {
      setStatus("idle");
      return;
    }
    let script = document.querySelector(`script[src="${src}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => setStatus("ready");
      script.onerror = () => setStatus("error");
      document.body.appendChild(script);
    } else {
      setStatus("ready");
    }
    return () => {
      // Optionally remove script on unmount
      // script.parentNode && script.parentNode.removeChild(script);
    };
  }, [src]);

  return status;
}

const RAZORPAY_SRC = "https://checkout.razorpay.com/v1/checkout.js";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const cart = state?.cart;
  const product = state?.product;

  const [address, setAddress] = useState(user.shippingAddress);
  const [editing, setEditing] = useState(false);
  const [addressInput, setAddressInput] = useState(address);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const scriptStatus = useScript(RAZORPAY_SRC);

  if (!cart && !product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">No cart data found</h2>
          <button
            className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold shadow hover:from-purple-500 hover:to-pink-400 transition"
            onClick={() => navigate("/cart")}
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  const handlePayNow = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (scriptStatus !== "ready") {
      setError("Payment gateway is not ready. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const orderRes = await usePostReq(
        cart
          ? `api/payment/create-order?amount=${cart.totalPrice}&currency=INR&receipt=${user.userId}`
          : `api/payment/create-order-product?amount=${product.price}&currency=INR&receipt=${user.userId}&productId=${product.productId}`,
        address,
        token
      );
      const options = {
        key: "rzp_test_zCLqzizYMczuxO",
        amount: cart ? cart.totalPrice * 100 : product.price * 100,
        currency: "INR",
        name: "Carture",
        description: "Test Transaction",
        order_id: orderRes.id,
        handler: async function (response) {
          try {
            setSuccess("Payment Successful!");
            setTimeout(() => navigate("/orders"), 1200);
          } catch (err) {
            setError("Payment verification failed.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: "9999999999",
        },
        theme: {
          color: "#8e24aa",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAddress = () => {
    setEditing(true);
    setAddressInput(address);
  };

  const handleSaveAddress = () => {
    setAddress(addressInput);
    setEditing(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 px-2">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-8 text-center tracking-tight">
          Checkout
        </h1>
        <form onSubmit={handlePayNow} className="space-y-8">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 shadow mb-4">
            <h2 className="text-lg font-semibold mb-4 text-purple-700 flex items-center gap-2">
              <span role="img" aria-label="cart">🛒</span> Order Summary
            </h2>
            <ul className="mb-4 divide-y divide-purple-100">
              {cart?.items?.map((item, idx) => (
                <li key={idx} className="flex justify-between py-2 text-gray-700">
                  <span>{item.productName}</span>
                  <span>
                    ₹{item.productPrice} <span className="text-xs text-gray-500">x {item.quantity}</span>
                  </span>
                </li>
              ))}
              {product && (
                <li className="flex justify-between py-2 text-gray-700">
                  <span>{product.name}</span>
                  <span>
                    ₹{product.price} <span className="text-xs text-gray-500">x 1</span>
                  </span>
                </li>
              )}
            </ul>
            <div className="flex justify-between font-bold text-purple-700 border-t pt-3 text-lg">
              <span>Total</span>
              {cart && <span>₹{cart.totalPrice}</span>}
              {!cart && <span>₹{product?.price}</span>}
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 shadow">
            <label className="block text-gray-700 font-semibold mb-2 text-base">
              Delivering to:
            </label>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-purple-700">{user.name}</span>
              <span className="text-xs text-gray-500 bg-purple-100 px-2 py-0.5 rounded">Default</span>
            </div>
            {!editing ? (
              <div className="mb-2">
                <div className="text-gray-700 mb-2">{address}</div>
                <button
                  type="button"
                  className="text-sm text-blue-600 underline hover:text-blue-800 transition"
                  onClick={handleChangeAddress}
                >
                  Change delivery address
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  className="w-full px-4 py-2 border-2 border-purple-200 focus:border-purple-500 rounded outline-none transition"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  required
                  placeholder="Enter new delivery address"
                />
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                    onClick={handleSaveAddress}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="px-4 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          {error && (
            <div className="text-red-500 text-center font-semibold">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-center font-semibold">{success}</div>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:from-purple-500 hover:to-pink-400 transition text-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Placing Order...
              </span>
            ) : (
              "Pay Now"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;