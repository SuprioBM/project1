"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  price: number;
  size: { [key: string]: number }[];
  image: string[];
  link: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [maxPrice, setMaxPrice] = useState(500);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filterProducts = products.filter((product) => {
    const hasSize =
      !selectedSize ||
      product.size.some((s) => Object.keys(s)[0] === selectedSize);
    const matchesPrice = product.price <= maxPrice;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return hasSize && matchesPrice && matchesSearch;
  });

  return (
    <div className="flex flex-col md:flex-row px-4 py-30 gap-6">
      {/* Sidebar */}
      <aside className="w-full md:w-1/6 space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Filter by Size</h3>
          <select
            onChange={(e) => setSelectedSize(e.target.value)}
            value={selectedSize}
            className="w-full p-2 border rounded"
          >
            <option value="">All</option>
            <option value="S">Small (S)</option>
            <option value="M">Medium (M)</option>
            <option value="L">Large (L)</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Filter by Max Price</h3>
          <input
            type="range"
            min={0}
            max={500}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-sm mt-1">Up to ${maxPrice}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Search by Name</h3>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </aside>

      {/* Product Grid */}
      <main className="md:w-5/6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filterProducts.map((product) => {
          const sizeLabels = product.size
            .map((s) => Object.keys(s)[0])
            .join(", ");
          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="border p-2 rounded shadow-sm bg-white hover:shadow-md transition h-40"
            >
              <div>
                <div className="cursor-pointer flex flex-row">
                  <img src={product.image[0]} alt="" className="w-10" />
                  <div className="flex-col ml-4">
                    <h4 className="font-semibold text-lg">{product.name}</h4>
                    <p className="text-sm text-gray-600">Sizes: {sizeLabels}</p>
                    <p className="text-sm font-medium text-gray-800">
                      ${product.price}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {filterProducts.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No products match the filters.
          </p>
        )}
      </main>
    </div>
  );
}
