import { useEffect, useState } from "react";
import API from "../services/api";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";
import TransactionFilters from "../components/transactions/TransactionFilters";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  console.log("Transactions page loaded");

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const res = await API.get("/transactions", {
        params: { ...filters, page, limit: 5 },
      });

      setTransactions(res.data.transactions);
      setPages(res.data.pages);

      // Fix empty page after delete
      if (page > res.data.pages && res.data.pages > 0) {
        setPage(res.data.pages);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters, page]);

  // Reset page when filters change
  const handleSetFilters = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  // Smooth scroll on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

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
          <TransactionFilters setFilters={handleSetFilters} />
        </div>
      </div>

      <div style={styles.listCard}>
        {loading ? (
          <p>Loading transactions...</p>
        ) : (
          <TransactionList
            transactions={transactions}
            onRefresh={fetchTransactions}
          />
        )}
      </div>

      <div style={styles.pagination}>
        <button
          style={{
            ...styles.pageBtn,
            opacity: page === 1 || loading ? 0.5 : 1,
            cursor: page === 1 || loading ? "not-allowed" : "pointer",
          }}
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1 || loading}
        >
          ← Prev
        </button>

        <span style={styles.pageInfo}>
          Page {page} of {pages}
        </span>

        <button
          style={{
            ...styles.pageBtn,
            opacity: page === pages || loading ? 0.5 : 1,
            cursor: page === pages || loading ? "not-allowed" : "pointer",
          }}
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === pages || loading}
        >
          Next →
        </button>
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
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    marginTop: "20px",
  },
  pageBtn: {
    width: "auto",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    background: "#4CAF50",
    color: "#fff",
    cursor: "pointer",
  },
  pageInfo: {
    fontWeight: "bold",
  },
};

export default Transactions;