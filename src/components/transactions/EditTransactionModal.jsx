import { useState, useEffect } from "react";
import API from "../../services/api";
import { expenseCategories, incomeCategories } from "../../constants/categories";
import {
  toastSuccess,
  toastApiError,
  toastWarning,
} from "../../utils/toast";

const EditTransactionModal = ({ txn, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    note: "",
    date: "",
  });

  const [cancelHover, setCancelHover] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pre-fill data
  useEffect(() => {
    if (txn) {
      setForm({
        type: txn.type,
        amount: txn.amount,
        category: txn.category,
        note: txn.note || "",
        date: txn.date ? txn.date.split("T")[0] : "",
      });
    }
  }, [txn]);

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

      await API.put(`/transactions/${txn._id}`, form);

      toastSuccess("Transaction updated ✏️");

      onSuccess();   // refresh list
      onClose();     // close modal

    } catch (err) {
      toastApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Edit Transaction</h3>

        <form onSubmit={handleSubmit} style={styles.form}>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            type="number"
            name="amount"
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
            <option value="">Select Category</option>
            {(form.type === "income" ? incomeCategories : expenseCategories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Note"
            style={styles.input}
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            style={styles.input}
          />

          <div style={styles.actions}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.updateBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Updating..." : "✅ Update"}
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                ...styles.cancelBtn,
                background: cancelHover ? "#b91c1c" : "#ef4444",
              }}
              onMouseEnter={() => setCancelHover(true)}
              onMouseLeave={() => setCancelHover(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    backdropFilter: "blur(2px)",
  },
  modal: {
    position: "relative",
    zIndex: 10000,
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    width: "350px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "10px",
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  updateBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#4CAF50",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },

  cancelBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#ef4444",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};

export default EditTransactionModal;