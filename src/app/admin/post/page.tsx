"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const AdminPostPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [form, setForm] = useState<{
      id: string;
      name: string;
      description: string;
      price: string;
      link: string;
      category: string;
      sizeInput: string;
      imageUrls: string[]; // Explicitly define as string[]
    }>({
      id: "",
      name: "",
      description: "",
      price: "",
      link: "",
      category: "men",
      sizeInput: "",
      imageUrls: [], // URLs of images uploaded to Cloudinary
    });

  const [images, setImages] = useState<File[]>([]); // Selected images
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Preview URLs

  const [isFormValid, setIsFormValid] = useState(false); // To enable/disable submit button

  useEffect(() => {
    if (id) {
      if (typeof id === "string") {
        fetchProduct(id); // Fetch product data if there's an ID in the URL
      }
    }
  }, [id]);

  useEffect(() => {
    // Check if all required fields are filled and images are uploaded
    if (
      form.name &&
      form.description &&
      form.price &&
      form.link &&
      form.sizeInput &&
      form.imageUrls.length > 0
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [form, images, imagePreviews]);

  const fetchProduct = async (productId: string) => {
    try {
      const res = await axios.get(`/api/products/${productId}`);
      const product = res.data;
      const sizeInput = product.size
        .map((s: any) => {
          const key = Object.keys(s)[0];
          const value = s[key];
          return `${key}-${value}`;
        })
        .join(",");
      setForm({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        link: product.link,
        category: product.category,
        sizeInput: sizeInput,
        imageUrls: product.image,
      });
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      // Display the image previews immediately
      
      // Upload the images to Cloudinary
      try {
          const uploadedUrls = await uploadImagesToCloudinary(selectedFiles);
          setForm((prevForm) => ({
              ...prevForm,
              imageUrls: uploadedUrls, // Store uploaded image URLs
            }));
           setImagePreviews(uploadedUrls);
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    }
  };

  const uploadImagesToCloudinary = async (files: File[]) => {
    const cloudinaryUrls: string[] = [];

    // Prepare the form data for Cloudinary upload
    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "FashionValley");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dichjqacx/image/upload",
          formData
        );
        cloudinaryUrls.push(response.data.secure_url); // Add the uploaded image URL
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
      }
    }
    return cloudinaryUrls; // Return the URLs of uploaded images
  };

  const handleSubmit = async () => {
    const sizeArray = form.sizeInput.split(",").map((item) => {
      const [key, value] = item.split("-");
      return { [key]: parseInt(value) };
    });

    const productData = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      link: form.link,
      category: form.category,
      size: sizeArray,
      image: form.imageUrls,
    };

    if (form.id) {
      // If there's an ID, update the existing product
      await axios.put(`/api/products/${form.id}`, productData);
    } else {
      // If no ID, create a new product
      await axios.post("/api/products", productData);
    }

    // After submission, redirect back to the admin products page
    router.push("/admin");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {form.id ? "Edit" : "Add"} Product
      </h2>
      <div className="space-y-2">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleFormChange}
          className="border p-2 w-full"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleFormChange}
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleFormChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="link"
          placeholder="Link"
          value={form.link}
          onChange={handleFormChange}
          className="border p-2 w-full"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleFormChange}
          className="border p-2 w-full"
        >
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="accessories">Accessories</option>
        </select>
        <input
          type="text"
          name="sizeInput"
          placeholder="Sizes (e.g. S-3,M-2)"
          value={form.sizeInput}
          onChange={handleFormChange}
          className="border p-2 w-full"
        />

        {/* Image File Input */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="border p-2 w-full"
        />

        {/* Display Image Previews */}
        <div className="mt-2">
          {imagePreviews.length > 0 && (
            <div className="flex space-x-2">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Image preview ${index}`}
                  className="h-auto w-auto object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`bg-green-600 text-white px-4 py-2 rounded mt-2 ${
            !isFormValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {form.id ? "Update" : "Add"} Product
        </button>
      </div>
    </div>
  );
};

export default AdminPostPage;
