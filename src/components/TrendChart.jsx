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
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    let chartData = [];

    if (Array.isArray(data)) {
        chartData = data.map((item) => ({
            month: monthNames[item.month - 1],
            income: item.income,
            expense: item.expense,
            savings: item.income - item.expense,
        }));
    } else {
        chartData = Object.keys(data)
            .map((key) => {
                const [year, month] = key.split("-").map(Number);
                return {
                    month: `${monthNames[month - 1]} ${year}`,
                    sortKey: year * 100 + month,
                    income: data[key].income,
                    expense: data[key].expense,
                    savings: data[key].income - data[key].expense,
                };
            })
            .sort((a, b) => a.sortKey - b.sortKey);
    }

    return (
        <div className="card">
            <h3>📈 Monthly Trends</h3>

            <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                    />

                    <YAxis
                        tickFormatter={(value) =>
                            value >= 1000
                                ? `₹${(value / 1000).toFixed(1)}k`
                                : `₹${value}`
                        }
                    />

                    <Tooltip
                        formatter={(value, name) => {
                            const label =
                                name === "income"
                                    ? "Income"
                                    : name === "expense"
                                        ? "Expense"
                                        : "Savings";
                            return [`₹${value.toLocaleString("en-IN")}`, label];
                        }}
                        contentStyle={{
                            borderRadius: "8px",
                            fontSize: "12px",
                        }}
                    />

                    <Legend
                        formatter={(value) =>
                            value === "income"
                                ? "Income"
                                : value === "expense"
                                    ? "Expense"
                                    : "Savings"
                        }
                    />

                    <Line
                        type="natural"
                        dataKey="income"
                        stroke="#2e7d32"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />

                    <Line
                        type="natural"
                        dataKey="expense"
                        stroke="#c62828"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />

                    <Line
                        type="natural"
                        dataKey="savings"
                        stroke="#1565c0"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrendChart;