"use client";

import { useEffect } from "react";
import { useCart } from "../../components/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const total = cart.reduce(
    (acc, item) =>
      acc + parseFloat(item.price) * item.quantity,
    0
  );




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
              className="border-b pb-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl">
                  {item.name} ({item.size})
                </h2>
                <p className="text-gray-600">{item.price}</p>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value))
                  }
                  className="w-16 mt-2 p-1 border rounded"
                />
                <Link href={`/products/${item.id}`}>
                  View Product
                </Link>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-xl font-semibold mt-6">
            Total: ${total.toFixed(2)}
          </div>

          <Link href="/checkout">
            <button className="mt-4 px-6 py-2 bg-black text-white rounded hover:bg-gray-800">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
