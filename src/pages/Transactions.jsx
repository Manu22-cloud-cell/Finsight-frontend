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
    <div>
      <h2>Transactions</h2>

      <TransactionForm onSuccess={fetchTransactions} />

      <TransactionFilters setFilters={setFilters} />

      <TransactionList
        transactions={transactions}
        onRefresh={fetchTransactions}
      />
    </div>
  );
};

export default Transactions;