import { useState, useEffect } from "react";
import CategoryChart from "../components/CategoryChart";
import TrendChart from "../components/TrendChart";
import API from "../services/api";

const Reports = () => {
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

    const fetchReports = async () => {
        try {
            setLoading(true);

            let query = `/reports?type=${type}`;

            if (type === "daily" && date) {
                query += `&date=${date}`;
            }

            if (type === "monthly") {
                query += `&month=${month}&year=${year}`;
            }

            if (type === "yearly") {
                query += `&year=${year}`;
            }

            const res = await API.get(query);

            setData(res.data.data.transactions || res.data.data.data);
            setTotals(res.data.data.totals || {});
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = async () => {
        try {
            const res = await API.get(`/reports/download?type=${type}`);
            window.open(res.data.fileUrl, "_blank");
            fetchHistory();
        } catch (err) {
            console.error(err);
            alert("Download failed");
        }
    };

    const fetchHistory = async () => {
        const res = await API.get("/reports/history");
        setHistory(res.data.data);
    };

    const fetchCategoryData = async () => {
        let query = `/analytics/category-filter?type=${type}`;

        if (type === "daily") query += `&date=${date}`;
        if (type === "monthly") query += `&month=${month}&year=${year}`;
        if (type === "yearly") query += `&year=${year}`;

        const res = await API.get(query);
        setCategoryData(res.data.data);
    };

    useEffect(() => {
        fetchReports();
        fetchHistory();
        fetchCategoryData();
    }, [type, date, month, year]);

    return (
        <div className="dashboard">

            <h2>📊 Reports</h2>

            {/* Filters + Actions */}
            <div className="card">
                <h3>Generate Report</h3>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={{ flex: 1 }}
                    >
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>

                    {/* Dynamic Filters */}
                    {type === "daily" && (
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    )}

                    {type === "monthly" && (
                        <>
                            <input
                                type="number"
                                placeholder="Month (1-12)"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            />
                        </>
                    )}

                    {type === "yearly" && (
                        <input
                            type="number"
                            placeholder="Year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />
                    )}

                    <button onClick={fetchReports} style={{ width: "150px" }}>
                        Fetch
                    </button>

                    <button onClick={downloadReport} style={{ width: "180px" }}>
                        Download CSV
                    </button>

                </div>
            </div>

            {/* Subtotal */}

            <div className="grid grid-3" style={{ marginTop: "20px" }}>
                <div className="card">
                    <h3>Total Income</h3>
                    <p>₹{totals.totalIncome || 0}</p>
                </div>

                <div className="card">
                    <h3>Total Expense</h3>
                    <p>₹{totals.totalExpense || 0}</p>
                </div>

                <div className="card">
                    <h3>Balance</h3>
                    <p>₹{totals.balance || 0}</p>
                </div>
            </div>

            <div className="grid grid-2" style={{ marginTop: "20px" }}>

                {/* Category Chart (Filtered) */}
                <CategoryChart data={categoryData} />

                {/* Yearly Chart ONLY for yearly */}
                {type === "yearly" && (
                    <TrendChart
                        data={Object.fromEntries(
                            data.map((item) => [
                                `Month ${item.month}`,
                                { income: item.income, expense: item.expense },
                            ])
                        )}
                    />
                )}

            </div>

            {/* Report Table */}
            <div className="card">
                <h3>Report Data</h3>

                {loading ? (
                    <p>Loading...</p>
                ) : data.length === 0 ? (
                    <p>No data found</p>
                ) : type === "yearly" ? (

                    // ✅ Yearly Table
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
                                    <td>₹{item.income}</td>
                                    <td>₹{item.expense}</td>
                                    <td>₹{item.income - item.expense}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                ) : (

                    // ✅ Daily / Monthly Table
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td>{new Date(item.date).toLocaleDateString()}</td>
                                    <td>
                                        <span
                                            className={
                                                item.type === "income"
                                                    ? "badge income"
                                                    : "badge expense"
                                            }
                                        >
                                            {item.type}
                                        </span>
                                    </td>
                                    <td>{item.category}</td>
                                    <td>₹{item.amount}</td>
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