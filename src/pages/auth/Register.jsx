import React from "react";

const Register = () => {
  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-md flex flex-col md:flex-row w-full max-w-4xl p-6">
        <div className="flex flex-col justify-center md:w-1/2 p-4 text-center md:text-left">
          <h1 className="font-bold text-2xl md:text-3xl mb-3 font-header text-green-500">
            Welcome <br /> Panharith Pharmacy
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Please enter your details to create a new account.
          </p>
        </div>

        <div className="flex flex-col justify-center md:w-1/2 p-4">
          <form className="space-y-4">
            <div>
              <p className="text-green-600 text-lg font-semibold">Sign Up</p>
            </div>
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                required
                autoComplete="off"
                placeholder="Enter your full name"
                className="w-full bg-gray-200 px-4 py-2 mt-2 shadow-md focus:shadow-none rounded-md focus:outline-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                required
                autoComplete="off"
                placeholder="Enter email"
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
                className="w-full bg-gray-200 px-4 py-2 mt-2 rounded-md shadow-md focus:shadow-none focus:outline-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="Confirm password"
                className="w-full bg-gray-200 px-4 py-2 mt-2 rounded-md shadow-md focus:shadow-none focus:outline-green-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white rounded-md shadow-lg active:shadow-none px-6 py-2 hover:bg-green-600 transition duration-300"
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
