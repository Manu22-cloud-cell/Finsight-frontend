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
    <div className="container">
      <h1>📊 FinSight Dashboard</h1>

      <SummaryCards summary={data.summary} />

      <PredictionCard prediction={data.prediction} />

      <CategoryChart data={data.categories} />

      <TrendChart data={data.trends} />
    </div>
  );
};

export default Dashboard;