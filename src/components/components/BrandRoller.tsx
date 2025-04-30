"use client";

import React from "react";
import { Marquee } from "../magicui/marquee";

const brands = [
  "Nike",
  "Adidas",
  "Puma",
  "Reebok",
  "Under Armour",
  "Asics",
  "New Balance",
  "Vans",
];

const BrandRoller = () => {
  return (
    <div className="overflow-hidden relative w-full">
      <div className="flex animate-scroll whitespace-nowrap">
        <Marquee>
          {brands.map((brand, index) => (
            <div
              key={index}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white px-4 sm:px-6 md:px-8 py-6 md:py-10 bg-black"
            >
              {brand}
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default BrandRoller;
