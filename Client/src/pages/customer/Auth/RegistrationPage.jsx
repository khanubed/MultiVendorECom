import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    if (!formData.agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    const response = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    }, 'customer');

    if (!response.success) {
      setError(response.error);
      return;
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 bg-white border border-slate-200/80 px-3 py-1 rounded-full shadow-2xs">
          Join Our Community
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
          Create Your Account
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Enjoy faster checkouts, order tracking, and exclusive member rewards.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 sm:p-10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Field: Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Input Field: Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@domain.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Input Field: Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Input Field: Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-11 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start gap-2.5 text-xs text-slate-500 font-medium">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="mt-0.5 h-4 w-4 rounded-md border-slate-200 text-slate-900 focus:ring-slate-900 cursor-pointer accent-slate-900"
              />
              <span className="leading-normal select-none">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="font-bold text-slate-900 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="font-bold text-slate-900 hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </div>

            {error && (
              <p className="text-rose-600 text-[11px] font-semibold mt-2">
                {error}
              </p>
            )}

            {/* Primary Call to Action Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:bg-slate-800 shadow-md active:scale-98 cursor-pointer group"
            >
              Register Account
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </form>

          {/* Login Redirect Row */}
          <div className="mt-6 text-center text-xs font-medium text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-slate-900 hover:underline cursor-pointer"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-400 tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Your data is
            protected by secure encryption
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
