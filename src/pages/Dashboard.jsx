import { useEffect, useState } from "react";
import API from "../services/api";
import SummaryCards from "../components/SummaryCards";
import PredictionCard from "../components/PredictionCard";
import CategoryChart from "../components/CategoryChart";
import TrendChart from "../components/TrendChart";
import HealthScoreCard from "../components/HealthScoreCard";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      setUser(u);
    } catch {
      setUser(null);
    }
  }, []);

  // Fetch dashboard ONLY if premium
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await API.get("/analytics/dashboard");
        setData(res.data.dashboard);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.isPremium) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Loading state
  if (loading) {
    return (
      <div className="card">
        <h2>⏳ Loading Dashboard...</h2>
      </div>
    );
  }

  // Premium lock (AFTER hooks)
  if (!user?.isPremium) {
    return (
      <div className="card">
        <h2>🔒 Premium Feature</h2>
        <p>Upgrade to access insights & analytics</p>
      </div>
    );
  }

  // Safety fallback
  if (!data) {
    return (
      <div className="card">
        <h2>⚠️ Failed to load dashboard</h2>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>📊 FinSight Dashboard</h1>

      {/* Health Score */}
      <div style={{ marginTop: "20px" }}>
        <HealthScoreCard
          score={data.healthScore}
          insights={data.healthInsights}
        />
      </div>

      {/* Summary */}
      <div className="grid grid-3" style={{ marginTop: "20px" }}>
        <SummaryCards summary={data.summary} />
      </div>

      {/* Prediction */}
      <div style={{ marginTop: "20px" }}>
        <PredictionCard prediction={data.prediction} />
      </div>

      {/* Charts */}
      <div className="grid grid-2" style={{ marginTop: "20px" }}>
        <CategoryChart data={data.categories} />
        <TrendChart data={data.trends} />
      </div>
    </div>
  );
};

export default Dashboard;