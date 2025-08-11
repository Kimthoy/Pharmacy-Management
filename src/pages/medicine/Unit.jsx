import React, { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useTranslation } from "../../hooks/useTranslation";
import {
  getAllUnits,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../api/unitService";

const UnitDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [units, setUnits] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [unit, setUnit] = useState({
    unit_name: "",
    desc: "",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filtered = units.filter((u) =>
    u.unit_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const confirmDelete = (id) => {
    Swal.fire({
      title: t("unit.Confirmation"),
      text: t("unit.DescWarning"),
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: t("unit.CancelButton"),
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("unit.YesButton"),
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteUnit(id);
      }
    });
  };

  const handleDeleteUnit = async (id) => {
    try {
      const success = await deleteUnit(id);
      if (success) {
        setSuccess("Unit deleted successfully.");
        await fetchUnits();
      } else {
        setError("Failed to delete unit.");
      }
    } catch (err) {
      
      setError("An unexpected error occurred.");
    }
  };

  const handleUpdateUnit = async () => {
    try {
      await updateUnit(selectedUnit.id, {
        unit_name: selectedUnit.unit_name,
        desc: selectedUnit.desc,
      });
      setShowEditModal(false);
      fetchUnits(); 
    } catch (error) {
      
      setError("Failed to update unit.");
    }
  };

  const handleEditUnit = (unit) => {
    setSelectedUnit(unit);
    setShowEditModal(true);
  };

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const data = await getAllUnits();
      setUnits(data);
    } catch (err) {
      
      setError("Failed to fetch units.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleUnitChange = (e) => {
    const { name, value } = e.target;
    setUnit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      setIsLoading(true);
      try {
        const payload = {
          unit_name: unit.unit_name,
          desc: unit.desc,
        };

        await createUnit(payload);
        setSuccess("Unit created successfully!");
        setUnit({ unit_name: "", desc: "" });
        setShowModal(false);
        fetchUnits();
      } catch (err) {
        
        const errorMessage = err?.message || "Failed to create unit.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [unit]
  );

  return (
    <div className="sm:p-6 dark:text-slate-300 mb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("unit.title")}</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 shadow-lg active:shadow-none rounded-lg hover:bg-blue-700"
        >
          {t("unit.BtnNew")}
        </button>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-800 sm:p-6 p-3 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-2">{t("unit.TitleNew")}</h2>
            <p className="text-sm dark:text-slate-300 text-gray-600 mb-4">{t("unit.formdesc")}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {success && <p className="text-green-600 text-sm">{success}</p>}
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  {t("unit.name")}
                </label>
                <input
                  type="text"
                  name="unit_name"
                  value={unit.unit_name}
                  onChange={handleUnitChange}
                  required
                  className="w-full dark:bg-slate:0 dark:text-slate-900 border px-3 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  {t("unit.desc")}
                </label>
                <textarea
                  name="desc"
                  value={unit.desc}
                  onChange={handleUnitChange}
                  className="w-full dark:bg-slate-0 dark:text-slate-900 border px-3 py-2 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 dark:bg-slate-200 py-2 border rounded-lg shadow-lg active:shadow-none text-red-700 dark:hover:bg-slate-300"
                >
                  {t("unit.BtnCancel")}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 shadow-lg active:shadow-none text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  {isLoading ? t("unit.BtnSaving") : t("unit.BtnSave")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 dark:bg-slate-800">
              <th className="border px-4 py-2 text-left">
                {t("unit.ColName")}
              </th>
              <th className="border px-4 py-2 text-left">
                {t("unit.ColDesc")}
              </th>
              <th className="border px-4 py-2 text-left">
                {t("unit.ColActions")}
              </th>
            </tr>
          </thead>
          <tbody className="text-md text-gray-700 dark:text-gray-200">
          {currentItems.length > 0 ? (
              currentItems.map((u, index) => (
                <tr
                  key={index}
                  className="border-t even:bg-slate-100 dark:even:bg-slate-800 border-gray-200 dark:border-gray-700"
                >
                  <td
                    className="px-4 py-3 max-w-[150px] truncate"
                    title={u.unit_name}
                  >
                    {u.unit_name}
                  </td>

                  <td
                    className="px-4 py-3 max-w-[200px] truncate"
                    title={u.desc}
                  >
                    {u.desc}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEditUnit(u)}
                      className="text-blue-600 sm:hover:bg-slate-700 sm:hover:rounded-lg sm:p-4 sm:hover:bg-opacity-20"
                    >
                      <FaEdit className="sm:w-5 w-4 sm:h-5 h-4" />
                    </button>

                    <button
                      onClick={() => confirmDelete(u.id)}
                      className="text-red-600 ml-5  sm:hover:bg-slate-700 sm:hover:rounded-lg sm:p-4 sm:hover:bg-opacity-20"
                    >
                      <FaTrash className="sm:w-5 w-4 sm:h-5 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                    {t("unit.NotFound") }
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Edit Modal */}
        {showEditModal && selectedUnit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg-lg shadow-lg w-full max-w-md dark:bg-slate-800">
              <h2 className="text-xl font-semibold mb-4">
                {t("unit.FormEdit")}
              </h2>

              <label className="block mb-2 text-sm">{t("unit.name")}</label>
              <input
                type="text"
                value={selectedUnit.unit_name}
                onChange={(e) =>
                  setSelectedUnit({
                    ...selectedUnit,
                    unit_name: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded-lg mb-4"
              />

              <label className="block mb-2 text-sm">{t("unit.desc")}</label>
              <textarea
                value={selectedUnit.desc}
                onChange={(e) =>
                  setSelectedUnit({
                    ...selectedUnit,
                    desc: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded-lg mb-4"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white transition-all rounded-lg shadow-lg hover:bg-opacity-65 hover:text-red-700"
                >
                  {t("unit.BtnCancel")}
                </button>
                <button
                  onClick={handleUpdateUnit}
                  className="px-4 py-2 bg-blue-600 text-white  rounded-lg hover:bg-opacity-50 hover:text-blue-700  shadow-lg"
                >
                  {isLoading ? t("unit.BtnSaving") : t("unit.BtnSave")}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <p className="text-center p-16 text-xl text-gray-500 dark:text-gray-400 mt-4">
            {t("unit.Loading")}
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 dark:text-slate-800 py-1 bg-gray-100 rounded-lg disabled:opacity-50"
        >
          {t("unit.BtnPrev")}
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-lg ${
              currentPage === i + 1
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 shadow-lg"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 dark:text-slate-900 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          {t("unit.BtnNext")}
        </button>
      </div>
    </div>
  );
};

export default UnitDashboard;
