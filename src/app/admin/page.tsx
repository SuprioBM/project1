"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  size: Record<string, number>; // size-quantity object
  price: number;
  category: string;
  image: string[]; // array of image URLs
  link: string;
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

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form data for add/edit product
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    size: {},
    price: 0,
    category: "",
    image: [],
    link: "",
  });

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

  // Open modal for adding a new product
  const openAddModal = () => {
    setFormData({
      name: "",
      size: {},
      price: 0,
      category: "",
      image: [],
      link: "",
    });
    setEditingProduct(null);
    setModalOpen(true);
  };

  // Open modal for editing a product
  const openEditModal = (product: Product) => {
    setFormData({
      name: product.name,
      size: product.size,
      price: product.price,
      category: product.category,
      image: product.image,
      link: product.link,
    });
    setEditingProduct(product);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  // Handle delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      alert("Product name is required");
      return;
    }
    if (!formData.category.trim()) {
      alert("Category is required");
      return;
    }
    if (formData.price <= 0) {
      alert("Price must be greater than 0");
      return;
    }
    // Validate sizes
    if (
      Object.keys(formData.size).length === 0 ||
      Object.entries(formData.size).some(
        ([sizeLabel, qty]) => !sizeLabel.trim() || qty <= 0
      )
    ) {
      alert("Please add at least one size with quantity greater than 0");
      return;
    }
    if (formData.image.length === 0) {
      alert("Please add at least one image URL");
      return;
    }

    try {
      if (editingProduct) {
        // Update product
        const res = await axios.put(
          `/api/products/${editingProduct.id}`,
          formData
        );
        // Update local state
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? res.data : p))
        );
      } else {
        // Add new product
        const res = await axios.post("/api/products", formData);
        setProducts((prev) => [...prev, res.data]);
      }

      closeModal();
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Failed to save product");
    }
  };

  // Helper to update size keys or values dynamically
  const updateSizeKey = (oldKey: string, newKey: string) => {
    newKey = newKey.toUpperCase().trim();
    if (!newKey) return;

    setFormData((prev) => {
      const newSize = { ...prev.size };
      if (newKey === oldKey) return prev; // no change
      if (newSize[newKey] !== undefined) {
        alert("Size label already exists");
        return prev;
      }
      const val = newSize[oldKey];
      delete newSize[oldKey];
      newSize[newKey] = val;
      return { ...prev, size: newSize };
    });
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
              <button
                onClick={openAddModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
              >
                + Add Product
              </button>
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
                      {product.category}
                    </p>

                    <p className="text-gray-700 mt-1">
                      Sizes:{" "}
                      {Object.entries(product.size)
                        .map(([size, qty]) => `${size}: ${qty}`)
                        .join(", ")}
                    </p>

                    <p className="mt-2 font-semibold text-gray-900">
                      ${product.price}
                    </p>

                    <div className="flex space-x-2 mt-5">
                      <button
                        onClick={() => openEditModal(product)}
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Checkout Data</h2>
              <div className="text-lg font-semibold text-gray-800">
                Total: $
                {orders
                  .reduce((totalSum, order) => {
                    return (
                      totalSum +
                      order.products.reduce(
                        (orderTotal, item) =>
                          orderTotal + item.price * item.quantity,
                        0
                      )
                    );
                  }, 0)
                  .toFixed(2)}
              </div>
            </div>

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
                              {(item.quantity * item.price).toFixed(2)}
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-auto p-6 relative">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Price</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              {/* Sizes & Quantities */}
              <div>
                <label className="block font-semibold mb-2">
                  Sizes & Quantities
                </label>
                {Object.entries(formData.size).map(([sizeLabel, quantity]) => (
                  <div
                    key={sizeLabel}
                    className="flex items-center mb-2 space-x-2"
                  >
                    <input
                      type="text"
                      value={sizeLabel}
                      onChange={(e) => updateSizeKey(sizeLabel, e.target.value)}
                      className="w-20 p-1 border rounded"
                      placeholder="Size"
                      required
                    />
                    <input
                      type="number"
                      min={0}
                      value={quantity}
                      onChange={(e) => {
                        const newQty = Number(e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          size: { ...prev.size, [sizeLabel]: newQty },
                        }));
                      }}
                      className="w-20 p-1 border rounded"
                      placeholder="Quantity"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => {
                          const newSize = { ...prev.size };
                          delete newSize[sizeLabel];
                          return { ...prev, size: newSize };
                        });
                      }}
                      className="text-red-600 font-bold"
                      title="Remove size"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      size: { ...prev.size, "": 0 },
                    }))
                  }
                  className="mt-2 text-blue-600 underline"
                >
                  + Add Size
                </button>
              </div>

              <div>
                <label className="block font-semibold mb-1">Image URLs</label>
                <textarea
                  value={formData.image.join("\n")}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      image: e.target.value
                        .split("\n")
                        .map((url) => url.trim())
                        .filter(Boolean),
                    }))
                  }
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                  placeholder="One image URL per line"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Product Link</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, link: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://example.com/product"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  {editingProduct ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
