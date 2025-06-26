import { motion, AnimatePresence } from "framer-motion";

const ToastNotification = ({ toast }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 left-0 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white shadow-lg z-50 ${
            toast.type === "success"
              ? "bg-green-600"
              : toast.type === "error"
              ? "bg-red-600"
              : "bg-blue-600"
          }`}
        >
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastNotification;
