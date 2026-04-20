import { useState } from "react";
import API from "../../services/api";
import { expenseCategories, incomeCategories } from "../../constants/categories";

const TransactionForm = ({ onSuccess }) => {

  const getToday = () => new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    note: "",
    date: getToday(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      setForm({ ...form, type: value, category: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/transactions", form);
      onSuccess();

      setForm({
        type: "expense",
        amount: "",
        category: "",
        note: "",
        date: getToday(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        style={styles.input}
      >
        <option value="expense">💸 Expense</option>
        <option value="income">💰 Income</option>
      </select>

      <input
        type="number"
        name="amount"
        placeholder="Enter amount (₹)"
        value={form.amount}
        onChange={handleChange}
        required
        style={styles.input}
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
        style={styles.input}
      >
        <option value="">
          {form.type === "income"
            ? "Select income source (e.g. Salary)"
            : "Select expense category (e.g. Food, Rent)"}
        </option>

        {(form.type === "income" ? incomeCategories : expenseCategories).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="note"
        placeholder={
          form.type === "income"
            ? "Add note (e.g. Freelance project)"
            : "Add note (e.g. Dinner with friends)"
        }
        value={form.note}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        style={styles.input}
      />

      <button
        type="submit"
        style={styles.button}
        onMouseOver={(e) => (e.target.style.background = "#45a049")}
        onMouseOut={(e) => (e.target.style.background = "#4CAF50")}
      >
        ➕ Add Transaction
      </button>

    </form>
  );
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  button: {
    marginTop: "5px",
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    background: "#4CAF50",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
};
export default TransactionForm;