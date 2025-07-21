import { useState, useEffect } from "react";
import { getAllSupply, deleteSupply } from "../api/suppliesService";
import { useTranslation } from "../../hooks/useTranslation";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Supply = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const highlightedSupplyId = location.state?.highlightedSupplyId || null;

  const [deletingId, setDeletingId] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchSupplies();
  }, []);

  useEffect(() => {
    if (highlightedSupplyId) {
      const el = document.querySelector(
        `[data-supply="${highlightedSupplyId}"]`
      );
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightedSupplyId, invoices]);

  const fetchSupplies = async () => {
    try {
      const data = await getAllSupply();
      setInvoices(data);
    } catch (err) {
      console.error("Failed to fetch supplies", err);
      toast.error("Failed to load supplies");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supply item?"))
      return;
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

  const flatSupplyItems = invoices.flatMap((invoice) =>
    invoice.supply_items.map((item) => ({
      ...item,
      invoice_date: invoice.invoice_date,
      invoice_id: invoice.invoice_id,
      supply_id: invoice.supply_id,
      supplier: invoice.supplier,
    }))
  );

  const filtered = flatSupplyItems.filter((item) =>
    item.supplier?.company_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mb-20">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold dark:text-slate-200">Supply List</h1>
      </div>

      <input
        type="text"
        placeholder="Search by supplier name"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="mb-4 px-3 py-2 border rounded w-full max-w-sm"
      />

      <table className="min-w-full table-auto border border-slate-200 shadow-sm rounded-md">
        <thead className="bg-slate-200 text-left text-sm font-semibold text-gray-700">
          <tr>
            <th className="border px-4 py-3">Supply ID</th>
            <th className="border px-4 py-3">Supplier</th>
            <th className="border px-4 py-3 ">Supply Date</th>
            <th className="border px-4 py-3 hidden sm:table-cell">
              Invoice ID
            </th>
            <th className="border px-4 py-3 hidden sm:table-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.length > 0 ? (
            paginatedItems.map((item) => {
              const isHighlighted = highlightedSupplyId === item.supply_id;
              return (
                <tr
                  key={item.id}
                  data-supply={item.supply_id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 even:bg-slate-200 text-md ${
                    isHighlighted ? "bg-green-100" : ""
                  }`}
                >
                  <td className="border px-4 py-2 text-green-600">
                    {item.supply_id || "N/A"}
                  </td>
                  <td
                    className="max-w-xs truncate whitespace-nowrap overflow-hidden border px-4 py-2 dark:text-white"
                    title={item.supplier?.company_id || "N/A"}
                  >
                    {item.supplier?.company_id || "N/A"}
                  </td>
                  <td className="border px-4 py-2 dark:text-white">
                    {item.invoice_date
                      ? new Date(item.invoice_date).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2 text-green-500 hidden sm:table-cell">
                    {item.invoice_id || "N/A"}
                  </td>
                  <td className="border px-2 py-2 flex space-x-2 hidden sm:table-cell">
                    <button
                      onClick={() => navigate(`/edit-supply/${item.id}`)}
                      className="text-blue-500 hover:bg-slate-200 dark:hover:bg-slate-600 p-2 rounded-lg transition"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:bg-slate-200 dark:hover:bg-slate-600 p-2 rounded-lg transition"
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? (
                        <div className="w-5 h-5 border-2 border-t-transparent border-red-500 rounded-full animate-spin"></div>
                      ) : (
                        <RiDeleteBinFill className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })
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
