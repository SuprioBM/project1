"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        // Optionally slice to show only a few featured ones
        setProducts(res.data.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-16 bg-white" id="explore">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <Link
          href="/products"
          className="flex flex-row-reverse text-blue-500 mb-6 hover:underline"
        >
          View More
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-50 p-6 rounded-lg shadow-lg transition duration-300 ease-in-out hover:scale-105"
            >
              <Link href={`/products/${product.id}`}>
                <img
                  src={product.image?.[0] || "/placeholder.png"} // assuming array of image URLs
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-t-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-lg font-medium text-gray-600">
                  ${product.price}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
