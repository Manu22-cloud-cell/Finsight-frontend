import { useEffect, useState } from "react";
import { toastApiError, toastInfo } from "../utils/toast";

const PremiumGuard = ({ children, message }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shownInfo, setShownInfo] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      setUser(u);
    } catch (err) {
      setUser(null);
      toastApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Show toast for non-premium users
  useEffect(() => {
    if (!loading && user && !user.isPremium && !shownInfo) {
      toastInfo(message || "Upgrade to premium to access this feature");
      setShownInfo(true);
    }
  }, [user, loading, shownInfo, message]);

  // Loading state
  if (loading) {
    return (
      <div className="card">
        <h2>⏳ Loading...</h2>
      </div>
    );
  }

  // Not premium
  if (!user?.isPremium) {
    return (
      <div className="card">
        <h2>🔒 Premium Feature</h2>
        <p>{message || "Upgrade to access this feature"}</p>
      </div>
    );
  }

  // Premium → render actual content
  return children;
};

export default PremiumGuard;