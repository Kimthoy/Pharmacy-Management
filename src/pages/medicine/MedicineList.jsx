import { useState, useRef, useEffect } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { BiEdit, BiShow, BiTrash } from "react-icons/bi";
import { MdWarehouse } from "react-icons/md";
import { useTranslation } from "../../hooks/useTranslation";
import { useNavigate } from "react-router-dom";

const medicines = [
  {
    ProductID: 1,
    name: "Zimax",
    weight: "500mg",
    category: "Tablet",
    quantityPerPackage: 100,
    price: "20.55 USD",
    stock: 100,
    date: "2025-01-20",
    manufacturer: "Healthcare",
    expireDate: "2020-12-19",
    startingStock: 230,
    manufacturePrice: 50.0,
    wholesalePrice: 55.0,
    sellingPrice: 60.0,
  },
  {
    ProductID: 2,
    name: "Oxidon",
    weight: "10mg",
    category: "Tablet",
    quantityPerPackage: 50,
    price: "15.00 USD",
    stock: 50,
    date: "2025-02-10",
    manufacturer: "PharmaCorp",
    expireDate: "2021-06-15",
    startingStock: 100,
    manufacturePrice: 40.0,
    wholesalePrice: 45.0,
    sellingPrice: 50.0,
  },
  {
    ProductID: 3,
    name: "MED-1008",
    weight: "200Doses",
    category: "Inhaler",
    quantityPerPackage: 1,
    price: "12.45 USD",
    stock: 0,
    date: "2025-03-21",
    manufacturer: "MediTech",
    expireDate: "2022-03-10",
    startingStock: 50,
    manufacturePrice: 30.0,
    wholesalePrice: 35.0,
    sellingPrice: 40.0,
  },
];

const MedicineList = () => {
  const { t } = useTranslation();

  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const toggleMenu = (index) => setOpenMenu(openMenu === index ? null : index);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch = med.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = category ? med.category === category : true;
    const matchesDate =
      (!startDate || new Date(med.date) >= new Date(startDate)) &&
      (!endDate || new Date(med.date) <= new Date(endDate));
    return matchesSearch && matchesCategory && matchesDate;
  });

  const totalPages = Math.ceil(filteredMedicines.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedMedicines = filteredMedicines.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const getStatus = (stock) => {
    if (stock === 0)
      return { text: "Out of Stock", color: "text-red-600 dark:text-red-400" };
    if (stock <= 50)
      return { text: "Low", color: "text-orange-500 dark:text-orange-300" };
    return { text: "Available", color: "text-green-600 dark:text-green-400" };
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800 rounded-md overflow-x-auto">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
        {t("medicinelist.MedicineListTitle")}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {t("medicinelist.MedicineListDesc")}
      </p>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder={t("medicinelist.MedicineListSearchByName")}
          className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-green-500 dark:bg-gray-700 dark:text-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-green-500 dark:bg-gray-700 dark:text-gray-200"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Tablet">Tablet</option>
          <option value="Vitamin">Vitamin</option>
          <option value="Inhaler">Inhaler</option>
        </select>
      </div>
      <div className="flex mb-4">
        <div className="me-5">
          <label className="me-2 text-gray-400 dark:text-gray-300">
            {t("medicinelist.MedicineListFilterStartDate")}
          </label>
          <input
            type="date"
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-green-500 dark:bg-gray-700 dark:text-gray-200"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="me-2 text-gray-400 dark:text-gray-300">
            {t("medicinelist.MedicineListFilterEndDate")}
          </label>
          <input
            type="date"
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-green-500 dark:bg-gray-700 dark:text-gray-200"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-lg">
          <thead className="border border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-300 rounded">
            <tr>
              <td className="p-3 text-left text-sm">
                {t("medicinelist.MedicineListMedicineName")}
              </td>
              <td className="p-3 text-left text-sm">
                {t("medicinelist.MedicineListMedicinePrice")}
              </td>

              <td className="p-3 text-left text-sm">
                {t("medicinelist.MedicineListMedicineStatus")}
              </td>
              <td className="p-3 text-left text-sm">
                {t("medicinelist.MedicineListMedicineDate")}
              </td>
              <td className="p-3 text-left text-sm">
                {t("medicinelist.MedicineListMedicineActions")}
              </td>
            </tr>
          </thead>
          <tbody>
            {selectedMedicines.map((med, index) => {
              const { text, color } = getStatus(med.stock);
              return (
                <tr
                  key={med.ProductID}
                  className="border border-gray-200 dark:border-gray-600 text-xs sm:text-base"
                >
                  <td className="p-3 text-[13px] text-gray-400 dark:text-gray-300">
                    {med.name}
                  </td>
                  <td className="p-3 text-[13px] text-gray-400 dark:text-gray-300">
                    {med.price}
                  </td>

                  <td className={`p-3 text-[13px] ${color}`}>{text}</td>
                  <td className="p-3 text-[13px] text-gray-400 dark:text-gray-300">
                    {med.date}
                  </td>
                  <td className="p-3 text-[13px] relative">
                    <button
                      ref={menuRef}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                      onClick={() => toggleMenu(index)}
                    >
                      <FaEllipsisV />
                    </button>
                    {openMenu === index && (
                      <div className="absolute z-10 right-16 mt-2 top-2 w-36 bg-gray-100 dark:bg-gray-800 border border-green-600 dark:border-green-500 rounded-md shadow-md dark:shadow-gray-700">
                        <button className="flex align-middle w-full text-left text-gray-600 dark:text-gray-200 py-2 hover:rounded-md hover:bg-green-500 hover:text-white dark:hover:bg-green-400 dark:hover:text-white">
                          <MdWarehouse className="mt-1 w-10" />
                          {t("medicinelist.MedicineListMedicineManufacturer")}
                        </button>
                        <button
                          className="flex align-middle w-full text-left text-gray-600 dark:text-gray-200 py-2 hover:rounded-md hover:bg-green-500 hover:text-white dark:hover:bg-green-400 dark:hover:text-white"
                          onClick={() => navigate(`/medicine/${med.ProductID}`)} // Updated path
                        >
                          <BiShow className="mt-1 w-10" />
                          {t("medicinelist.MedicineListMedicineViewDetails")}
                        </button>
                        <button className="flex align-middle w-full text-left text-gray-600 dark:text-gray-200 py-2 hover:rounded-md hover:bg-green-500 hover:text-white dark:hover:bg-green-400 dark:hover:text-white">
                          <BiEdit className="mt-1 w-10" />
                          {t("medicinelist.MedicineListMedicineViewEdit")}
                        </button>
                        <button className="flex align-middle w-full text-left text-gray-600 dark:text-gray-200 py-2 hover:rounded-md hover:bg-green-500 hover:text-white dark:hover:bg-green-400 dark:hover:text-white">
                          <BiTrash className="mt-1 w-10" />
                          {t("medicinelist.MedicineListMedicineRemove")}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 dark:text-gray-300">
            {t("medicinelist.Rowsperpag")}
          </span>
          <select
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setCurrentPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            {t("medicinelist.MedicineListMedicinePrevious")}
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            {t("medicinelist.MedicineListMedicinePage")} {currentPage}{" "}
            {t("medicinelist.MedicineListMedicineof")} {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            {t("medicinelist.MedicineListMedicineNext")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineList;
