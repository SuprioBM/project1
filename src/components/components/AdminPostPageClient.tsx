"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string[];
}

interface Order {
  id: string;
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
  }[];
  payment: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  area: string;
  districts: string;
  postalCode: string;
}

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<"products" | "checkout">(
    "products"
  );
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch products and orders
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/checkout");
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchProducts();
    fetchOrders();
  }, []);

  // Handlers
  const handleEditProduct = (product: Product) => {
    router.push(`/admin/post?id=${product.id}`);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 pt-20 bg-gray-50">
      {/* Tabs */}
      <div className="flex space-x-4 mb-8 max-w-4xl mx-auto">
        <button
          onClick={() => setActiveTab("products")}
          className={`flex-1 py-2 rounded-md font-semibold border transition ${
            activeTab === "products"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab("checkout")}
          className={`flex-1 py-2 rounded-md font-semibold border transition ${
            activeTab === "checkout"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          Checkout
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {activeTab === "products" ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">All Products</h2>
              <Link
                href="/admin/post"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
              >
                + Add Product
              </Link>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="bg-white border rounded-md shadow-sm hover:shadow-md transition flex flex-col"
                >
                  <div className="relative w-full h-48 overflow-hidden rounded-t-md">
                    <Image
                      src={product.image[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold mb-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 flex-grow">
                      {product.description}
                    </p>

                    <p className="mt-2 font-semibold text-gray-900">
                      ${product.price}
                    </p>
                    <p className="text-sm text-gray-500 mb-3 capitalize">
                      Category: {product.category}
                    </p>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 rounded-md transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">Checkout Data</h2>

            {orders.length === 0 ? (
              <p className="text-center text-gray-500">No orders found.</p>
            ) : (
              <ul className="space-y-6">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="bg-white border rounded-md p-6 shadow-sm"
                  >
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p>
                          <span className="font-semibold">Name:</span>{" "}
                          {order.name}
                        </p>
                        <p>
                          <span className="font-semibold">Email:</span>{" "}
                          {order.email}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span>{" "}
                          {order.phone}
                        </p>
                        <p>
                          <span className="font-semibold">Address:</span>{" "}
                          {order.address}, {order.area}, {order.districts} -{" "}
                          {order.postalCode}
                        </p>
                        <p>
                          <span className="font-semibold">Payment Method:</span>{" "}
                          {order.payment}
                        </p>
                      </div>
                      <div>
                        <p>
                          <span className="font-semibold">Date:</span>{" "}
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Items:</h4>
                      <ul className="space-y-1 text-sm">
                        {order.products.map((item) => (
                          <li key={item.id}>
                            {item.name} (Size: {item.size}) - Qty:{" "}
                            {item.quantity} × ${item.price} ={" "}
                            <strong>
                              ${(item.quantity * item.price).toFixed(2)}
                            </strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
