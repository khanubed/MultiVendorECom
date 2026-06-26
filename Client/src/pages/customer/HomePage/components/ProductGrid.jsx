import React, { useState, useEffect } from "react";
import { ArrowRight, Plus } from "lucide-react";
// Import your API service here (adjust path/name as needed)
import { productAPI } from "../../../../services/api"; 

const ProductGrid = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Replace with your actual Axios/Fetch call
        const { data } = await productAPI.getFeaturedProducts();
        // const response = await fetch("/api/products/featured");
        // const data = await response.json();
        
        if (data.success) {
          setFeaturedProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="py-12 text-center text-on-surface-variant animate-pulse">
        Loading featured collections...
      </div>
    );
  }

  // If API returns no products, hide the section entirely
  if (featuredProducts.length === 0) return null;

  // Separate the first product for the large card, and the rest for the small cards
  const mainProduct = featuredProducts[0];
  const sideProducts = featuredProducts.slice(1, 3);

  return (
    <section className="mb-12">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-primary">
            Featured Highlights
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Top-tier selections handpicked for you.
          </p>
        </div>
        <button className="text-secondary font-bold flex items-center gap-1 hover:gap-2 transition-all text-label-md font-label-md">
          View All Products <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Container */}
      <div className="bento-grid grid grid-cols-12 gap-6">
        
        {/* Large Feature Card (Index 0) */}
        {mainProduct && (
          <div className="col-span-12 lg:col-span-6 premium-card p-0 flex flex-col group overflow-hidden border rounded-2xl">
            <div className="h-80 relative overflow-hidden">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={mainProduct.imageUrl}
                alt={mainProduct.name}
              />
              {mainProduct.badge && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-label-md font-label-md font-bold">
                  {mainProduct.badge}
                </div>
              )}
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-headline-md font-headline-md font-bold text-xl truncate pr-4">
                  {mainProduct.name}
                </h3>
                <span className="text-headline-md font-headline-md text-secondary font-bold">
                  ${mainProduct.price.toFixed(2)}
                </span>
              </div>
              <p className="text-body-md text-on-surface-variant mb-6 line-clamp-2">
                {mainProduct.description}
              </p>
              <button className="w-full py-3 mt-auto bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all">
                Add to Cart
              </button>
            </div>
          </div>
        )}

        {/* Medium Feature Cards (Index 1 and 2) */}
        {sideProducts.map((product) => (
          <div 
            key={product.id} 
            className="col-span-12 md:col-span-6 lg:col-span-3 premium-card p-6 flex flex-col group border rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="aspect-square rounded-xl overflow-hidden mb-4 relative">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={product.imageUrl}
                alt={product.name}
              />
              {product.badge && (
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-800">
                  {product.badge}
                </div>
              )}
            </div>
            <h4 className="font-bold text-lg mb-1 truncate" title={product.name}>
              {product.name}
            </h4>
            <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
            <div className="mt-auto flex justify-between items-center">
              <span className="font-bold text-secondary">${product.price.toFixed(2)}</span>
              <button className="p-2 border border-outline-variant rounded-full hover:bg-secondary hover:text-white transition-all flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
      </div>
    </section>
  );
};

export default ProductGrid;