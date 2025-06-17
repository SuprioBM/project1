"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import TriangleLoader from "../../../components/components/Loader";

interface SizeObject {
  [key: string]: number;
}

interface Product {
  id: string;
  name: string;
  size: SizeObject; // ✅ FIXED: changed from SizeObject[] to just SizeObject
  price: number;
  category: string;
  image: string[]; // Assuming a single image URL string
  link: string;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [filtered, setFiltered] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [maxPrice, setMaxPrice] = useState(500);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!slug) {
      console.error("Category is undefined!");
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true); // ✅ start loading
        const res = await fetch(`/api/products/category/${slug}`);
        const data: Product[] = await res.json();

        const filteredProducts = data.filter((product) => {
          const isMatchingSize =
            !selectedSize ||
            (product.size && Object.keys(product.size).includes(selectedSize));
          const isWithinMaxPrice = product.price <= maxPrice;
          const isNameMatchingSearch = product.name
            .toLowerCase()
            .includes(search.toLowerCase());

          return isMatchingSize && isWithinMaxPrice && isNameMatchingSearch;
        });

        setFiltered(filteredProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false); // ✅ stop loading
      }
    };
    

    fetchProducts();
  }, [slug, selectedSize, maxPrice, search]);

  return (
    <div className="flex flex-col md:flex-row px-4 py-10 gap-6">
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
            <option value="XL">Extra Large (XL)</option>
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
      <main className="w-full md:w-5/6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <TriangleLoader />
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((product) => (
            <Link href={`/products/${product.link}`} key={product.id}>
              <div className="border p-4 rounded shadow-sm bg-white hover:shadow-md transition">
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-full h-64 object-cover mb-4"
                />
                <h4 className="font-semibold text-lg">{product.name}</h4>
                <p>
                  Size:{" "}
                  {product.size
                    ? Object.entries(product.size)
                        .map(([label, quantity]) => `${label}-${quantity}`)
                        .join(", ")
                    : "N/A"}
                </p>
                <p className="mt-1 font-semibold">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products match the filters.
          </p>
        )}
      </main>
    </div>
  );
}
