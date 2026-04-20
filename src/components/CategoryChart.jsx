import { useMemo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const MAX_CATEGORIES = 6;

const CategoryChart = ({ data }) => {
    if (!data) return null;

    const chartData = useMemo(() => {
        const entries = Object.entries(data).map(([key, value]) => ({
            name: key,
            value,
        }));

        // sort descending
        entries.sort((a, b) => b.value - a.value);

        const topCategories = entries.slice(0, MAX_CATEGORIES);
        const others = entries.slice(MAX_CATEGORIES);

        if (others.length > 0) {
            const othersValue = others.reduce((sum, item) => sum + item.value, 0);
            topCategories.push({
                name: "Others",
                value: othersValue,
            });
        }

        return topCategories;
    }, [data]);

    const getColor = (index) => {
        const hue = (index * 40) % 360;
        return `hsl(${hue}, 70%, 60%)`;
    };

    return (
        <div className="card">
            <h3>📊 Category Breakdown</h3>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label={({ percent }) =>
                            percent > 0.05
                                ? `${(percent * 100).toFixed(0)}%`
                                : ""
                        }
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={
                                    entry.name === "Others"
                                        ? "#ccc"
                                        : getColor(index)
                                }
                            />
                        ))}
                    </Pie>

                    <Tooltip
                        formatter={(value, name) => [`₹${value}`, name]}
                    />

                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{
                            maxHeight: "250px",
                            overflowY: "auto",
                            fontSize: "12px",
                        }}
                        formatter={(value) => {
                            const item = chartData.find(
                                (d) => d.name === value
                            );
                            return `${value} (₹${item?.value})`;
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CategoryChart;