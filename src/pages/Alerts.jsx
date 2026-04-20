import { useEffect, useState } from "react";
import API from "../services/api";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const res = await API.get("/alerts");
      setAlerts(res.data);
    };

    fetchAlerts();
  }, []);

  return (
    <div className="dashboard">
      <h2>🔔 Alerts</h2>

      {alerts.length === 0 ? (
        <p>No alerts</p>
      ) : (
        alerts.map((a) => (
          <div key={a._id} className="card">
            <p>{a.message}</p>
            <small>
              {new Date(a.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
};

export default Alerts;