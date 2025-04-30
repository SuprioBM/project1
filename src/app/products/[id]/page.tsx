"use client";

import { useState, useEffect } from "react";
import { useCart } from "../../../components/context/CartContext";
import { useParams } from "next/navigation";
import { toast } from "sonner";

// Define proper Product type
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string[];
  size: Record<string, number>[]; // Optional: adjust if you use this on this page
};

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const { addToCart, cart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    console.log("Cart updated:", cart);
  }, [cart]);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data: Product = await res.json();
        setProduct(data);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size!");
      return;
    }

    const cartItem = {
      id: product!.id,
      name: product!.name,
      price: product!.price.toString(),
      quantity,
      size: selectedSize,
    };

    addToCart(cartItem);
    toast.success(`${product!.name} added to cart!`);
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="p-8 pt-30 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="mb-4">{product.description}</p>
      <img
        src={product.image[0]}
        alt={product.name}
        className="w-full max-w-md mb-4"
      />
      <p className="text-xl font-semibold mb-4">Price: {product.price}</p>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Select Size:</label>
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">-- Choose a size --</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Quantity:</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border p-2 rounded w-20"
        />
      </div>

      <button
        onClick={handleAddToCart}
        className="px-6 py-2 bg-black text-white rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}
