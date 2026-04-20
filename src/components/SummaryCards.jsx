const SummaryCards = ({ summary }) => {
  if (!summary) return null;

  const formatCurrency = (value) =>
    `₹${value.toLocaleString("en-IN")}`;

  const getBalanceColor = () => {
    if (summary.balance < 0) return "#c62828"; // red
    if (summary.balance < 5000) return "#ff9800"; // orange
    return "#2e7d32"; // green
  };

  return (
    <>
      {/* Income */}
      <div className="card">
        <p style={{ fontSize: "12px", color: "#777" }}>💰 Income</p>
        <h2 style={{ color: "#2e7d32", marginTop: "6px" }}>
          {formatCurrency(summary.totalIncome)}
        </h2>
      </div>

      {/* Expense */}
      <div className="card">
        <p style={{ fontSize: "12px", color: "#777" }}>💸 Expense</p>
        <h2 style={{ color: "#c62828", marginTop: "6px" }}>
          {formatCurrency(summary.totalExpense)}
        </h2>
      </div>

      {/* Balance */}
      <div className="card">
        <p style={{ fontSize: "12px", color: "#777" }}>💳 Balance</p>
        <h2
          style={{
            color: getBalanceColor(),
            marginTop: "6px",
          }}
        >
          {formatCurrency(summary.balance)}
        </h2>
      </div>
    </>
  );
};

export default SummaryCards;