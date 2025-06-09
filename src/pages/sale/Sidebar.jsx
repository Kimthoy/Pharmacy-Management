import React from "react";

const Sidebar = () => {
  return (
    <div className="w-36 bg-white shadow-lg hidden md:block">
      <div className="flex items-center justify-center h-16 bg-green-600 text-white">
        <span className="text-2xl font-bold">✚</span>
      </div>
      <nav className="mt-6">
        <a
          href="#"
          className="block px-4 py-2 bg-green-100 text-green-600 font-semibold"
          aria-label="ផលិតផល"
        >
          ទិញរាយ
        </a>
        <a
          href="#"
          className="block px-4 py-2 bg-green-100 text-green-600 font-semibold"
          aria-label="ផលិតផល"
        >
          ផលិតផល
        </a>
        <a
          href="#"
          className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
          aria-label="ការបញ្ជាទិញ"
        >
          ការបញ្ជាទិញ
        </a>
        <a
          href="#"
          className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
          aria-label="របាយការណ៍"
        >
          របាយការណ៍
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
