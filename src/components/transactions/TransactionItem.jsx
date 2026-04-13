import { useState } from "react";
import API from "../../services/api";
import EditTransactionModal from "./EditTransactionModal";

const TransactionItem = ({ txn, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    try {
      await API.delete(`/transactions/${txn._id}`);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
      <p><b>{txn.type.toUpperCase()}</b></p>
      <p>₹ {txn.amount}</p>
      <p>{txn.category}</p>
      <p>{txn.note}</p>
      <p>{new Date(txn.date).toLocaleDateString()}</p>

      <button onClick={() => setShowModal(true)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>

      {showModal && (
        <EditTransactionModal
          txn={txn}
          onClose={() => setShowModal(false)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
};

export default TransactionItem;