import { useState, useEffect } from "react";
import { getAllSupply, deleteSupply } from "../api/suppliesService";
import { getAllSupplier } from "../api/supplierService";
import { useTranslation } from "../../hooks/useTranslation";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Supply = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);
  const [supplies, setSupplies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchSupplies();
  }, []);

  const fetchSupplies = async () => {
    try {
      const data = await getAllSupply();
      setSupplies(data);
    } catch (err) {
      console.error("Failed to fetch supplies", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supply?")) return;
    try {
      setDeletingId(id);
      await deleteSupply(id);
      toast.success("Supply deleted successfully");
      await fetchSupplies();
    } catch (error) {
      toast.error(error.message || "Failed to delete supply");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = supplies.filter((s) =>
    s.supplier?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold dark:text-slate-200">Supply List</h1>
      
      </div>

      <input
        type="text"
        placeholder="Search by supplier name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-3 py-2 border rounded w-full max-w-sm"
      />

      <table className="min-w-full table-auto border border-gray-300 shadow-sm rounded-md">
        <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
          <tr>
            <th className="border px-4 py-3">Supply ID</th>
            <th className="border px-4 py-3">Supplier</th>
            <th className="border px-4 py-3">Supply Date</th>
            <th className="border px-4 py-3">Invoice ID</th>
            <th className="border px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((supply) => (
              <tr
                key={supply.id}
                className="hover:shadow-md text-md cursor-pointer"
              >
                <td className="border px-4 py-2 text-green-600">
                  {supply.supply_id || "N/A"}
                </td>
                <td className="border px-4 py-2 dark:text-white">
                  {supply.supplier?.company_name || "N/A"}
                </td>
                <td className="border px-4 py-2 dark:text-white">
                  {new Date(supply.invoice_date).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2 text-green-500">
                  {supply.invoice_id || "N/A"}
                </td>
                <td className="border px-2 py-2">
                  <button
                    onClick={() => navigate(`/edit-supply/${supply.id}`)}
                    className="text-blue-500 hover:bg-slate-300 p-3 rounded-lg"
                  >
                    <FaEdit className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleDelete(supply.id)}
                    className="text-red-500 hover:bg-slate-300 p-3 rounded-lg"
                    disabled={deletingId === supply.id}
                  >
                    {deletingId === supply.id ? (
                      <div className="w-5 h-5 border-2 border-t-transparent border-red-500 rounded-full animate-spin"></div>
                    ) : (
                      <RiDeleteBinFill className="w-6 h-6" />
                    )}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 py-4">
                No supplies found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Supply;
