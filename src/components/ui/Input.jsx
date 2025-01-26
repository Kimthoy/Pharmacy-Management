import React from "react";

export const Input = ({ placeholder, className, ...props }) => (
  <input
    type="text"
    placeholder={placeholder}
    className={`border rounded p-1 w-6 shadow  ${className}`}
    {...props}
  />
);
