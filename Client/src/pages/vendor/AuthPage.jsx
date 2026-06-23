import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Store,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  MapPin,
  Flag,
  Phone,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Unified State Form Schema matching backend requirements
  const [formData, setFormData] = useState({
    vendorName: "",
    storeName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    pincode: "",
    agreeToTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const { login, register } = useAuth();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (formData.password.length < 6) {
      setError(
        "Security baseline constraint: Password must be at least 6 characters.",
      );
      return;
    }

    if (!isLogin && !formData.agreeToTerms) {
      setError(
        "You must accept the Merchant Platform Services Agreement to establish a node.",
      );
      return;
    }

    if (!isLogin) {
      const requiredFields = [
        "vendorName",
        "storeName",
        "email",
        "password",
        "phone",
        "address",
        "city",
        "state",
        "zip",
        "country",
        "pincode",
      ];
      const missingField = requiredFields.find((field) => !formData[field]);
      if (missingField) {
        setError(
          "Please complete all vendor registration fields before continuing.",
        );
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.vendorName,
        storeName: formData.storeName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
        pincode: formData.pincode,
      };

      if (isLogin) {
        const response = await login(
          formData.email,
          formData.password,
          "vendor",
        );
        if (!response.success) {
          setError(response.error);
          return;
        }
      } else {
        const response = await register(payload, "vendor");
        if (!response.success) {
          setError(response.error);
          return;
        }
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/vendor");
      }, 800);
    } catch (err) {
      setError(
        "Authentication handshake rejected. Please check backend network routing parameters.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-y-auto font-sans antialiased">
      {/* BACKGROUND GRAPHIC ORNAMENTATION MATRIX */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-800/40 rounded-full blur-3xl pointer-events-none" />

      {/* Dynamic layout resizing depends on form size profile context */}
      <div
        className={`w-full ${isLogin ? "max-w-[440px]" : "max-w-[540px]"} z-10 space-y-6 my-8 transition-all duration-300`}
      >
        {/* MERCHANDISE PORTAL ICON & BRANDING HEADER */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
            M
          </div>
          <div>
            <h1 className="text-white font-black text-xl tracking-tight">
              Merchant Central Portal
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {isLogin
                ? "Access your secure store administrative terminal node"
                : "Provision a new vendor storefront workspace layer"}
            </p>
          </div>
        </div>

        {/* LOGICAL ALERT CHANNELS */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-xs font-semibold text-rose-400 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-xs font-semibold text-emerald-400 animate-fade-in">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" /> Authorization
            token acquired! Initializing shell profile sync...
          </div>
        )}

        {/* INTERACTIVE FORM ARCHITECTURE CARD */}
        <div className="bg-white border border-slate-200/10 rounded-[24px] p-6 sm:p-8 shadow-2xl space-y-5">
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {/* Context Inputs: Registration Pipeline Fields */}
            {!isLogin && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Field: Legal Vendor Name */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Legal Operator Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="vendorName"
                        value={formData.vendorName}
                        onChange={handleInputChange}
                        placeholder="e.g., Alex Mercer"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                        required={!isLogin}
                      />
                    </div>
                  </div>

                  {/* Field: Digital Storefront Tag Name */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Marketplace Store Identity *
                    </label>
                    <div className="relative">
                      <Store className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleInputChange}
                        placeholder="e.g., Apex Logistics"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </div>

                {/* Field: Phone Contact Node */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Operational Contact Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 019-2834"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                      required={!isLogin}
                    />
                  </div>
                </div>

                {/* Field: Physical Address Registry */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Street Address Node Headquarters *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="742 Evergreen Terrace"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                      required={!isLogin}
                    />
                  </div>
                </div>

                {/* Grid Framework: City & State Location Parameters */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      City Cluster *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Springfield"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                      required={!isLogin}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      State / Province *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="IL"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                      required={!isLogin}
                    />
                  </div>
                </div>

                {/* Grid Framework: Zip Code & Pincode Synchronizer */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Postal Zip Code *
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      placeholder="62704"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                      required={!isLogin}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Regional Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="462001"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                      required={!isLogin}
                    />
                  </div>
                </div>

                {/* Field: Sovereign Country Domain */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Sovereign Country Domain *
                  </label>
                  <div className="relative">
                    <Flag className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="United States / India"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Field: Corporate Email Anchor */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Administrative Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="operator@merchantnode.io"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Field: Access Key Security Phrase Password */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Secret Encryption Password *
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-11 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Conditional Sub-options Array Anchor depending on state conditions */}
            {isLogin ? (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-all cursor-pointer"
                >
                  Forgot access password token?
                </button>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 pt-1.5">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 mt-0.5 rounded border-slate-200 text-slate-900 focus:ring-slate-900 cursor-pointer accent-slate-950 flex-shrink-0"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="text-[11px] leading-relaxed text-slate-400 font-medium select-none"
                >
                  I explicitly authorize and agree to the platform's{" "}
                  <span className="text-slate-800 font-bold underline cursor-pointer">
                    Terms of System Service
                  </span>{" "}
                  and audit disclosure regulations.
                </label>
              </div>
            )}

            {/* Form Execution Pipeline Triggers */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-slate-950 hover:bg-slate-900 disabled:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer group"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin
                    ? "Establish Operational Session"
                    : "Provision Merchant Access Node"}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Flow Context Controls Split Link */}
          <div className="border-t border-slate-100 pt-4 text-center">
            <p className="text-[11px] font-medium text-slate-400">
              {isLogin
                ? "New instance registration operator?"
                : "Already possess system node access validation metrics?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-emerald-600 hover:text-emerald-700 font-bold underline cursor-pointer bg-transparent border-none p-0 ml-1"
              >
                {isLogin
                  ? "Create Merchant Profile Record"
                  : "Log In via Existing Credentials"}
              </button>
            </p>
          </div>
        </div>

        {/* LEGAL SYSTEM DISCLOSURE TAGFOOTER */}
        <p className="text-center text-[10px] text-slate-500 font-medium font-mono uppercase tracking-wider">
          Secured Sandbox Node Cluster &bull; TLS 1.3 Active
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
