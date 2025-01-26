import React from "react";

export const Button = ({ children, variant, className, ...props }) => {
  const baseStyles = "rounded px-4 py-2 font-semibold";
  const variants = {
    primary: "bg-blue-500 text-white shadow hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-700 shadow hover:bg-gray-300",
    link: "text-blue-500 hover:underline",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
