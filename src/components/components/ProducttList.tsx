"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  description: string;
  image: string[]; // array of image URLs
  price: number;
  size: Record<string, number>[]; // you can add checks if needed
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>("/api/products");
        setProducts(res.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading)
    return (
      <p className="text-center py-20 text-gray-500 text-lg">
        Loading products...
      </p>
    );

  if (products.length === 0)
    return (
      <p className="text-center py-20 text-gray-500 text-lg">
        No products available.
      </p>
    );

  return (
    <section className="product-list max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => {
          const imageSrc = product.image?.[0] || "/placeholder.png";

          return (
            <div
              key={product.id}
              className="product-card border rounded-lg shadow-sm bg-white flex flex-col transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="relative w-full h-64 overflow-hidden rounded-t-lg">
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw,
                         (max-width: 1200px) 50vw,
                         33vw"
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 hover:scale-105 rounded-t-lg"
                  priority={false}
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {product.description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-lg font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                  <Link
                    href={`/products/${product.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductList;
