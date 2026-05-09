import React, { useState } from 'react'
import toast from 'react-hot-toast';
import API from '../utils/axios';
import { getPasswordStrength, normalizeEmail, normalizeName, validateAuth, formatName } from "../utils/validators";
import { Eye, EyeOff } from 'lucide-react';

const AuthPage = ({ setUser }) => {

  const [currentState, setCurrentState] = useState("Sign In");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const strength = getPasswordStrength(password);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const { isSubmitValid } = validateAuth({ type: currentState === "Sign Up" ? "signup" : "signin", fullName, email, password, confirmPassword });

  const handleSignUp = async () => {
    const { isValid, errors, formatted } = validateAuth({ type: "signup", fullName, email, password, confirmPassword });
    if (!isValid) {
      return toast.error(Object.values(errors)[0]);
    }
    const formData = new FormData();
    formData.append("fullName", formatted.fullName);
    formData.append("email", formatted.email);
    formData.append("password", password);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    try {
      const { data } = await API.post("/user/signup", formData);
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setAvatar(null);
    setAvatarFile(null);
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  const handleSignIn = async () => {
    const { isValid, errors, formatted } = validateAuth({ type: "signin", email, password });
    if (!isValid) {
      return toast.error(Object.values(errors)[0]);
    }
    try {
      const { data } = await API.post("/user/signin", { email: formatted.email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setEmail("");
    setPassword("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Mark<span className="text-violet-500">IT</span>
        </h1>
        <p className="text-center text-slate-400 mb-6">
          {currentState === "Sign In" ? "Sign in to your account" : "Create your account"}
        </p>
        <div className="space-y-5">
          {currentState === "Sign Up" && (
            <div>
              <label className="block text-sm text-slate-300 mb-1">
                Full Name*
              </label>
              <input
                type="text"
                placeholder="Mohd Hamza"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={(e) => setFullName(formatName(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          )}
          {currentState === "Sign Up" && (
            <div className="flex justify-start">
              <label className="cursor-pointer flex flex-col items-start">
                <span className="block text-sm text-slate-300 mb-1">
                  Avatar
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <div className="relative w-24 h-24 rounded-full bg-slate-700 overflow-hidden border-2 border-slate-600 group">
                  <img
                    src={
                      avatar
                        ? avatar
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrzK1R5eFyx2t3yRYdFNEMGkucJnl_txpmoQ&s"
                    }
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-medium transition">
                    Upload
                  </div>
                </div>
              </label>
            </div>
          )}
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Email*
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Password*
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={currentState === "Sign Up" ? "Create your password" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400">
                {showPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </span>
            </div>
            {currentState === "Sign Up" && password && (
              <p className={`text-sm mb-2 ${strength === "Weak" ? "text-red-400" : strength === "Medium" ? "text-yellow-400" : "text-green-400"}`}>
                Strength: {strength}
              </p>
            )}
            {currentState === "Sign Up" && (
              <div className="relative mt-2">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400" >
                  {showConfirmPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </span>
              </div>
            )}
          </div>
          <button disabled={!isSubmitValid} onClick={currentState === "Sign Up" ? handleSignUp : handleSignIn} className={`w-full py-2 rounded-lg transition text-white font-semibold ${isSubmitValid ? "bg-violet-600 hover:bg-violet-700 cursor-pointer" : "bg-violet-600 opacity-50 cursor-not-allowed"}`}>
            {currentState === "Sign Up" ? "Create now" : "Login now"}
          </button>
        </div>
        {currentState === "Sign Up" ? (
          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Sign In")} className="text-violet-400 cursor-pointer hover:underline">
              Sign in
            </span>
          </p>
        ) : (
          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{" "}
            <span onClick={() => setCurrentState("Sign Up")} className="text-violet-400 cursor-pointer hover:underline">
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  )
}

export default AuthPage