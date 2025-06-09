const ToastNotification = ({ toast }) => {
  if (!toast) return null;

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg text-white shadow-lg z-50 ${
        toast.type === "success"
          ? "bg-green-600"
          : toast.type === "error"
          ? "bg-red-600"
          : "bg-blue-600"
      }`}
    >
      {toast.message}
    </div>
  );
};

export default ToastNotification;
