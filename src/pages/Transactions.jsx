import { useEffect, useState } from "react";
import API from "../services/api";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";
import TransactionFilters from "../components/transactions/TransactionFilters";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({});

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions", { params: filters });
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  return (
    <div style={styles.page}>
      <h2>💸 Transactions</h2>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Add Transaction</h3>
          <TransactionForm onSuccess={fetchTransactions} />
        </div>

        <div style={styles.card}>
          <h3>Filters</h3>
          <TransactionFilters setFilters={setFilters} />
        </div>
      </div>

      <div style={styles.listCard}>
        <TransactionList
          transactions={transactions}
          onRefresh={fetchTransactions}
        />
      </div>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: "1000px",
    margin: "20px auto",
  },
  grid: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  card: {
    flex: 1,
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  listCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
};

export default Transactions;