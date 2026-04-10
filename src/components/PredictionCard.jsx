const PredictionCard = ({ prediction }) => {
  if (!prediction) return null;

  return (
    <div className="card">
      <h3>🔮 Prediction</h3>
      <p>Predicted Expense: ₹{prediction.predictedExpense}</p>
      <p>Daily Burn: ₹{prediction.dailyBurnRate}</p>
      <p>Remaining Budget: ₹{prediction.remainingBudget}</p>
      <p>Days Left: {prediction.daysToExhaustBudget}</p>
      <p><strong>{prediction.message}</strong></p>
    </div>
  );
};

export default PredictionCard;