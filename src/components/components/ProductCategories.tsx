// components/ProductCategories.tsx
import React from "react";

const categories = [
  { name: "Men's Fashion",
     image: "/men's fashion.jpg", 
     link: "/category/men" },
  {
    name: "Women's Fashion",
    image: "/women.webp",
    link: "/category/women",
  },
  {
    name: "Accessories",
    image: "/assecories.jpg",
    link: "/category/accessories",
  },
];

const ProductCategories = () => {
  return (
    <section className="py-16 bg-gray-100" id="shop-now">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.name} className="relative group">
              <a href={category.link}>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-60 object-cover rounded-lg shadow-lg transition duration-300 ease-in-out transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-40 rounded-lg group-hover:opacity-50"></div>
                <h3 className="absolute bottom-4 left-4 text-white text-2xl font-semibold">
                  {category.name}
                </h3>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
