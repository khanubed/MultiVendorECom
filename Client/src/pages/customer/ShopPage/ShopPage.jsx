import React, { useEffect, useState, useMemo } from "react";
import FilterBar from "./components/FilterBar";
import ProductCard from "./components/ProductCard";
import Pagination from "./components/Pagination";
import { productAPI, cartAPI } from "../../../services/api";
import { toast } from "react-hot-toast";
import { SlidersHorizontal, AlertCircle } from "lucide-react"; // Imported AlertCircle for error tracking

const CATEGORIES = ["All", "Apparel", "Electronics", "Living", "Accessories"];
const ITEMS_PER_PAGE = 4;

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCategory, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await productAPI.getAllProducts();
        
        // Handle both cases: if your service returns the raw axios wrapper OR the unwrapped payload
        const productList = response.products || response.data?.products || [];
        setProducts(productList);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await cartAPI.addToCart(productId);
      toast.success("Product added to cart.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to add item to cart.");
    }
  };

  // Core Processing Engine
  const processedProducts = useMemo(() => {
    let collection = [...products];

    // 1. Text Search Input Filters
    if (searchQuery.trim() !== "") {
      const criteria = searchQuery.toLowerCase();
      collection = collection.filter(
        (p) =>
          p.name.toLowerCase().includes(criteria) ||
          p.description.toLowerCase().includes(criteria),
      );
    }

    // 2. Category Pill Filter logic
    if (currentCategory !== "All") {
      collection = collection.filter((p) => p.category === currentCategory);
    }

    // 3. Array Sorting Logic Multi-tier tree
    if (sortBy === "price-asc") {
      collection.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      collection.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      collection.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return collection;
  }, [products, searchQuery, currentCategory, sortBy]);

  // Pagination processing
  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
  const currentGridItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedProducts, currentPage]);

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen mt-10 bg-[#F8FAFC]">
      <main className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        {/* Page Context Heading */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Curated Collections
          </h1>
          <p className="text-slate-500 text-sm">
            Discover premium essentials sourced from independent brands and
            verified vendors worldwide.
          </p>
        </div>

        {/* ERROR DISPLAY BANNER */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-xs font-semibold text-rose-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {/* Segment Controls Filtering Ribbon */}
        <FilterBar
          categories={CATEGORIES}
          currentCategory={currentCategory}
          setCategory={handleCategoryChange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          itemCount={processedProducts.length}
        />

        {/* Grid Canvas Render Tier */}
        {loading ? (
          <div className="text-center py-24 text-sm font-medium text-slate-400">
            Loading storefront engine...
          </div>
        ) : currentGridItems.length === 0 ? (
          <div className="mx-auto max-w-2xl border border-slate-200 rounded-[24px] bg-white py-24 px-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 border border-slate-100">
              <SlidersHorizontal className="h-5 w-5 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No products found
            </h3>
            <p className="mx-auto max-w-sm text-sm text-slate-500">
              We couldn't locate any items matching your active filter criteria
              or search terms. Try modifying your choices.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentGridItems.map((prod) => (
              <ProductCard
                // key={prod.id || prod._id}
                // title={prod.name}
                // price={prod.price}
                // description={prod.description}
                // imgUrl={prod.imageUrl}
                product={prod}
                onAddToCart={() => handleAddToCart(prod.id || prod._id)}
              />
            ))}
          </div>
        )}

        {/* Navigational Control Base */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </main>
    </div>
  );
};

export default ShopPage;