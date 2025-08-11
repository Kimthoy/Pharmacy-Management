import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="earth-loader">
        <div className="earth"></div>
      </div>
      <span className="ml-4 text-blue-500 text">Loading...</span>
    </div>
  );
};

export default Loader;
