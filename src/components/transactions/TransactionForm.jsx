import { useState } from "react";
import API from "../../services/api";
import {
  toastSuccess,
  toastApiError,
  toastWarning,
} from "../../utils/toast";

import {
  expenseCategories,
  incomeCategories,
} from "../../constants/categories";

const TransactionForm = ({ onSuccess }) => {
  const getToday = () => new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    note: "",
    date: getToday(),
  });

  const [loading, setLoading] = useState(false);

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

    // Prevent multiple clicks
    if (loading) return;

    // Validation
    if (!form.amount || !form.category) {
      return toastWarning("Please fill all required fields");
    }

    if (Number(form.amount) <= 0) {
      return toastWarning("Enter a valid amount");
    }

    try {
      setLoading(true);

      await API.post("/transactions", form);

      toastSuccess("Transaction added 💸", {
        autoClose: 1500,
      });

      // Reset form
      setForm({
        type: "expense",
        amount: "",
        category: "",
        note: "",
        date: getToday(),
      });

      onSuccess(); // refresh list

    } catch (err) {
      toastApiError(err);
    } finally {
      setLoading(false);
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
        style={styles.input}
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        style={styles.input}
      >
        <option value="">
          {form.type === "income"
            ? "Select income source"
            : "Select expense category"}
        </option>

        {(form.type === "income"
          ? incomeCategories
          : expenseCategories
        ).map((cat) => (
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
            ? "Add note (e.g. Freelance)"
            : "Add note (e.g. Dinner)"
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
        disabled={loading}
        onMouseOver={(e) => (e.target.style.background = "#45a049")}
        onMouseOut={(e) => (e.target.style.background = "#4CAF50")}
        style={{
          ...styles.button,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Adding..." : "➕ Add Transaction"}
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