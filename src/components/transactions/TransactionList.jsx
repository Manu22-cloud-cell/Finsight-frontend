import TransactionItem from "./TransactionItem";

const TransactionList = ({ transactions, onRefresh }) => {
  return (
    <div style={styles.container}>
      {transactions.length === 0 ? (
        <div style={styles.empty}>
          <p>No transactions found 📭</p>
        </div>
      ) : (
        transactions.map((txn) => (
          <TransactionItem
            key={txn._id}
            txn={txn}
            onRefresh={onRefresh}
          />
        ))
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#6b7280",
  },
};

export default TransactionList;