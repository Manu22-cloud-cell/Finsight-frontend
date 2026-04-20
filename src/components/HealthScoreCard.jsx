import React from "react";

const HealthScoreCard = ({ score = 0, insights = [] }) => {
    const radius = 70;
    const stroke = 10;
    const normalizedRadius = radius - stroke * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;

    const progress = score / 100;
    const strokeDashoffset = circumference - progress * circumference;

    const getColor = () => {
        if (score >= 80) return "#16a34a"; // green
        if (score >= 50) return "#f59e0b"; // yellow
        return "#dc2626"; // red
    };

    const getStatus = () => {
        if (score >= 80) return "Excellent 💪";
        if (score >= 50) return "Average ⚠️";
        return "Risky 🚨";
    };

    return (
        <div className="card" style={{ textAlign: "center" }}>
            <h3>💡 Financial Health Score</h3>

            {/* 🔥 Circular Progress */}
            <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                <svg height={radius * 2} width={radius * 2}>

                    {/* Background circle */}
                    <circle
                        stroke="#e5e7eb"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />

                    {/* Progress circle */}
                    <circle
                        stroke={getColor()}
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={`${circumference} ${circumference}`}
                        style={{
                            strokeDashoffset,
                            transition: "stroke-dashoffset 0.8s ease",
                            filter: "drop-shadow(0 0 6px rgba(0,0,0,0.2))",
                        }}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        transform={`rotate(-90 ${radius} ${radius})`}
                    />

                    {/* Score text */}
                    <text
                        x="50%"
                        y="50%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize="22"
                        fontWeight="bold"
                        fill={getColor()}
                    >
                        {score}
                    </text>

                </svg>
            </div>

            {/* Status */}
            <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                {getStatus()}
            </p>

            {/* Insights */}
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
                {insights?.map((insight, index) => (
                    <p key={index}>{insight}</p>
                ))}
            </div>
        </div>
    );
};

export default HealthScoreCard;