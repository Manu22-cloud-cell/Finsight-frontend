import React, { useEffect, useState } from "react";

const HealthScoreCard = ({ score = 0, insights = [] }) => {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 800;
        const increment = score / (duration / 16);

        const animate = () => {
            start += increment;
            if (start < score) {
                setAnimatedScore(Math.floor(start));
                requestAnimationFrame(animate);
            } else {
                setAnimatedScore(score);
            }
        };

        animate();
    }, [score]);

    const radius = 70;
    const stroke = 10;
    const normalizedRadius = radius - stroke * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;

    const progress = animatedScore / 100;
    const strokeDashoffset = circumference - progress * circumference;

    const getColor = () => {
        if (score >= 80) return "#16a34a";
        if (score >= 50) return "#f59e0b";
        return "#dc2626";
    };

    const getStatus = () => {
        if (score >= 80) return "Excellent 💪";
        if (score >= 50) return "Average ⚠️";
        return "Risky 🚨";
    };

    const color = getColor();

    return (
        <div className="card" style={{ textAlign: "center" }}>
            <h3>💡 Financial Health Score</h3>

            {/* Circle */}
            <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                <svg height={radius * 2} width={radius * 2}>

                    {/* Background */}
                    <circle
                        stroke="#e5e7eb"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />

                    {/* Progress */}
                    <circle
                        stroke={color}
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

                    {/* Score */}
                    <text
                        x="50%"
                        y="50%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize="22"
                        fontWeight="bold"
                        fill={color}
                    >
                        {animatedScore}
                    </text>

                    {/* /100 label */}
                    <text
                        x="50%"
                        y="65%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#888"
                    >
                        /100
                    </text>

                </svg>
            </div>

            {/* Status Badge */}
            <div
                style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    backgroundColor: `${color}20`,
                    color: color,
                    fontWeight: "600",
                    fontSize: "12px",
                    marginBottom: "12px",
                }}
            >
                {getStatus()}
            </div>

            {/* Insights */}
            <div
                style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    textAlign: "left",
                    marginTop: "10px",
                }}
            >
                {insights?.map((insight, index) => (
                    <p key={index} style={{ marginBottom: "6px" }}>
                        👉 {insight}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default HealthScoreCard;