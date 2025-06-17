"use client";

import { useState, useEffect } from "react";
import { useCart } from "../../../components/context/CartContext";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { CarouselDemo } from "../../../components/components/Carousel";
import TriangleLoader from "../../../components/components/Loader";// ✅ import loader

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string[];
  size: Record<string, number>; // now an object mapping size -> stock quantity
};

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const { addToCart, cart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true); // ✅ loading state
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    console.log("Cart updated:", cart);
  }, [cart]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true); // ✅ start loading
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data: Product = await res.json();
        setProduct(data);
      } else {
        setProduct(null);
      }
      setLoading(false); // ✅ stop loading
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size!");
      return;
    }

    if (product && product.size[selectedSize] === 0) {
      alert("Selected size is out of stock!");
      return;
    }

    if (quantity > (product?.size[selectedSize] ?? 0)) {
      alert(
        `Only ${
          product?.size[selectedSize]
        } item(s) available for size ${selectedSize.toUpperCase()}.`
      );
      return;
    }

    const cartItem = {
      id: product!.id,
      name: product!.name,
      price: product!.price.toString(),
      quantity,
      size: selectedSize,
      image: product!.image,
    };

    addToCart(cartItem);
    toast.success(
      `${product!.name} (${selectedSize.toUpperCase()}) added to cart!`
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <TriangleLoader />
      </div>
    );

  if (!product)
    return (
      <div className="p-8 text-center text-red-600">
        Product not found or failed to load.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-8 pt-32">
      <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
      <p className="mb-6 text-gray-700">{product.description}</p>

      <div className="w-full flex justify-center mb-6">
        <CarouselDemo images={product.image} />
      </div>

      <p className="text-2xl font-semibold mb-6">${product.price.toFixed(2)}</p>

      <div className="mb-6 max-w-xs">
        <label htmlFor="size-select" className="block font-semibold mb-2">
          Select Size:
        </label>
        <select
          id="size-select"
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-required="true"
        >
          <option value="">-- Choose a size --</option>
          {Object.entries(product.size)
            .filter(([_, stock]) => stock > 0) // show only sizes with stock
            .map(([size, stock]) => (
              <option key={size} value={size}>
                {size.toUpperCase()} ({stock} available)
              </option>
            ))}
        </select>
      </div>

      <div className="mb-6 max-w-xs">
        <label htmlFor="quantity-input" className="block font-semibold mb-2">
          Quantity:
        </label>
        <input
          id="quantity-input"
          type="number"
          min={1}
          max={selectedSize ? product.size[selectedSize] : undefined}
          value={quantity}
          onChange={(e) =>
            setQuantity(
              Math.max(
                1,
                Math.min(
                  Number(e.target.value),
                  selectedSize ? product.size[selectedSize] : Infinity
                )
              )
            )
          }
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Quantity"
        />
      </div>

      <button
        onClick={handleAddToCart}
        className="px-8 py-3 bg-black text-white rounded font-semibold hover:bg-gray-800 transition"
        aria-label={`Add ${quantity} ${product.name} of size ${selectedSize} to cart`}
      >
        Add to Cart
      </button>
    </div>
  );
}
