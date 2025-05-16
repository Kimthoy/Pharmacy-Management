import React, { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

const USER_DATA = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  role: "Pharmacist",
  contact: "+1234567890",
  join_date: "2023-01-15",
  profile_picture: "https://via.placeholder.com/150",
};

const AboutUser = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: USER_DATA.name,
    email: USER_DATA.email,
    contact: USER_DATA.contact,
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t("viewprofile.NameRequired");
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
      newErrors.email = t("viewprofile.InvalidEmail");
    if (!formData.contact.match(/^\+?\d{10,12}$/))
      newErrors.contact = t("viewprofile.InvalidContact");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Update USER_DATA or make API call here
      console.log("Saving profile:", formData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: USER_DATA.name,
      email: USER_DATA.email,
      contact: USER_DATA.contact,
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          {t("viewprofile.ProfileTitle")}
        </h2>

        <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-lg p-6">
          {!isEditing ? (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <img
                  src={USER_DATA.profile_picture}
                  alt={t("viewprofile.ProfilePictureAlt")}
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 dark:text-gray-300 text-sm">
                      {t("viewprofile.Name")}
                    </label>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      {USER_DATA.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-gray-400 dark:text-gray-300 text-sm">
                      {t("viewprofile.Email")}
                    </label>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      {USER_DATA.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-gray-400 dark:text-gray-300 text-sm">
                      {t("viewprofile.Role")}
                    </label>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      {USER_DATA.role}
                    </p>
                  </div>
                  <div>
                    <label className="block text-gray-400 dark:text-gray-300 text-sm">
                      {t("viewprofile.Contact")}
                    </label>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      {USER_DATA.contact}
                    </p>
                  </div>
                  <div>
                    <label className="block text-gray-400 dark:text-gray-300 text-sm">
                      {t("viewprofile.JoinDate")}
                    </label>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      {USER_DATA.join_date}
                    </p>
                  </div>
                </div>
                <button
                  className="mt-6 flex items-center px-4 py-2 bg-emerald-600 dark:bg-emerald-500 text-white rounded-md hover:bg-emerald-700 dark:hover:bg-emerald-600"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit className="mr-2" />
                  {t("viewprofile.EditProfile")}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Picture (Read-only in Edit Mode) */}
                <div className="flex-shrink-0">
                  <img
                    src={USER_DATA.profile_picture}
                    alt={t("viewprofile.ProfilePictureAlt")}
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  />
                </div>

                {/* Edit Form */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-400 dark:text-gray-300 text-sm mb-1"
                    >
                      {t("viewprofile.Name")}
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-emerald-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                      placeholder={t("viewprofile.NamePlaceholder")}
                    />
                    {errors.name && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-400 dark:text-gray-300 text-sm mb-1"
                    >
                      {t("viewprofile.Email")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-emerald-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                      placeholder={t("viewprofile.EmailPlaceholder")}
                    />
                    {errors.email && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="contact"
                      className="block text-gray-400 dark:text-gray-300 text-sm mb-1"
                    >
                      {t("viewprofile.Contact")}
                    </label>
                    <input
                      type="text"
                      id="contact"
                      value={formData.contact}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: e.target.value })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-emerald-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                      placeholder={t("viewprofile.ContactPlaceholder")}
                    />
                    {errors.contact && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                        {errors.contact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-emerald-600 dark:bg-emerald-500 text-white rounded-md hover:bg-emerald-700 dark:hover:bg-emerald-600"
                >
                  <FaSave className="mr-2" />
                  {t("viewprofile.Save")}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaTimes className="mr-2" />
                  {t("viewprofile.Cancel")}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutUser;
