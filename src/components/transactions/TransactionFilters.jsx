import { useState } from "react";
import { expenseCategories, incomeCategories } from "../../constants/categories";

const TransactionFilters = ({ setFilters }) => {
  const [localFilters, setLocalFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setLocalFilters({
      ...localFilters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = () => {
    setFilters(localFilters);
  };

  const clearFilters = () => {
    const empty = {
      type: "",
      category: "",
      startDate: "",
      endDate: "",
    };
    setLocalFilters(empty);
    setFilters(empty);
  };

  const categories =
    localFilters.type === "income"
      ? incomeCategories
      : expenseCategories;

  return (
    <div style={styles.container}>
      {/* Type */}
      <select
        name="type"
        value={localFilters.type}
        onChange={handleChange}
        style={styles.input}
      >
        <option value="">All Types</option>
        <option value="expense">💸 Expense</option>
        <option value="income">💰 Income</option>
      </select>

      {/* Category */}
      <select
        name="category"
        value={localFilters.category}
        onChange={handleChange}
        style={styles.input}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Dates */}
      <div style={styles.dateRow}>
        <input
          type="date"
          name="startDate"
          value={localFilters.startDate}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="date"
          name="endDate"
          value={localFilters.endDate}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button
          style={styles.applyBtn}
          onMouseOver={(e) => (e.target.style.background = "#45a049")}
          onMouseOut={(e) => (e.target.style.background = "#4CAF50")}
          onClick={applyFilters}
        >
          Apply
        </button>

        <button
          style={styles.clearBtn}
          onMouseOver={(e) => (e.target.style.background = "#fecaca")}
          onMouseOut={(e) => (e.target.style.background = "#fee2e2")}
          onClick={clearFilters}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  dateRow: {
    display: "flex",
    gap: "10px",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  applyBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#4CAF50",
    color: "#fff",
    cursor: "pointer",
  },
  clearBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ef4444",
    background: "#fee2e2",   // light red background
    color: "#b91c1c",        // dark red text
    cursor: "pointer",
    fontWeight: "500",
  },
};

export default TransactionFilters;