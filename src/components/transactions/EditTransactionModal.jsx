import { useState, useEffect } from "react";
import API from "../../services/api";

const EditTransactionModal = ({ txn, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    note: "",
    date: "",
  });

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
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Edit Transaction</h3>

        <form onSubmit={handleSubmit}>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          <div style={styles.actions}>
            <button type="submit">Update</button>
            <button type="button" onClick={onClose}>Cancel</button>
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
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
  },
  actions: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between",
  },
};

export default EditTransactionModal;