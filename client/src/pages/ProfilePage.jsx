import React, { useState } from "react";
import toast from "react-hot-toast";
import API from "../utils/axios.js";
import { formatName, normalizeEmail, normalizeName, getPasswordStrength, validateProfileUpdate } from "../utils/validators.js";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

const ProfilePage = ({ user, bookmarks, setUser, verifyUser, handleLogout, handleDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(user?.avatar);
  const [avatarFile, setAvatarFile] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOldPasswordVerified, setIsOldPasswordVerified] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const { isValid, formatted, isEmailInvalid } = validateProfileUpdate({ fullName, email, avatar, oldPassword, newPassword, confirmPassword, user });

  const resetState = () => {
    setFullName("");
    setEmail("");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setAvatar(user?.avatar);
    setAvatarFile(null);
    setIsOldPasswordVerified(false);
    setIsUpdating(false);
  };

  const handleUpdate = async () => {
    try {
      if (!isValid) {
        return toast.error("Fix validation errors first");
      }
      const formData = new FormData();
      if (formatted.fullName && formatted.fullName !== user?.fullName) {
        formData.append("fullName", formatted.fullName);
      }
      if (formatted.email && formatted.email !== user?.email) {
        formData.append("email", formatted.email);
      }
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      if ([...formData.keys()].length > 0) {
        await API.post("/user/update", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      if (newPassword) {
        if (!isOldPasswordVerified) {
          return toast.error("Verify old password first");
        }
        await API.post("/user/change-password", {
          newPassword: newPassword.trim(),
        });
      }
      toast.success("Updated profile successfully");
      resetState();
      verifyUser();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const cancelUpdate = () => {
    resetState();
  };

  const verifyOldPassword = async () => {
    if (!oldPassword || isOldPasswordVerified) return;
    try {
      const { data } = await API.post("/user/verify-old-password", { oldPassword });
      setIsOldPasswordVerified(data.success);
    } catch {
      setIsOldPasswordVerified(false);
    }
  };

  if (isDeletingAccount) {
    return (
      <div className="w-screen h-screen p-4 flex items-center justify-center bg-slate-900">
        <div className="flex flex-col gap-4 w-full max-w-md bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-red-400">
            Warning
          </h2>
          <h4 className="text-md text-gray-200">
            Are you sure that you want to delete your account?
          </h4>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsDeletingAccount(false)} className="px-4 py-2 text-white bg-violet-600 hover:bg-violet-700 rounded-md cursor-pointer transition">
              Cancel
            </button>
            <button onClick={handleDelete} className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer transition">
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-slate-900 px-4">
      {isUpdating ? (
        <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-white mb-2">
            Mark<span className="text-violet-500">IT</span>
          </h1>
          <p className="text-center text-slate-400 mb-6">Update your profile</p>
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                placeholder={user?.fullName}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={() => setFullName(formatName(fullName))}
                className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="flex justify-start">
              <label className="cursor-pointer flex flex-col items-start">
                <span className="block text-sm text-slate-300 mb-1">Avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <div className="relative w-24 h-24 rounded-full bg-slate-700 overflow-hidden border-2 border-slate-600 group">
                  <img
                    src={avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition">
                    Upload
                  </div>
                </div>
              </label>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Email</label>
              <input
                type="email"
                placeholder={user?.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmail(normalizeEmail(email))}
                className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              {isEmailInvalid && <p className="text-red-400 text-sm mt-1">Invalid email</p>}
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Password</label>
              <div className="space-y-3">
                <div>
                  <div className="relative">
                    <input
                      type={showOld ? "text" : "password"}
                      placeholder="Enter old password"
                      value={oldPassword}
                      onChange={(e) => {
                        setOldPassword(e.target.value);
                        setIsOldPasswordVerified(false);
                      }}
                      onKeyUp={(e) => e.key === "Enter" && verifyOldPassword()}
                      onBlur={verifyOldPassword}
                      className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <span onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400">
                      {showOld ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </span>
                  </div>
                  {oldPassword && !isOldPasswordVerified && (
                    <p className="text-red-400 text-sm mt-1">Incorrect password</p>
                  )}
                  {isOldPasswordVerified && (
                    <p className="text-green-400 text-sm mt-1">Password verified</p>
                  )}
                </div>
                <div>
                  {isOldPasswordVerified && (
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        placeholder="Create new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                      <span onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400">
                        {showNew ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </span>
                    </div>
                  )}
                  {newPassword && (
                    <p className={`text-sm mt-1 ${getPasswordStrength(newPassword) === "Weak" ? "text-red-400" : getPasswordStrength(newPassword) === "Medium" ? "text-yellow-400" : "text-green-400"}`}>
                      Strength: {getPasswordStrength(newPassword)}
                    </p>
                  )}
                </div>
                {isOldPasswordVerified && (
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <span onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400">
                      {showConfirm ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button disabled={!isValid} onClick={handleUpdate} className={`w-full py-2 rounded-lg ${isValid ? "bg-violet-600 hover:bg-violet-700 cursor-pointer" : "bg-violet-600 opacity-50 cursor-not-allowed"} text-white font-semibold`}>
              Update Profile
            </button>
            <button onClick={cancelUpdate} className="w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          <Link to="/">
            <div className="absolute text-white cursor-pointer">
              <ArrowLeft className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-6">
            Mark<span className="text-violet-500">IT</span>
          </h1>
          <div className="flex justify-center mb-4">
            <img
              src={user?.avatar}
              alt="avatar"
              className="w-28 h-28 rounded-full border-4 border-violet-500 object-cover shadow-lg"
            />
          </div>
          <h2 className="text-xl font-semibold text-white">
            {user?.fullName}
          </h2>
          <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
          <div className="border-t border-slate-700 my-6"></div>
          <div className="space-y-4 text-left">
            <div className="text-slate-400">
              Currently {bookmarks?.filter(b => b.userId === user?._id).length} bookmarks
            </div>
            <div className="text-slate-400">
              Joined on {formatDate(user?.createdAt)}
            </div>
          </div>
          <button onClick={() => setIsUpdating(true)} className="mt-8 w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold cursor-pointer">
            Edit Profile
          </button>
          <button onClick={handleLogout} className="mt-4 w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold cursor-pointer">
            Logout
          </button>
          <button onClick={() => setIsDeletingAccount(true)} className="mt-4 w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer">
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;