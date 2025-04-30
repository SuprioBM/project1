"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

// Define Product type
type Product = {
  id: string;
  name: string;
  description: string;
  image: string[];
  price: number;
  size: Record<string, number>[]; // Adjust as needed
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>("/api/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="product-card border rounded p-4 shadow hover:shadow-md"
        >
          <h3 className="text-lg font-bold mb-2">{product.name}</h3>
          <p className="mb-2 text-gray-600">{product.description}</p>
          <Link
            href={`/products/${product.id}`}
            className="text-blue-500 hover:underline"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
