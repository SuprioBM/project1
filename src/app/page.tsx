// pages/index.tsx or components/HomePage.tsx
import React from "react";
import HeroSection from "../components/components/HeroSection";
import ProductCategories from "../components/components/ProductCategories";
import FeaturedProducts from "../components/components/FeaturedProducts";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <ProductCategories />
      <FeaturedProducts />
    </>
  );
};

export default HomePage;
