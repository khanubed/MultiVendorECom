import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Package,
  DollarSign,
  Layers,
  Tag,
  Image as ImageIcon,
  FileText,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Plus,
} from "lucide-react";
import { productAPI } from "../../services/api";

const CreateProductPage = () => {
  const navigate = useNavigate();

  // Initialize state based directly on Mongoose Schema specifications
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    badge: "", // maps to string or null
    isFeatured: false,
    category: "",
    stock: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Standard input state mutator mapping types properly
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (formData.name.length > 100) {
      setError("Product name cannot exceed 100 characters.");
      return;
    }
    if (parseFloat(formData.price) <= 0) {
      setError("Price structural assignment must be greater than 0.");
      return;
    }
    if (parseInt(formData.stock) < 0) {
      setError("Stock allocation baseline metrics cannot be less than 0.");
      return;
    }

    setLoading(true);

    try {
      const cleanPayload = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim(),
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        badge: formData.badge.trim() === "" ? undefined : formData.badge.trim(),
        isFeatured: formData.isFeatured,
      };

      // Extract token to pass it downstream if no global interceptor is active
      const token = localStorage.getItem("token");

      // Pass config with auth header as the second argument for POST requests in Axios
      const response = await productAPI.createProduct(cleanPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Axios pre-parses responses into the data object
      const result = response.data;

      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate("/vendor/products"), 1500);
      }
    } catch (err) {
      // Capture the exact error string dispatched by your Express error handlers
      const serverMessage = err.response?.data?.message;
      setError(
        serverMessage ||
          err.message ||
          "Failed to index structural asset record inside system database pipeline.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER CONTROLS BAR */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/vendor/products"
            className="p-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-500 hover:text-slate-900 transition-all shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              Add New Product
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Provision a new operational data asset onto your marketplace node.
            </p>
          </div>
        </div>
      </div>

      {/* DYNAMIC LOGICAL STATE MESSAGING CHANNELS */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-xs font-semibold text-rose-600 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-xs font-semibold text-emerald-600 animate-fade-in">
          <CheckCircle className="w-4 h-4 flex-shrink-0" /> Schema transaction
          committed successfully! Re-routing canvas context...
        </div>
      )}

      {/* CORE INPUT STRUCTURAL FRAMEWORK FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* LEFT COLUMN: DATA INPUT VALUES */}
        <div className="md:col-span-2 space-y-5">
          <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 sm:p-8 shadow-2xs space-y-5">
            {/* Field: Product Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Product Title Name *
              </label>
              <div className="relative">
                <Package className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Minimalist Anodized Mechanical Keyboard"
                  maxLength={100}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block font-medium text-right">
                {formData.name.length}/100 Characters Max Bound
              </span>
            </div>

            {/* Fields Row: Pricing & Inventory Stock Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Retail Unit Cost ($) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="89.99"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Initial Stock Allocation *
                </label>
                <div className="relative">
                  <Layers className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="24"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Fields Row: Category & Badging System Labels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Category Classification *
                </label>
                <div className="relative">
                  <Tag className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-bold text-slate-700 outline-none transition-all focus:border-slate-400 focus:bg-white cursor-pointer appearance-none"
                    required
                  >
                    <option value="" disabled>
                      Select Core Node
                    </option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Apparel & Leather">Apparel & Leather</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Visual Badge Tag (Optional)
                </label>
                <div className="relative">
                  <Sparkles className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    name="badge"
                    value={formData.badge}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-bold text-slate-700 outline-none transition-all focus:border-slate-400 focus:bg-white cursor-pointer appearance-none"
                  >
                    <option value="">No Badge Asset Assignment</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Premium">Premium</option>
                    <option value="Limited">Limited Offer</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Field: Description Copy */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Detailed Product Description Specification *
              </label>
              <div className="relative">
                <FileText className="absolute top-4 left-4 h-4 w-4 text-slate-400" />
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide deep architectural overview copy detailing materials, dimensions, and operational system integrations..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pt-3.5 pb-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white resize-none leading-relaxed"
                  required
                ></textarea>
              </div>
            </div>

            {/* Field: Image CDN Uniform Resource Locator URL String */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                CDN Image Hosted URL Address Link *
              </label>
              <div className="relative">
                <ImageIcon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/photo-example-payload..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONFIGURATION SUMMARY & ACTIVE PREVIEW MATRIX */}
        <div className="md:col-span-1 space-y-5">
          {/* Bento Box Node: Interactive Card Visualizer Output */}
          <div className="bg-white border border-slate-200/60 rounded-[24px] p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Storefront Grid Canvas Preview
            </h3>

            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50 group transition-all">
              {/* Asset Display Visual Framing Layer */}
              <div className="h-40 bg-slate-100 relative flex items-center justify-center text-slate-400 overflow-hidden">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Preview Canvas"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-[11px] font-medium">
                    <ImageIcon className="w-5 h-5 stroke-1" />
                    <span>Awaiting Media Context Stream</span>
                  </div>
                )}

                {/* Badge Overlay Anchor Checkpoint */}
                {formData.badge && (
                  <span className="absolute top-3 left-3 bg-slate-950 text-white text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md shadow-xs">
                    {formData.badge}
                  </span>
                )}
              </div>

              {/* Dynamic Text Parameter Layout Interpolator */}
              <div className="p-4 space-y-1 bg-white border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                  {formData.category || "Unassigned Category Node"}
                </span>
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {formData.name || "Untitled Asset Listing"}
                </h4>
                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-xs font-black text-slate-900">
                    $
                    {formData.price
                      ? parseFloat(formData.price).toFixed(2)
                      : "0.00"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {formData.stock} units
                  </span>
                </div>
              </div>
            </div>

            {/* Flag Checkpoint Parameter: Bento Feature Toggle Interface */}
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800 block">
                  Promote to Bento Grid
                </label>
                <p className="text-[10px] text-slate-400 font-medium">
                  Flags item for high-priority marketing layout loops.
                </p>
              </div>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="h-4 w-4 rounded-md border-slate-200 text-slate-900 focus:ring-slate-900 cursor-pointer accent-slate-950"
              />
            </div>
          </div>

          {/* Action Commit Triggers Terminal */}
          <div className="space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 disabled:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer group"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Initialize Production Sync
                </>
              )}
            </button>
            <Link
              to="/vendor/products"
              className="w-full py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer text-center"
            >
              Cancel Asset Staging
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProductPage;
