import { useEffect, useState } from "react";
import { getAllMedicines } from "../api/medicineService";
import { updateStock, createStock } from "../api/stockService";

//toast for notification
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const StockForm = ({ onClose, stock = null, onSaved }) => {
  const [medicine, setMedicines] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    medicine_id: stock?.medicine_id || "",
    quantity: stock?.quantity || "",
    price_in: stock?.price_in || "",
    received_date: stock?.received_date || getTodayDate(),
    notes: stock?.notes || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (stock) {
        await updateStock(stock.id, form);
         toast.success("Stock updated successfully!");
      } else {
        await createStock(form);
         toast.success("Stock created successfully!");
      }
      onSaved();
      
      onClose();
    } catch (error) {
       toast.error("Stock cannot submit!");
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const medicines = await getAllMedicines();
        console.log(medicines);
        setMedicines(medicines);
      } catch (error) {
         toast.error("Stock detected and there are some erorr please check the console!");
        setMedicines([]);
      }
    };
    fetchMedicines();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-7"
    >
      <div>
        <label className="block mb-1">Medicine</label>
        <select
          name="medicine_id"
          value={form.medicine_id}
          onChange={handleChange}
          required
          className="w-full border px-2 py-1"
        >
          <option value="">Select Medicine</option>
          {medicine.map((m) => (
            <option key={m.id} value={m.id}>
              {m.medicine_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          className="w-full border px-2 py-1"
          required
          min={0}
        />
      </div>

      <div>
        <label className="block mb-1">Price In</label>
        <input
          type="number"
          name="price_in"
          value={form.price_in}
          onChange={handleChange}
          className="w-full border px-2 py-1"
          min={0}
        />
      </div>

      <div>
        <label className="block mb-1">Received Date</label>
        <input
          type="date"
          name="received_date"
          value={form.received_date}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block mb-1">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        />
      </div>

      <div className="flex  mt-4 md:col-span-2">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-1 rounded mr-3 shadow-lg hover:bg-green-600"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? stock
              ? "Updating..."
              : "Creating..."
            : stock
            ? "Update"
            : "Create"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 px-4 py-1 rounded shadow-lg hover:bg-slate-400"
        >
          Close
        </button>
      </div>
    </form>
  );
};

export default StockForm;
