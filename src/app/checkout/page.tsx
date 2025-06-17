"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/context/CartContext";

export default function CheckoutPage() {
  const { cart,clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    districts: "",
    area: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  const validateForm = () => {
    for (const key in formData) {
      if (!formData[key as keyof typeof formData]?.trim()) {
        alert(`Please fill in the ${key} field.`);
        return false;
      }
    }
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return false;
    }
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (paymentMethod === "cod") {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart,
            formData,
            paymentMethod,
          }),
        });

        if (!response.ok) {
          throw new Error("Checkout failed.");
        }

        await response.json();
        clearCart();
        router.push("/confirmation");
      } else if (paymentMethod === "stripe") {
        // Stripe payment logic here (uncomment when ready)
        // const stripe = await stripePromise;
        // const res = await fetch("/api/checkout", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ items: cart, shippingInfo: formData }),
        // });
        // const session = await res.json();
        // await stripe?.redirectToCheckout({ sessionId: session.id });
      } else {
        alert("Selected payment method not supported yet.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an error during checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 pt-30 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Shipping Form */}
      <h1 className="text-4xl font-bold pb-10">Shipping Address</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Shipping Address"
          value={formData.address}
          onChange={handleChange}
          className="border p-2 rounded col-span-full"
          required
        />
        <input
          type="text"
          name="districts"
          value={formData.districts}
          onChange={handleChange}
          placeholder="enter district"
          className="border p-2 rounded col-span-full"
          required
        />
        <input
          type="text"
          name="area"
          value={formData.area}
          onChange={handleChange}
          placeholder="Enter Area"
          className="border p-2 rounded col-span-full"
          required
        />

        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
      </div>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {/* Cart Summary */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Your Order:</h2>
            <ul className="space-y-3">
              {cart.map((item) => (
                <li key={item.id} className="border p-3 rounded">
                  <p>
                    <strong>{item.name}</strong> ({item.size})
                  </p>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: ${item.price}</p>
                  <p>
                    Total: $
                    {(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
            <p className="text-lg font-bold mt-4">
              Total: ${totalPrice.toFixed(2)}
            </p>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Select Payment Method:
            </h2>
            <div className="space-y-2">
              <label className="block">
                <input
                  type="radio"
                  name="payment"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                />
                <span className="ml-2">Credit/Debit Card</span>
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                />
                <span className="ml-2">Bkash/Nagod/Rocket/Upay</span>
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span className="ml-2">Cash on Delivery</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-3 font-medium rounded text-white ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
}

     