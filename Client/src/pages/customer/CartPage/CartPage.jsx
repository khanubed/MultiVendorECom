import React, { useEffect, useState, useMemo } from "react";
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  MapPin,
} from "lucide-react";
import { cartAPI } from "../../../services/api";
import RazorpayCheckout from "../../../components/RazorpayCheckout";
import { toast } from "react-hot-toast";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "India",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Synchronize dynamic updates with backend processing layout
  // Synchronize dynamic updates with backend processing layout
  const handleQuantityChange = async (id, delta) => {
    const targetItem = cartItems.find(
      (item) => item.id === id || item._id === id,
    );
    if (!targetItem) return;

    const currentQty = targetItem.quantity || 1;
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    // 1. Optimistic UI update (Instant calculation adjustment on client view)
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id || item._id === id) {
          return { ...item, quantity: newQty };
        }
        return item;
      }),
    );

    // 2. Persist dynamic volume alteration straight to network interface
    try {
      // FIX: Changed from passing an object to passing two positional parameters
      await cartAPI.updateQuantity(id, newQty);
    } catch (err) {
      toast.error("Failed to sync structural quantity updates.");
      // Rollback modification vector gracefully on communication drop
      fetchCart();
    }
  };
  const fetchCart = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await cartAPI.getCart();
      setCartItems(data.cart || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => item._id !== id && item.id !== id),
    );
    cartAPI
      .removeFromCart(id)
      .catch(() => toast.error("Failed to remove item from cart."));
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    if (promoCode.toUpperCase() === "NEXUS10") {
      setDiscountRate(0.1);
      setPromoSuccess("Code 'NEXUS10' successfully matched (-10%)");
    } else if (promoCode.trim() === "") {
      setPromoError("Please enter a promo code.");
    } else {
      setPromoError("Invalid promo code.");
    }
  };

  const handleAddressChange = (field, value) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveAddress = () => {
    const { fullName, addressLine1, city, postalCode, country } =
      shippingAddress;
    if (!fullName || !addressLine1 || !city || !postalCode || !country) {
      toast.error("Please fill all required fields");
      return;
    }
    setShowAddressForm(false);
    toast.success("Address saved successfully");
  };

  const isAddressValid = () => {
    const { fullName, addressLine1, city, postalCode, country } =
      shippingAddress;
    return fullName && addressLine1 && city && postalCode && country;
  };

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0,
    );
    const discount = subtotal * discountRate;
    const shipping = subtotal > 200 || subtotal === 0 ? 0.0 : 15.0;
    const tax = (subtotal - discount) * 0.08;
    const finalTotal = subtotal - discount + shipping + tax;

    return { subtotal, discount, shipping, tax, finalTotal };
  }, [cartItems, discountRate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-6 py-20 md:px-12 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-sm border border-slate-200">
          <div className="h-5 w-5 rounded-full border-2 border-slate-900 border-t-transparent animate-spin"></div>
          <span className="text-sm font-semibold text-slate-700">
            Loading cart...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-6 py-20 md:px-12 max-w-7xl mx-auto text-center">
        <div className="rounded-3xl bg-rose-50 border border-rose-200 p-8 text-rose-700 shadow-sm">
          <p className="text-sm font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-6 py-12 pt-20 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-8 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Review Your Cart
          </h1>
          <p className="text-slate-500 text-sm">
            Verify items and complete your purchase securely.
          </p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200 rounded-3xl max-w-2xl mx-auto p-6">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <ShoppingBag className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Your cart is empty
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            Add some items to your cart to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => {
              const itemId = item._id || item.id;
              const itemQuantity = item.quantity || 1;
              return (
                <div
                  key={itemId}
                  className="bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col sm:flex-row gap-6 items-center group transition-all duration-300 hover:border-slate-300"
                >
                  <div className="h-24 w-24 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      {item.vendor}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mb-1">
                      {item.name}
                    </h3>
                    <p className="text-slate-500 text-xs">{item.category}</p>
                  </div>

                  <div className="flex flex-row items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
                      <button
                        onClick={() => handleQuantityChange(itemId, -1)}
                        disabled={itemQuantity <= 1}
                        className={`p-1.5 text-slate-500 rounded-lg transition-all 
        ${itemQuantity <= 1 ? "opacity-40 cursor-not-allowed" : "hover:text-slate-900 hover:bg-white cursor-pointer"}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="px-3 text-xs font-bold text-slate-900 min-w-6 text-center">
                        {itemQuantity}
                      </span>

                      <button
                        onClick={() => handleQuantityChange(itemId, 1)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-white transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-24">
                      <p className="text-sm font-black text-slate-900">
                        ${(item.price * itemQuantity).toFixed(2)}
                      </p>
                      {itemQuantity > 1 && (
                        <p className="text-[10px] text-slate-400">
                          ${item.price.toFixed(2)} each
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemoveItem(itemId)}
                      className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-6">
            {/* Shipping Address Card */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Shipping Address
              </h3>

              {!showAddressForm && isAddressValid() ? (
                <div className="space-y-2 text-xs mb-4">
                  <p className="font-semibold text-slate-900">
                    {shippingAddress.fullName}
                  </p>
                  <p className="text-slate-600">
                    {shippingAddress.addressLine1}
                  </p>
                  {shippingAddress.addressLine2 && (
                    <p className="text-slate-600">
                      {shippingAddress.addressLine2}
                    </p>
                  )}
                  <p className="text-slate-600">
                    {shippingAddress.city}, {shippingAddress.postalCode}
                  </p>
                  <p className="text-slate-600">{shippingAddress.country}</p>
                </div>
              ) : null}

              {showAddressForm ? (
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      handleAddressChange("fullName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Address Line 1 *"
                    value={shippingAddress.addressLine1}
                    onChange={(e) =>
                      handleAddressChange("addressLine1", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Address Line 2 (Optional)"
                    value={shippingAddress.addressLine2}
                    onChange={(e) =>
                      handleAddressChange("addressLine2", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-slate-400"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="City *"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Postal Code *"
                      value={shippingAddress.postalCode}
                      onChange={(e) =>
                        handleAddressChange("postalCode", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-slate-400"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Country *"
                    value={shippingAddress.country}
                    onChange={(e) =>
                      handleAddressChange("country", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-slate-400"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveAddress}
                      className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 cursor-pointer"
                    >
                      Save Address
                    </button>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="flex-1 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full py-2 text-slate-900 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  {isAddressValid() ? "Change Address" : "Add Address"}
                </button>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Order Summary
              </h2>

              <div className="flex flex-col gap-3 pb-4 border-b border-slate-100 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">
                    ${totals.subtotal.toFixed(2)}
                  </span>
                </div>

                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-${totals.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-800">
                    {totals.shipping === 0
                      ? "Free"
                      : `$${totals.shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Tax (8%)</span>
                  <span className="font-semibold text-slate-800">
                    ${totals.tax.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-4 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Total
                  </span>
                  <p className="text-2xl font-black text-slate-900 leading-tight">
                    ${totals.finalTotal.toFixed(2)}
                  </p>
                </div>
              </div>

              {isAddressValid() ? (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:bg-slate-800 shadow-md cursor-pointer group"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 text-center">
                  Please add a shipping address to proceed
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Razorpay Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Checkout</h2>

            <div className="mb-6 p-4 bg-slate-50 rounded-lg text-xs text-slate-600 space-y-2">
              <p>
                <strong>Items:</strong> {cartItems.length}
              </p>
              <p>
                <strong>Total:</strong> ${totals.finalTotal.toFixed(2)}
              </p>
            </div>

            <RazorpayCheckout
              cartItems={cartItems}
              totals={totals}
              shippingAddress={shippingAddress}
              onSuccess={(order) => {
                setShowCheckout(false);
                setCartItems([]);
                toast.success("Order placed successfully!");
              }}
              onCancel={() => setShowCheckout(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
