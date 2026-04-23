import toast from "react-hot-toast";

// Success
export const toastSuccess = (message) => {
  toast.success(message);
};

// Error
export const toastError = (message) => {
  toast.error(message);
};

// Info
export const toastInfo = (message) => {
  toast(message);
};

// Warning (custom)
export const toastWarning = (message) => {
  toast(message, {
    icon: "⚠️",
  });
};

// API error handler
export const toastApiError = (err) => {
  const msg =
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong";

  toast.error(msg);
};