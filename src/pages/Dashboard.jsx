import { useEffect, useState } from "react";
import API from "../services/api";

// Use your utility
import { toastApiError } from "../utils/toast";

import SummaryCards from "../components/SummaryCards";
import PredictionCard from "../components/PredictionCard";
import CategoryChart from "../components/CategoryChart";
import TrendChart from "../components/TrendChart";
import HealthScoreCard from "../components/HealthScoreCard";
import PremiumGuard from "../components/PremiumGuard";

const DashboardContent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await API.get("/analytics/dashboard");
      setData(res.data.dashboard);

    } catch (err) {
      console.error(err);
      toastApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="card">
        <h2>⏳ Loading Dashboard...</h2>
      </div>
    );
  }

  // No data
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

      <div style={{ marginTop: "20px" }}>
        <HealthScoreCard
          score={data.healthScore}
          insights={data.healthInsights}
        />
      </div>

      <div className="grid grid-3" style={{ marginTop: "20px" }}>
        <SummaryCards summary={data.summary} />
      </div>

      <div style={{ marginTop: "20px" }}>
        <PredictionCard prediction={data.prediction} />
      </div>

      <div className="grid grid-2" style={{ marginTop: "20px" }}>
        <CategoryChart data={data.categories} />
        <TrendChart data={data.trends} />
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <PremiumGuard message="Upgrade to premium to access dashboard">
      <DashboardContent />
    </PremiumGuard>
  );
};

export default Dashboard;