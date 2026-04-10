const SummaryCards = ({ summary }) => {
  return (
    <div className="flex">
      <div className="card">
        <h3>💰 Income</h3>
        <p>₹{summary.totalIncome}</p>
      </div>

      <div className="card">
        <h3>💸 Expense</h3>
        <p>₹{summary.totalExpense}</p>
      </div>

      <div className="card">
        <h3>💳 Balance</h3>
        <p>₹{summary.balance}</p>
      </div>
    </div>
  );
};

export default SummaryCards;