import React from "react";
import HeroSection from "../components/HeroSection";
import Collection from "../components/Collection";
import Info from "../components/Info";
import ProductSale from "../components/ProductSale";

function Home() {
  return (
    <div>
      <HeroSection />
      <Collection />
      <Info />
    </div>
  );
}

export default Home;
