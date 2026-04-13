import TransactionItem from "./TransactionItem";

const TransactionList = ({ transactions, onRefresh }) => {
  return (
    <div>
      {transactions.length === 0 ? (
        <p>No transactions found</p>
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

export default TransactionList;