"use client";

import { useCart } from "../../components/context/CartContext";
import Link from "next/link";
import { X } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const total = cart.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );
  console.log(cart);
  
  return (
    <div className="p-8 pt-30 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item, index) => (
            <div
              key={index}
              className="border-b pb-4 flex justify-between items-start gap-4"
            >
              {/* Left: image + info */}
              <div className="flex gap-4 max-w-[70%]">
                {/* 🖼 Small image thumbnail */}
                <img
                  src={item.image?.[0] || "/placeholder.jpg"} // fallback image
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded shadow"
                />

                {/* 📦 Product details */}
                <div>
                  <h2 className="text-xl font-semibold">
                    {item.name} ({item.size})
                  </h2>
                  <p className="text-gray-600">
                    ${parseFloat(item.price).toFixed(2)}
                  </p>
                  <div className="mt-2 flex items-center space-x-3">
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >= 1) updateQuantity(item.id, val);
                      }}
                      className="w-16 p-1 border rounded"
                    />
                    <Link
                      href={`/products/${item.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>

              {/* ❌ Remove Button */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:underline font-semibold"
                aria-label={`Remove ${item.name} from cart`}
              >
                <X size={20}/>
              </button>
            </div>
          ))}

          <div className="text-xl font-semibold mt-6 text-right">
            Total: ${total.toFixed(2)}
          </div>

          <div className="text-right">
            <Link href="/checkout">
              <button className="mt-4 px-6 py-2 bg-black text-white rounded hover:bg-gray-800">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
