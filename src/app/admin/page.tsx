// app/admin/page.tsx

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation"
import Link from "next/link";


const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("products");
  const router = useRouter();
  const [products, setProducts] = useState<
    {
      id: string;
      name: string;
      description: string;
      price: number;
      category: string;
      image: string[];
    }[]
  >([]);

  const [orders, setOrders] = useState<
    {
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

    }[]
  >([]);

  const fetchOrders = async () => {
    const res = await axios.get("/api/checkout");
    setOrders(res.data);
  };
  const fetchProducts = async () => {
    const res = await axios.get("/api/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const handleEditProduct = (product: any) => {
    router.push(`/admin/post?id=${product.id}`);
  };

  const handleDeleteProduct = async (id: string) => {
    await axios.delete(`/api/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="p-6 pt-20">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 border rounded ${
            activeTab === "products" ? "bg-blue-500 text-white" : ""
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab("checkout")}
          className={`px-4 py-2 border rounded ${
            activeTab === "checkout" ? "bg-blue-500 text-white" : ""
          }`}
        >
          Checkout
        </button>
      </div>

      {activeTab === "products" ? (
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4">All Products</h2>

          <div className="flex justify-end mb-4">
            <Link
              href="/admin/post"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Product
            </Link>
          </div>
          <ul className="space-y-4 flex flex-row flex-wrap gap-4">
            {products.map((product) => (
              <li key={product.id} className="border p-4 flex flex-row">
                <div className="space-x-2 mt-2">
                  <Image
                    src={product.image[0]}
                    width={50}
                    height={50}
                    alt="Product Image"
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-col ml-5">
                  <h3 className="font-bold">{product.name}</h3>
                  <p>{product.description}</p>
                  <p>Price: ${product.price}</p>
                  <p>Category: {product.category}</p>
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 mt-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded mt-2"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Checkout Data</h2>
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <ul className="space-y-6">
                {orders.map((order) => (
                  <li key={order.id} className="border p-4 rounded">
                    <div className="mb-2">
                      <p>
                        <strong>Name:</strong> {order.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {order.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {order.phone}
                      </p>
                      <p>
                        <strong>Address:</strong> {order.address},{" "}
                        {order.area}, {order.districts} -{" "}
                        {order.postalCode}
                      </p>
                      <p>
                        <strong>Payment Method:</strong> {order.payment}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <h4 className="font-semibold mb-1">Items:</h4>
                    <ul className="space-y-2">
                      {order.products.map((item) => (
                        <li key={item.id} className="text-sm">
                          {item.name} (Size: {item.size}) - Qty: {item.quantity}{" "}
                          × ${item.price} ={" "}
                          <strong>${item.quantity * item.price}</strong>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
