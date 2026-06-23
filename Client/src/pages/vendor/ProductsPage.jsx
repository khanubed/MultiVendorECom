
import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, Edit3, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { productAPI } from "../../services/api";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", stock: "", category: "Electronics" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));
  }, [products, productSearch]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productAPI.getVendorProducts();
        const data = res?.data?.data ?? res?.data ?? [];
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load vendor products', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProductId(product.id);
      setForm({ name: product.name, price: product.price, stock: product.stock, category: product.category });
    } else {
      setEditingProductId(null);
      setForm({ name: "", price: "", stock: "", category: "Electronics" });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      await productAPI.deleteProduct(id);
      setProducts((prev) => prev.filter(p => (p._id || p.id) !== id));
    } catch (err) {
      console.error('Failed to delete product', err);
      alert('Failed to delete product');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingProductId) {
      setProducts(products.map(p => p.id === editingProductId ? { ...p, ...form, price: parseFloat(form.price), stock: parseInt(form.stock) } : p));
    } else {
      setProducts([...products, { id: `p_${Date.now()}`, ...form, price: parseFloat(form.price), stock: parseInt(form.stock) }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-[24px] overflow-hidden shadow-xs">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search items by product title..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
          />
        </div>
        <Link
          to = '/vendor/products/add'
          className="bg-slate-900 text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 cursor-pointer shadow-sm active:scale-98 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Inventory Item
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 font-bold uppercase tracking-wider text-slate-400">
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Unit Cost</th>
              <th className="p-4">Stock Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {loading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">Loading products...</td>
              </tr>
            )}

            {error && !loading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-rose-600">{error}</td>
              </tr>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">No products found</td>
              </tr>
            )}

            {!loading && !error && filteredProducts.map((p) => {
              const id = p._id || p.id;
              const price = (p.price ?? p.unitPrice ?? 0);
              return (
                <tr key={id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">{p.name}</td>
                  <td className="p-4 text-slate-500">{p.category}</td>
                  <td className="p-4 font-semibold">${parseFloat(price).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${p.stock < 30 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
                      {p.stock} Units In Stock
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1 whitespace-nowrap">
                    <Link to= {`/vendor/products/edit/${id}`}  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"><Edit3 className="w-3.5 h-3.5"/></Link>
                    <button onClick={() => handleDelete(id)} className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 className="w-3.5 h-3.5"/></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* INLINE CONTEXT DIALOG MODAL */}
      {/* {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-[24px] border border-slate-100 shadow-xl p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 cursor-pointer"><X className="w-4 h-4"/></button>
            <h3 className="text-base font-extrabold text-slate-900 mb-6">{editingProductId ? "Modify Product Listing" : "Add New Catalog Entry"}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Product Title Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 outline-none focus:bg-white" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Unit Retail Price ($)</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 outline-none focus:bg-white" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Inventory Stock Count</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 outline-none focus:bg-white" required />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Category Group Classification</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-700 outline-none cursor-pointer focus:bg-white">
                  <option value="Electronics">Electronics</option>
                  <option value="Home & Living">Home & Living</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <button type="submit" className="w-full mt-4 bg-slate-900 text-white rounded-xl py-3 text-xs font-bold hover:bg-slate-800 transition-all">Save Changes</button>
            </form>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ProductsPage;