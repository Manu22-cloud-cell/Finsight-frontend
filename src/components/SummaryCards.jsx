const SummaryCards = ({ summary }) => {
  return (
    <>
      <div className="card">
        <h3>💰 Income</h3>
        <p style={{ color: "green" }}>₹{summary.totalIncome}</p>
      </div>

      <div className="card">
        <h3>💸 Expense</h3>
        <p style={{ color: "red" }}>₹{summary.totalExpense}</p>
      </div>

      <div className="card">
        <h3>💳 Balance</h3>
        <p style={{ color: "#2563eb" }}>₹{summary.balance}</p>
      </div>
    </>
  );
};

export default SummaryCards;