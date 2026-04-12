import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF4560",
];

const CategoryChart = ({ data }) => {
    if (!data) return null;

    const chartData = Object.keys(data).map((key) => ({
        name: key,
        value: data[key],
    }));

    return (
        <div className="card">
            <h3>📊 Category Breakdown</h3>

            <PieChart width={400} height={300}>
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>

                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
};

export default CategoryChart;