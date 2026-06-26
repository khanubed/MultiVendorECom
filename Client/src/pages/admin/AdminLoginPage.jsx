import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Quick-fill helper for local execution testing cycles
  const handleAutofillTestCredentials = () => {
    setFormData({
      email: "admin@test.com",
      password: "testtest",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    const response = await login(formData.email, formData.password, "admin");
    if (!response.success) {
      setError(response.error);
      return;
    }

    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 bg-white border border-slate-200/80 px-3 py-1 rounded-full shadow-2xs">
          Super Admin Access
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
          Admin Portal Sign In
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Authenticate to manage vendors, review marketplace assets, and control
          global commission settings.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 sm:p-10 shadow-sm">
          {/* INTERACTIVE QA DEV AUTOFILL TRIGGER */}
          <div
            onClick={handleAutofillTestCredentials}
            className="mb-6 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center justify-between cursor-pointer hover:bg-amber-100/60 transition-all group active:scale-[0.99]"
            title="Click to quickly inject test parameters"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <div className="text-left">
                <p className="text-[11px] font-bold text-amber-800">
                  Test Mode Active
                </p>
                <p className="text-[10px] text-amber-600/90 font-semibold">
                  Click here to fill details automatically.
                </p>
              </div>
            </div>
            <span className="text-[9px] bg-amber-200/50 text-amber-800 px-2 py-1 rounded-lg font-bold uppercase tracking-wider group-hover:bg-amber-200 transition-colors">
              Autofill
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="admin@yourdomain.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  // name={password}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••••"
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

            {error && (
              <p className="text-rose-600 text-[11px] font-semibold mt-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:bg-slate-800 shadow-md active:scale-98 cursor-pointer group"
            >
              Sign In
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs font-medium text-slate-500">
            Admin authentication is managed securely and should only be used by
            authorized personnel.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
