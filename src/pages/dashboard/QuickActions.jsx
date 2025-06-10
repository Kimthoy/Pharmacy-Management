import { PlusIcon, TruckIcon } from "@heroicons/react/24/outline";

const QuickActions = ({ onAction }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <button
        className="flex items-center text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-4 py-2 rounded-md hover:bg-emerald-500 dark:hover:bg-emerald-400 hover:text-white dark:hover:text-white transition"
        onClick={() => onAction("Add Prescription")}
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Prescription
      </button>
      <button
        className="flex items-center text-xs text-blue-500 dark:text-blue-400 border border-blue-500 dark:border-blue-400 px-4 py-2 rounded-md hover:bg-blue-500 dark:hover:bg-blue-400 hover:text-white dark:hover:text-white transition"
        onClick={() => onAction("Restock Inventory")}
      >
        <TruckIcon className="h-5 w-5 mr-2" />
        Restock Product
      </button>
    </div>
  );
};

export default QuickActions;
