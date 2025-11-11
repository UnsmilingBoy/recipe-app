"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getCurrentUser, updateUser, deleteAccount } from "@/lib/authClient";
import { PublicUser } from "@/lib/userSchema";
import { User, Mail, Lock, Trash2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function ProfilePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        currentPassword: "",
        newPassword: "",
      });
    } catch {
      router.push("/login");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const updates: Record<string, string> = {};

      if (formData.name !== user?.name) {
        updates.name = formData.name;
      }
      if (formData.email !== user?.email) {
        updates.email = formData.email;
      }
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          throw new Error("Current password is required to change password");
        }
        updates.currentPassword = formData.currentPassword;
        updates.newPassword = formData.newPassword;
      }

      if (Object.keys(updates).length === 0) {
        setError(text[language].noChangeToSave);
        return;
      }

      const updatedUser = await updateUser(updates);
      setUser(updatedUser);
      setFormData((prev) => ({
        ...prev,
        name: updatedUser.name,
        email: updatedUser.email,
        currentPassword: "",
        newPassword: "",
      }));
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount();
      router.push("/login");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account");
      setShowDeleteConfirm(false);
    }
  };

  const text = {
    en: {
      backToHome: "← Back to Home",
      profileSettings: "Profile Settings",
      manageAccount: "Manage your account information",
      loadingProfile: "Loading profile...",
      fullName: "Full Name",
      emailAddress: "Email Address",
      changePassword: "Change Password",
      currentPassword: "Current Password",
      currentPasswordPlaceholder: "Enter current password",
      newPassword: "New Password",
      newPasswordPlaceholder: "At least 8 characters",
      keepPasswordHint: "Leave blank to keep current password",
      saving: "Saving...",
      saveChanges: "Save Changes",
      dangerZone: "Danger Zone",
      dangerWarning:
        "Once you delete your account, there is no going back. Please be certain.",
      deleteAccount: "Delete Account",
      confirmDelete: "Are you absolutely sure? This action cannot be undone.",
      yesDelete: "Yes, Delete My Account",
      cancel: "Cancel",
      noChangeToSave: "No changes to save",
    },
    fa: {
      backToHome: "→ بازگشت به صفحه اصلی",
      profileSettings: "تنظیمات پروفایل",
      manageAccount: "مدیریت اطلاعات حساب کاربری شما",
      loadingProfile: "در حال بارگذاری پروفایل...",
      fullName: "نام کامل",
      emailAddress: "آدرس ایمیل",
      changePassword: "تغییر رمز عبور",
      currentPassword: "رمز عبور فعلی",
      currentPasswordPlaceholder: "رمز عبور فعلی را وارد کنید",
      newPassword: "رمز عبور جدید",
      newPasswordPlaceholder: "حداقل 8 کاراکتر",
      keepPasswordHint: "برای حفظ رمز عبور فعلی خالی بگذارید",
      saving: "در حال ذخیره...",
      saveChanges: "ذخیره تغییرات",
      dangerZone: "منطقه خطرناک",
      dangerWarning:
        "پس از حذف حساب کاربری، امکان بازگردانی وجود ندارد. لطفاً مطمئن باشید.",
      deleteAccount: "حذف حساب کاربری",
      confirmDelete: "آیا کاملاً مطمئن هستید؟ این عمل قابل بازگشت نیست.",
      yesDelete: "بله، حساب کاربری من را حذف کن",
      cancel: "انصراف",
      noChangeToSave: "تغییری برای ذخیره وجود ندارد",
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-12 px-4 pt-20">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/")}
              className="text-primary cursor-pointer dark:text-primary-dark hover:text-primary-dark dark:hover:text-primary mb-4 flex items-center gap-2 transition-colors"
            >
              {text[language].backToHome}
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {text[language].profileSettings}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {text[language].manageAccount}
            </p>
          </div>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
            >
              <p className="text-green-700 dark:text-green-300 text-sm">
                {success}
              </p>
            </motion.div>
          )}

          {/* Profile Form */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 mb-6 border border-gray-100 dark:border-zinc-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"
                >
                  <User size={16} />
                  {text[language].fullName}
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"
                >
                  <Mail size={16} />
                  {text[language].emailAddress}
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              {/* Change Password Section */}
              <div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Lock size={18} />
                  {text[language].changePassword}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      {text[language].currentPassword}
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={formData.currentPassword}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder={text[language].currentPasswordPlaceholder}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      {text[language].newPassword}
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      minLength={8}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder={text[language].newPasswordPlaceholder}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {text[language].keepPasswordHint}
                    </p>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-linear-to-r from-primary to-primary-dark text-white py-3 rounded-lg font-semibold hover:from-primary-dark hover:to-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSaving ? text[language].saving : text[language].saveChanges}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 border-2 border-red-200 dark:border-red-800">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
              <Trash2 size={18} />
              {text[language].dangerZone}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {text[language].dangerWarning}
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all font-medium"
              >
                {text[language].deleteAccount}
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-red-700 dark:text-red-300 font-medium">
                  {text[language].confirmDelete}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    className="px-6 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-all font-medium"
                  >
                    {text[language].yesDelete}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-6 py-2 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 transition-all font-medium"
                  >
                    {text[language].cancel}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
