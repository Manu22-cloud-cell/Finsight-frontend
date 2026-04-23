import { useState, useEffect } from "react";
import CategoryChart from "../components/CategoryChart";
import TrendChart from "../components/TrendChart";
import API from "../services/api";

// Import toast utils
import {
  toastApiError,
  toastError,
  toastInfo,
  toastSuccess
} from "../utils/toast";

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
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const formatCurrency = (v) =>
    `₹${(v || 0).toLocaleString("en-IN")}`;

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
  }, []);

  const fetchReports = async () => {
    try {

      if (type === "daily" && !date) {
        return toastInfo("Please select a date");
      }

      if (type === "monthly" && !month) {
        return toastInfo("Please select a month");
      }

      setLoading(true);

      let query = `/reports?type=${type}`;
      if (type === "daily" && date) query += `&date=${date}`;
      if (type === "monthly") query += `&month=${month}&year=${year}`;
      if (type === "yearly") query += `&year=${year}`;

      const res = await API.get(query);

      setData(res.data.data.transactions || res.data.data.data);
      setTotals(res.data.data.totals || {});
    } catch (err) {
      toastApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryData = async () => {
    try {
      let query = `/analytics/category-filter?type=${type}`;
      if (type === "daily") query += `&date=${date}`;
      if (type === "monthly") query += `&month=${month}&year=${year}`;
      if (type === "yearly") query += `&year=${year}`;

      const res = await API.get(query);
      setCategoryData(res.data.data);
    } catch (err) {
      toastApiError(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await API.get("/reports/history");
      setHistory(res.data.data);
    } catch (err) {
      toastApiError(err);
    }
  };

  const downloadReport = async () => {
    try {
      const res = await API.get(`/reports/download?type=${type}`);
      window.open(res.data.fileUrl, "_blank");
      toastSuccess("Report Downloaded");
      fetchHistory();
    } catch (err) {
      toastError("Download failed");
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

  // 🔒 Premium check
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

      {/* Filters */}
      <div className="card">
        <h3>Generate Report</h3>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          {type === "daily" && (
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          )}

          {type === "monthly" && (
            <>
              <select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">Select Month</option>
                {monthNames.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>

              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </>
          )}

          {type === "yearly" && (
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          )}

          <button onClick={fetchReports} disabled={loading}>
            {loading ? "Loading..." : "🔍 Fetch"}
          </button>
          <button onClick={downloadReport}>⬇️ Download CSV</button>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-3" style={{ marginTop: "20px" }}>
        <div className="card">
          <p style={{ fontSize: "12px", color: "#777" }}>💰 Total Income</p>
          <h2 style={{ color: "#2e7d32" }}>
            {formatCurrency(totals.totalIncome)}
          </h2>
        </div>

        <div className="card">
          <p style={{ fontSize: "12px", color: "#777" }}>💸 Total Expense</p>
          <h2 style={{ color: "#c62828" }}>
            {formatCurrency(totals.totalExpense)}
          </h2>
        </div>

        <div className="card">
          <p style={{ fontSize: "12px", color: "#777" }}>💳 Balance</p>
          <h2 style={{
            color: totals.balance < 0 ? "#c62828" : "#2e7d32"
          }}>
            {formatCurrency(totals.balance)}
          </h2>
        </div>
      </div>

      {/* Charts */}
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

      {/* Table */}
      <div className="card">
        <h3>Report Data</h3>

        {loading ? (
          <p style={{ textAlign: "center", padding: "20px" }}>
            ⏳ Fetching report...
          </p>
        ) : data.length === 0 ? (
          <p style={{ textAlign: "center", padding: "20px", color: "#777" }}>
            📭 No data found for selected filters
          </p>
        ) : type === "yearly" ? (
          <table className="report-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Income</th>
                <th>Expense</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{monthNames[item.month - 1]}</td>
                  <td style={{ color: "#2e7d32" }}>
                    {formatCurrency(item.income)}
                  </td>
                  <td style={{ color: "#c62828" }}>
                    {formatCurrency(item.expense)}
                  </td>
                  <td style={{ fontWeight: "500" }}>
                    {formatCurrency(item.income - item.expense)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>
                    <span className={item.type === "income" ? "badge income" : "badge expense"}>
                      {item.type}
                    </span>
                  </td>
                  <td>{item.category}</td>
                  <td style={{
                    textAlign: "right",
                    color: item.type === "income" ? "#2e7d32" : "#c62828"
                  }}>
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* History */}
      <div className="card">
        <h3>Download History</h3>

        {history.length === 0 ? (
          <p>No reports downloaded yet</p>
        ) : (
          <div className="history-list">
            {history.map((h, index) => (
              <div key={index} className="history-item">
                <span>
                  {new Date(h.downloadedAt).toLocaleString()}
                </span>

                <a href={h.fileUrl} target="_blank" rel="noreferrer">
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports; 