import React from "react";
import HeroSection from "./components/HeroSection";
import ProductGrid from "./components/ProductGrid";
import VendorSpotlights from "./components/VendorSpotlights";

const HomePage = () => {
  return (
    <main className="pt-32 pb-xl px-margin-desktop max-w-[1440px] mx-auto">
      <HeroSection />
      <ProductGrid />
      <VendorSpotlights />
    </main>
  );
};

export default HomePage;