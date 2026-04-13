import { useState } from "react";

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

  return (
    <div>
      <select name="type" onChange={handleChange}>
        <option value="">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input
        type="text"
        name="category"
        placeholder="Category"
        onChange={handleChange}
      />

      <input type="date" name="startDate" onChange={handleChange} />
      <input type="date" name="endDate" onChange={handleChange} />

      <button onClick={applyFilters}>Apply</button>
    </div>
  );
};

export default TransactionFilters;