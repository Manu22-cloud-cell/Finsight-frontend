import { useState, useEffect } from "react";
import API from "../../services/api";
import { expenseCategories, incomeCategories } from "../../constants/categories";

const EditTransactionModal = ({ txn, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    note: "",
    date: "",
  });

  const [cancelHover, setCancelHover] = useState(false);

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/transactions/${txn._id}`, form);
      onSuccess();   // refresh list
      onClose();     // close modal
    } catch (err) {
      console.error(err);
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
              style={styles.updateBtn}
              onMouseOver={(e) => (e.target.style.background = "#45a049")}
              onMouseOut={(e) => (e.target.style.background = "#4CAF50")}
            >
              ✅ Update
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
},

  modal: {
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