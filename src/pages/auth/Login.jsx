import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/login";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}`, {
        email,
        password,
      });

      if (response.data.token) {
        console.log("Login successful, received token:", response.data.token);

        // ✅ Store token in localStorage
        localStorage.setItem("authToken", response.data.token);

        alert("Login successful!");
        window.location.href = "/"; // Redirect user
      } else {
        throw new Error("Token not received!");
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );
      alert("Invalid credentials. Please try again.");
    }
  };


  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-md flex flex-col md:flex-row w-full max-w-4xl p-6">
        <div className="flex flex-col justify-center md:w-1/2 p-4 text-center md:text-left">
          <h1 className="font-bold text-2xl md:text-3xl mb-3 font-header text-green-500">
            Welcome <br /> Panharith Pharmacy
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Please enter your email and password to log in to the admin
            dashboard.
          </p>
        </div>

        <div className="flex flex-col justify-center md:w-1/2 p-4">
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <p className="text-green-600 text-lg font-semibold">Sign In</p>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                required
                autoComplete="off"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-200 px-4 py-2 mt-2 shadow-md focus:shadow-none rounded-md focus:outline-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-200 px-4 py-2 mt-2 rounded-md shadow-md focus:shadow-none focus:outline-green-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white rounded-md shadow-lg active:shadow-none px-6 py-2 hover:bg-green-600 transition duration-300"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
export default Login;
