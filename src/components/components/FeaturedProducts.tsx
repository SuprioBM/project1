"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import TriangleLoader from "./Loader";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string[];
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,setLoading] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/products");
        setProducts(res.data.slice(0, 6)); // Show first 6 products
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-16 bg-white" id="explore">
      <div className="container mx-auto px-4 text-center max-w-7xl">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <Link
          href="/products"
          className="inline-block text-blue-600 mb-6 hover:underline font-semibold"
          >
          View More &rarr;
        </Link>
       {loading ? (
                 <div className="col-span-full flex justify-center py-20">
                   <TriangleLoader />
                 </div>
               ) :

        (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="block bg-gray-50 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105"
              aria-label={`View details for ${product.name}`}
            >
              <div className="relative w-full h-64">
                <Image
                  src={product.image?.[0] || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={false}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-lg font-medium text-gray-700">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>)
}
      </div>
    </section>
  );
};

export default FeaturedProducts;
