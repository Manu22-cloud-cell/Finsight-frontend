import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
} from "recharts";

const TrendChart = ({ data }) => {
    if (!data) return null;

    // Convert object → array
    const chartData = Object.keys(data).map((key) => ({
        month: key,
        income: data[key].income,
        expense: data[key].expense,
    }));

    return (
        <div className="card">
            <h3>📈 Monthly Trends</h3>

            <LineChart width={600} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line type="monotone" dataKey="income" />
                <Line type="monotone" dataKey="expense" />
            </LineChart>
        </div>
    );
};

export default TrendChart;