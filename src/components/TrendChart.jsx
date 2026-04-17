import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const TrendChart = ({ data }) => {
  if (!data) return null;

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  let chartData = [];

  // Case 1: Array format (Reports yearly)
  if (Array.isArray(data)) {
    chartData = data.map((item) => ({
      month: monthNames[item.month - 1],
      income: item.income,
      expense: item.expense,
    }));
  }

  // Case 2: Object format (Dashboard)
  else {
    chartData = Object.keys(data).map((key) => ({
      month: key,
      income: data[key].income,
      expense: data[key].expense,
    }));
  }

  return (
    <div className="card">
      <h3>📈 Monthly Trends</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
          />

          <YAxis />

          <Tooltip formatter={(value) => `₹${value}`} />

          <Legend />

          {/* Income */}
          <Line
            type="monotone"
            dataKey="income"
            stroke="#2e7d32"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

          {/* Expense */}
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#c62828"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;