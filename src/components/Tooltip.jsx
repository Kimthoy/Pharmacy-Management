// src/components/Tooltip.jsx
import React from "react";

const Tooltip = ({ text, children }) => {
  return (
    <div className="group relative flex items-center cursor-pointer">
      {children}
      <div className="absolute top-12  left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
