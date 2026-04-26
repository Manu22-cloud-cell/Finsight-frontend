import { useEffect, useState } from "react";
import API from "../services/api";
import { toastApiError } from "../utils/toast";
import PremiumGuard from "../components/PremiumGuard";

const AlertsContent = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/alerts");

      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setAlerts(sorted);
    } catch (err) {
      toastApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/alerts/${id}/read`);

      setAlerts((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, isRead: true } : a
        )
      );
    } catch (err) {
      toastApiError(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <h2>⏳ Loading Alerts...</h2>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="card">
        <h2>🔔 Alerts</h2>
        <p>No alerts yet 🎉</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>🔔 Alerts ({unreadCount} new)</h2>

      {alerts.map((a) => (
        <div
          key={a._id}
          className="card"
          style={{
            background: a.isRead ? "#fff" : "#eef2ff",
            borderLeft: a.isRead
              ? "4px solid transparent"
              : "4px solid #6366f1",
          }}
          onClick={() => !a.isRead && markAsRead(a._id)}
        >
          <div style={styles.alertContent}>
            <p style={styles.message}>{a.message}</p>

            {!a.isRead && (
              <span style={styles.unreadBadge}>NEW</span>
            )}
          </div>

          <small style={styles.time}>
            {new Date(a.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
};

const Alerts = () => {
  return (
    <PremiumGuard message="Upgrade to premium to access alerts">
      <AlertsContent />
    </PremiumGuard>
  );
};

const styles = {
  alertContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  message: {
    margin: 0,
    fontWeight: 500,
  },

  time: {
    color: "#6b7280",
    fontSize: "12px",
  },

  unreadBadge: {
    background: "#6366f1",
    color: "#fff",
    fontSize: "10px",
    padding: "3px 6px",
    borderRadius: "6px",
    fontWeight: "bold",
  },
};

export default Alerts;