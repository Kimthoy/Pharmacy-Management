import React, { useState } from "react";

export const Select = ({ children }) => {
  return <div className="relative">{children}</div>;
};

export const SelectTrigger = ({ children, className, ...props }) => (
  <button
    className={`border rounded shadow p-3 w-full text-left ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const SelectContent = ({ children }) => (
  <ul className="absolute bg-white border rounded w-full mt-1">{children}</ul>
);

export const SelectItem = ({ children, value, ...props }) => (
  <li
    className="p-2 cursor-pointer hover:bg-gray-100"
    data-value={value}
    {...props}
  >
    {children}
  </li>
);
