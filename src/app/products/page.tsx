"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import TriangleLoader from "../../components/components/Loader";// ✅ import loader

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
  const [loading, setLoading] = useState(true); // ✅ loading state
  const [selectedSize, setSelectedSize] = useState("");
  const [maxPrice, setMaxPrice] = useState(500);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // ✅ start loading
        const res = await axios.get("/api/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false); // ✅ stop loading
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
    <div className="flex flex-col md:flex-row px-4 py-10 gap-8 max-w-7xl mx-auto">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-1/5 bg-gray-50 p-4 rounded-lg border shadow-sm space-y-6">
        {/* ... filter inputs unchanged ... */}
        <div>
          <h3 className="font-semibold mb-2 text-sm text-gray-700">
            Filter by Size
          </h3>
          <select
            onChange={(e) => setSelectedSize(e.target.value)}
            value={selectedSize}
            className="w-full p-2 border rounded text-sm"
          >
            <option value="">All Sizes</option>
            <option value="S">Small (S)</option>
            <option value="M">Medium (M)</option>
            <option value="L">Large (L)</option>
            <option value="XL">Extra Large (XL)</option>
            <option value="XXL">Double XL (XXL)</option>
          </select>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-sm text-gray-700">
            Max Price
          </h3>
          <input
            type="range"
            min={0}
            max={500}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs mt-1 text-gray-500">Up to ${maxPrice}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-sm text-gray-700">Search</h3>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded text-sm"
          />
        </div>
      </aside>

      {/* Product Grid */}
      <main className="md:w-4/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <TriangleLoader />
          </div>
        ) : filterProducts.length > 0 ? (
          filterProducts.map((product) => {
            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="border rounded-lg shadow-sm bg-white hover:shadow-md transition p-4 flex flex-col"
              >
                <div className="relative w-full h-48 rounded-md overflow-hidden mb-4">
                  <Image
                    src={product.image?.[0] || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h4 className="font-semibold text-base mb-1 truncate">
                  {product.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {" "}
                  Size:{" "}
                  {product.size
                    ? Object.entries(product.size)
                        .map(([label, quantity]) => `${label}-${quantity}`)
                        .join(", ")
                    : "N/A"}
                </p>
                <p className="text-sm font-medium text-gray-900 mt-auto">
                  ${product.price}
                </p>
              </Link>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500 text-base mt-10">
            No products match the filters.
          </p>
        )}
      </main>
    </div>
  );
}
