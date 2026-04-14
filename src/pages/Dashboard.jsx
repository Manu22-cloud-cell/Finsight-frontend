import { useEffect, useState } from "react";
import API from "../services/api";
import SummaryCards from "../components/SummaryCards";
import PredictionCard from "../components/PredictionCard";
import CategoryChart from "../components/CategoryChart";
import TrendChart from "../components/TrendChart";


const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/analytics/dashboard");
        setData(res.data.dashboard);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  if (!data) return <h2>Loading...</h2>;

  return (
    <div className="dashboard">
      <h1>📊 FinSight Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-3">
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