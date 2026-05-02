const PredictionCard = ({ prediction }) => {
  if (!prediction) return null;

  const formatCurrency = (value) =>
    `₹${value.toLocaleString("en-IN")}`;

  const getStatus = () => {
    if (prediction.remainingBudget <= 0) {
      return { color: "#c62828", label: "⚠️ Over Budget" };
    }
    if (prediction.daysToExhaustBudget < 5) {
      return { color: "#ff9800", label: "⚠️ Risk" };
    }
    return { color: "#2e7d32", label: "✅ Safe" };
  };

  const status = getStatus();

  const usedPercent = prediction.usagePercent || 0;

  const predictedPercent = prediction.predictedUsagePercent || 0;

  return (
    <div className="card">
      <h3>🔮 Smart Insights</h3>

      {/* Alert Badge */}
      <div
        style={{
          marginTop: "8px",
          display: "inline-block",
          padding: "4px 10px",
          borderRadius: "20px",
          backgroundColor: `${status.color}20`,
          color: status.color,
          fontSize: "12px",
          fontWeight: "600",
        }}
      >
        {status.label}
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
          marginTop: "12px",
        }}
      >
        <div>
          <p style={{ fontSize: "12px", color: "#777" }}>
            💸 Predicted Expense
          </p>
          <h4>{formatCurrency(prediction.predictedExpense)}</h4>
        </div>

        <div>
          <p style={{ fontSize: "12px", color: "#777" }}>
            🔥 Daily Burn
          </p>
          <h4>{formatCurrency(prediction.dailyBurnRate)}</h4>
        </div>

        <div>
          <p style={{ fontSize: "12px", color: "#777" }}>
            📉 Remaining Budget
          </p>
          <h4 style={{ color: status.color }}>
            {formatCurrency(prediction.remainingBudget)}
          </h4>
        </div>

        <div>
          <p style={{ fontSize: "12px", color: "#777" }}>
            ⏳ Days Left
          </p>
          <h4 style={{ color: status.color }}>
            {prediction.daysToExhaustBudget}
          </h4>
        </div>
      </div>

      {/* CURRENT USAGE (Corrected) */}
      <div style={{ marginTop: "16px" }}>
        <p style={{ fontSize: "12px", color: "#777", marginBottom: "6px" }}>
          Budget Usage (Current)
        </p>

        <div
          style={{
            width: "100%",
            height: "10px",
            backgroundColor: "#eee",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min(usedPercent, 100)}%`,
              height: "100%",
              backgroundColor: status.color,
              transition: "width 0.5s ease",
            }}
          />
        </div>

        <p style={{ fontSize: "12px", marginTop: "4px" }}>
          {usedPercent.toFixed(0)}% used
        </p>
      </div>

      {/* PREDICTION INSIGHT */}
      <div style={{ marginTop: "10px" }}>
        <p style={{ fontSize: "12px", color: "#777" }}>
          📊 Expected Usage (End of Month)
        </p>
        <p
          style={{
            fontSize: "13px",
            fontWeight: "500",
            color:
              predictedPercent > 100
                ? "#c62828"
                : predictedPercent > 80
                  ? "#ff9800"
                  : "#2e7d32",
          }}
        >
          {predictedPercent.toFixed(0)}% of budget
        </p>
      </div>

      {/* Insight Message */}
      <p
        style={{
          marginTop: "14px",
          color: status.color,
          fontWeight: "500",
        }}
      >
        {prediction.message}
      </p>
    </div>
  );
};

export default PredictionCard;