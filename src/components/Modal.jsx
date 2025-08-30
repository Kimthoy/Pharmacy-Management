import { useTranslation } from "../hooks/useTranslation";

const Modal = ({ isOpen, onClose, onConfirm, message }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6  shadow-lg">
        <h1 className="font-extrabold text-2xl text-red-600 mb-4">ចាកចេញ!</h1>
        <p className="text-gray-800 dark:text-gray-200 mb-2">
          សូមចុច <span className="font-semibold text-red-500">យល់ព្រម</span>
          ដើម្បីចាកចេញពីប្រព័ន្ធ។
        </p>
        <p className="text-gray-800 dark:text-gray-200 mb-2">
          បន្ទាប់ពីចាកចេញ អ្នកនឹងត្រូវចូលម្ដងទៀត ដោយប្រើឈ្មោះអ្នកប្រើ
          និងពាក្យសម្ងាត់។
        </p>
        <p className="text-gray-800 dark:text-gray-200 mb-4">
          ប្រសិនបើអ្នកមិនចង់ចាកចេញទេ សូមចុច{" "}
          <span className="font-semibold">បោះបង់</span>។
        </p>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            {t("topbar.cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md"
          >
            {t("topbar.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
