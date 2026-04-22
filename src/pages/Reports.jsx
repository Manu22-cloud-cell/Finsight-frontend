import { useState, useEffect } from "react";
import CategoryChart from "../components/CategoryChart";
import TrendChart from "../components/TrendChart";
import API from "../services/api";

const Reports = () => {
  const [user, setUser] = useState(null);

  const [type, setType] = useState("daily");
  const [data, setData] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [totals, setTotals] = useState({});
  const [categoryData, setCategoryData] = useState({});

  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const formatCurrency = (v) =>
    `₹${(v || 0).toLocaleString("en-IN")}`;

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);

      let query = `/reports?type=${type}`;
      if (type === "daily" && date) query += `&date=${date}`;
      if (type === "monthly") query += `&month=${month}&year=${year}`;
      if (type === "yearly") query += `&year=${year}`;

      const res = await API.get(query);

      setData(res.data.data.transactions || res.data.data.data);
      setTotals(res.data.data.totals || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryData = async () => {
    let query = `/analytics/category-filter?type=${type}`;
    if (type === "daily") query += `&date=${date}`;
    if (type === "monthly") query += `&month=${month}&year=${year}`;
    if (type === "yearly") query += `&year=${year}`;

    const res = await API.get(query);
    setCategoryData(res.data.data);
  };

  const fetchHistory = async () => {
    const res = await API.get("/reports/history");
    setHistory(res.data.data);
  };

  const downloadReport = async () => {
    try {
      const res = await API.get(`/reports/download?type=${type}`);
      window.open(res.data.fileUrl, "_blank");
      fetchHistory();
    } catch {
      alert("Download failed");
    }
  };

  useEffect(() => {
    if (user?.isPremium) {
      fetchReports();
      fetchCategoryData();
    }
  }, [type, date, month, year, user]);

  useEffect(() => {
    if (user?.isPremium) fetchHistory();
  }, [user]);

  // ✅ SAFE RETURN AFTER HOOKS
  if (!user?.isPremium) {
    return (
      <div className="card">
        <h2>🔒 Premium Feature</h2>
        <p>Upgrade to view reports</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>📊 Reports</h2>

      <div className="card">
        <h3>Generate Report</h3>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          <button onClick={fetchReports}>🔍 Fetch</button>
          <button onClick={downloadReport}>⬇️ Download CSV</button>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginTop: "20px" }}>
        <div className="card">
          <h2>{formatCurrency(totals.totalIncome)}</h2>
          <p>Income</p>
        </div>

        <div className="card">
          <h2>{formatCurrency(totals.totalExpense)}</h2>
          <p>Expense</p>
        </div>

        <div className="card">
          <h2>{formatCurrency(totals.balance)}</h2>
          <p>Balance</p>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: "20px" }}>
        <CategoryChart data={categoryData} />

        {type === "yearly" && (
          <TrendChart
            data={Object.fromEntries(
              data.map((item) => [
                monthNames[item.month - 1],
                { income: item.income, expense: item.expense },
              ])
            )}
          />
        )}
      </div>
    </div>
  );
};

export default Reports;