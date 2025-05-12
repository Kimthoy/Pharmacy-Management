import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "../../hooks/useTranslation";

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    is_active: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Submitting data:", formData); // optional: log form data

    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        phone: formData.phone,
        is_active: formData.is_active,
      });

      alert("Registration successful!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      alert("Registration failed.");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-md flex flex-col md:flex-row w-full max-w-4xl p-6">
        <div className="flex flex-col justify-center md:w-1/2 p-4 text-center md:text-left">
          <h1 className="font-bold text-2xl md:text-3xl mb-3 font-header text-green-500">
            {t("register.Welcomes")} <br /> Panharith Pharmacy
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            {t("register.Pleaseenter")}
          </p>
        </div>

        <div className="flex flex-col justify-center md:w-1/2 p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-green-600 text-lg font-semibold">Sign Up</p>

            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                required
                autoComplete="off"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-200 px-4 py-2 mt-2 rounded-md shadow-md focus:outline-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                required
                autoComplete="off"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-200 px-4 py-2 mt-2 rounded-md shadow-md focus:outline-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                required
                autoComplete="off"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-gray-200 px-4 py-2 mt-2 rounded-md shadow-md focus:outline-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                required
                autoComplete="new-password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-200 px-4 py-2 mt-2 rounded-md shadow-md focus:outline-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                autoComplete="new-password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-gray-200 px-4 py-2 mt-2 rounded-md shadow-md focus:outline-green-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              <label className="text-gray-700">Active Account</label>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white rounded-md shadow-lg px-6 py-2 hover:bg-green-600 transition duration-300"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
