import { useEffect, useState } from "react";
import API from "../services/api";
import { toastApiError } from "../utils/toast";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const unreadCount = alerts.filter(a => !a.isRead).length;

  // FETCH ALERTS
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/alerts");

      // Sort latest first
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

  // MARK AS READ
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

  return (
    <div className="dashboard">
      <div style={styles.header}>
        <h2>🔔 Alerts ({unreadCount} new)</h2>
      </div>

      {/* LOADING */}
      {loading ? (
        <div style={styles.center}>
          <p>Loading alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div style={styles.center}>
          <p>No alerts yet 🎉</p>
        </div>
      ) : (
        alerts.map((a) => (
          <div
            key={a._id}
            className="card"
            style={{
              ...styles.alertCard,
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
        ))
      )}
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  center: {
    textAlign: "center",
    marginTop: "40px",
    color: "#6b7280",
  },

  alertCard: {
    cursor: "pointer",
    transition: "all 0.2s",
  },

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