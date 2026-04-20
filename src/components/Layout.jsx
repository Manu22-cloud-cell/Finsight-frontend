import Navbar from "./Navbar";
import { useEffect } from "react";
import socket from "../services/socket";
import toast from "react-hot-toast";

const Layout = ({ children }) => {

  // Join user room once
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?._id) {
      console.log("Joining socket room:", user._id);
      socket.emit("join", user._id);
    } else {
      console.log("No user found for socket join ❌");
    }
  }, []);

  // Listen for alerts (with proper cleanup)
  useEffect(() => {

    const handleAlert = (data) => {
      console.log("New Alert received:", data);

      if (data.type === "BUDGET_EXCEEDED") {
        toast.error(`🚨 ${data.message}`);
      } 
      else if (data.type === "HIGH_SPENDING") {
        toast(`⚠️ ${data.message}`, { icon: "💸" });
      } 
      else if (data.type === "CATEGORY_LIMIT") {
        toast(`📊 ${data.message}`, { icon: "📊" });
      } 
      else if (data.type === "PREDICTION_ALERT") {
        toast.success(`📉 ${data.message}`);
      } 
      else {
        toast(data.message);
      }
    };

    socket.on("alert", handleAlert);

    // Cleanup to prevent duplicate listeners
    return () => {
      socket.off("alert", handleAlert);
    };

  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        {children}
      </div>
    </>
  );
};

export default Layout;