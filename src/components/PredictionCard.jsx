const PredictionCard = ({ prediction }) => {
  if (!prediction) return null;

  return (
    <div className="card">
      <h3>🔮 Smart Insights</h3>

      <div style={{ display: "grid", gap: "8px" }}>
        <p>Predicted Expense: ₹{prediction.predictedExpense}</p>
        <p>Daily Burn: ₹{prediction.dailyBurnRate}</p>
        <p>Remaining Budget: ₹{prediction.remainingBudget}</p>
        <p>Days Left: {prediction.daysToExhaustBudget}</p>
      </div>

      <p style={{ marginTop: "10px", color: "#4CAF50" }}>
        {prediction.message}
      </p>
    </div>
  );
};

export default PredictionCard;