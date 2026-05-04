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

    const formatCurrency = (value) =>
        `₹${value.toLocaleString("en-IN")}`;

    const { chartData, total } = useMemo(() => {
        const entries = Object.entries(data).map(([key, value]) => ({
            name: key,
            value,
        }));

        entries.sort((a, b) => b.value - a.value);

        const topCategories = entries.slice(0, MAX_CATEGORIES);
        const others = entries.slice(MAX_CATEGORIES);

        if (others.length > 0) {
            const othersValue = others.reduce(
                (sum, item) => sum + item.value,
                0
            );

            topCategories.push({
                name: "Others",
                value: othersValue,
                breakdown: others,
            });
        }

        const total = entries.reduce((sum, item) => sum + item.value, 0);

        return { chartData: topCategories, total };
    }, [data]);

    const getColor = (index) => {
        const hue = (index * 40) % 360;
        return `hsl(${hue}, 70%, 60%)`;
    };

    return (
        <div className="card">
            <h3>📊 Category Breakdown</h3>

            {/* TOTAL */}
            <p style={{ fontSize: "14px", marginBottom: "10px" }}>
                Total: <strong>{formatCurrency(total)}</strong>
            </p>

            <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius="80%"
                        minAngle={5}
                        paddingAngle={2}
                        label={({ percent }) =>
                            percent > 0.02 ? `${(percent * 100).toFixed(0)}%` : ""
                        }
                        labelLine={true}
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

                    {/* TOOLTIP WITH BREAKDOWN */}
                    <Tooltip
                        content={({ active, payload }) => {
                            if (!active || !payload || !payload.length) return null;

                            const item = payload[0].payload;

                            return (
                                <div
                                    style={{
                                        background: "#fff",
                                        padding: "10px",
                                        border: "1px solid #ccc",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                    }}
                                >
                                    <strong>{item.name}</strong>
                                    <p>{formatCurrency(item.value)}</p>

                                    {item.breakdown && (
                                        <div style={{ marginTop: "6px" }}>
                                            {item.breakdown.map((b, i) => (
                                                <div key={i}>
                                                    {b.name}: {formatCurrency(b.value)}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }}
                    />

                    {/* RESPONSIVE LEGEND */}
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{
                            fontSize: "12px",
                            marginTop: "10px",
                            lineHeight: "18px",
                        }}
                        formatter={(value) => {
                            const item = chartData.find(
                                (d) => d.name === value
                            );
                            return `${value} (${formatCurrency(item?.value || 0)})`;
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CategoryChart;