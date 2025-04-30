// components/HeroSection.tsx
import React from "react";
import BrandRoller from "./BrandRoller";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative w-full bg-cover bg-center bg-hero-image">
      <div className="absolute inset-0">
        <Image
          src="/bg.jpg"
          alt=""
          fill
          quality={100}
          priority
          className="object-cover "
        />
      </div>
      {/* Dark overlay */}
      <div className="relative container mx-auto px-6 py-55 flex flex-col justify-center items-start gold">
        <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-4">
          Discover the Latest Fashion Trends
        </h1>
        <p className="text-xl sm:text-2xl mb-8 text-white">
          Shop the hottest styles for every season with free shipping.
        </p>
        <div className="flex space-x-4">
          <a
            href="#shop-now"
            className="px-6 py-3 bg-primary text-white text-lg font-semibold rounded-md hover:bg-primary-dark transition duration-300"
          >
            Shop Now
          </a>
          <a
            href="#explore"
            className="px-6 py-3 border-2 border-white text-white text-lg font-semibold rounded-md hover:bg-white hover:text-black transition duration-300"
          >
            Explore Trends
          </a>
        </div>
      </div>
      <div className="-mt-24 sm:-mt-20 lg:-mt-3">
        <BrandRoller />
      </div>
    </section>
  );
};

export default HeroSection;
