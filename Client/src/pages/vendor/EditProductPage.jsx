import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  Save,
  Trash2,
} from "lucide-react";

// Mock Database Repository for local structural demonstration
const MOCK_DATABASE = [
  {
    id: "p1",
    name: "Premium Artisan Stoneware Plate",
    price: 34.99,
    description:
      "Hand-thrown ceramic plate finished in a durable matte charcoal glaze. Safe for microwave and dishwasher operations.",
    imageUrl:
      "https://images.unsplash.com/photo-1610701596007-11502861ecfa?q=80&w=600",
    badge: "Premium",
    isFeatured: true,
    category: "Home & Living",
    stock: 142,
  },
  {
    id: "p2",
    name: "Ergonomic Mechanical Keyboard",
    price: 189.99,
    description:
      "Hot-swappable linear switch setup equipped with gasket-mounted aluminum frame housing.",
    imageUrl:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600",
    badge: "New Arrival",
    isFeatured: false,
    category: "Electronics",
    stock: 28,
  },
];

const EditProductPage = () => {
  const { id } = useParams(); // Extract structural entry node ID from route string parameters
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    badge: "",
    isFeatured: false,
    category: "",
    stock: 0,
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // SIMULATED REMOTE DATABASE RETRIEVAL FETCH PIPELINE
  useEffect(() => {
    const fetchProductRecord = async () => {
      setInitialLoading(true);
      try {
        // In production architecture, swap this mock execution block with your remote API layer:
        // const response = await fetch(`/api/products/${id}`);
        // const data = await response.json();

        await new Promise((resolve) => setTimeout(resolve, 800)); // Network latency simulation
        const dynamicRecord = MOCK_DATABASE.find((item) => item.id === id);

        if (!dynamicRecord) {
          setError(
            "Requested product record target could not be localized within database cluster.",
          );
          return;
        }

        // Map schema object configuration keys into local mutable element states
        setFormData({
          name: dynamicRecord.name,
          price: dynamicRecord.price.toString(),
          description: dynamicRecord.description,
          imageUrl: dynamicRecord.imageUrl,
          badge: dynamicRecord.badge || "",
          isFeatured: dynamicRecord.isFeatured,
          category: dynamicRecord.category,
          stock: dynamicRecord.stock,
        });
      } catch (err) {
        setError(
          "Network interface anomaly detected while pulling upstream metadata schema variables.",
        );
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProductRecord();
  }, [id]);

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

    // Front-end schema assurance checkpoints
    if (formData.name.length > 100) {
      setError("Product name cannot exceed 100 characters.");
      return;
    }
    if (parseFloat(formData.price) < 0) {
      setError("Price validation failure: Negative balances are restricted.");
      return;
    }
    if (parseInt(formData.stock) < 0) {
      setError("Stock allocation baseline metrics cannot be less than 0.");
      return;
    }

    setSaveLoading(true);

    try {
      // Cast local form parameters to target schema database primitive types
      const cleanPayload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        badge: formData.badge.trim() === "" ? null : formData.badge.trim(),
      };

      console.log(
        `Transmitting Mutated Schema Updates for Document Node [${id}]:`,
        cleanPayload,
      );

      // Simulated network update transmission cycle
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => navigate("/vendor/products"), 1400);
    } catch (err) {
      setError(
        "Database persistence pipeline rejected the tracking modification update bundle.",
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteAsset = () => {
    if (
      window.confirm(
        "CRITICAL WARNING: Are you certain you want to purge this database document listing permanently?",
      )
    ) {
      console.log(
        `Executing absolute document purge command on reference node ID: ${id}`,
      );
      navigate("/vendor/products");
    }
  };

  // INITIAL STREAM RETRIEVAL SKELETON LOADER STATE
  if (initialLoading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
        <span className="h-6 w-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
        <p className="text-xs font-bold uppercase tracking-wider">
          Syncing Schema Data Matrix...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER CONTROLS NAVIGATION */}
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
              Modify Listing
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Mutate document parameters mapping directly to Object ID:{" "}
              <span className="font-mono text-slate-500 font-semibold">
                {id}
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDeleteAsset}
          className="bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-rose-600 rounded-xl px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 hover:text-rose-700 transition-all cursor-pointer shadow-2xs active:scale-98"
        >
          <Trash2 className="w-3.5 h-3.5" /> Purge Asset Document
        </button>
      </div>

      {/* DYNAMIC OPERATION ALERTS */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-xs font-semibold text-rose-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-xs font-semibold text-emerald-600">
          <CheckCircle className="w-4 h-4 flex-shrink-0" /> Update criteria
          broadcast committed to the server cluster! Returning to node tree...
        </div>
      )}

      {/* MODIFICATION CONTROL INTERFACE CANVAS */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* INPUT INPUT CONTROLS SECTION */}
        <div className="md:col-span-2 space-y-5">
          <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 sm:p-8 shadow-2xs space-y-5">
            {/* Input Parameter: Name */}
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
                  maxLength={100}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block font-medium text-right">
                {formData.name.length}/100 Character Boundary Caps
              </span>
            </div>

            {/* Pricing Parameters & Supply Trackers */}
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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Active Stock Level Allocation *
                </label>
                <div className="relative">
                  <Layers className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Operational Nodes: Categorization and Merchandising Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Category Classification Node *
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
                    <option value="Electronics">Electronics</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Apparel & Leather">Apparel & Leather</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Visual Badge Overlay Tag
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

            {/* Input Parameter: Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Detailed Product Description Copy *
              </label>
              <div className="relative">
                <FileText className="absolute top-4 left-4 h-4 w-4 text-slate-400" />
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pt-3.5 pb-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white resize-none leading-relaxed"
                  required
                ></textarea>
              </div>
            </div>

            {/* Media CDN Uniform Links Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                CDN Image Hosted URL *
              </label>
              <div className="relative">
                <ImageIcon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT TRACK: LIVE RENDER PERSPECTIVE ENGINE */}
        <div className="md:col-span-1 space-y-5">
          {/* Card Engine Matrix Layout Block */}
          <div className="bg-white border border-slate-200/60 rounded-[24px] p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Layout Canvas View
            </h3>

            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50 group transition-all">
              <div className="h-40 bg-slate-100 relative flex items-center justify-center text-slate-400 overflow-hidden">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Canvas Render Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-[11px] font-medium">
                    <ImageIcon className="w-5 h-5 stroke-1" />
                    <span>Media Stream Missing</span>
                  </div>
                )}

                {formData.badge && (
                  <span className="absolute top-3 left-3 bg-slate-950 text-white text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md shadow-xs">
                    {formData.badge}
                  </span>
                )}
              </div>

              <div className="p-4 space-y-1 bg-white border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                  {formData.category || "Unassigned Module"}
                </span>
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {formData.name || "Untitled Reference"}
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

            {/* Bento Grid High Priority Toggle Switch Checkbox */}
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800 block">
                  Promote to Bento Grid
                </label>
                <p className="text-[10px] text-slate-400 font-medium">
                  Force prioritize display visibility loops.
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

          {/* Core Save Form Operation CTA Action Desk */}
          <div className="space-y-2">
            <button
              type="submit"
              disabled={saveLoading}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer group"
            >
              {saveLoading ? (
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" /> Commit Schema Changes
                </>
              )}
            </button>
            <Link
              to="/vendor/products"
              className="w-full py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer text-center"
            >
              Discard System Alterations
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
