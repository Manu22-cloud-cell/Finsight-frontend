import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />

    {/* GLOBAL TOAST CONFIG HERE */}
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1f2937",
          color: "#fff",
          borderRadius: "10px",
          padding: "12px 16px",
          fontSize: "14px",
        },
        success: {
          style: { background: "#166534" }, // green
        },
        error: {
          style: { background: "#7f1d1d" }, // red
        },
      }}
    />

  </React.StrictMode>
);