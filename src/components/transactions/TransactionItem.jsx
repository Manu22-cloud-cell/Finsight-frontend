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
    <>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px",
        borderBottom: "1px solid #eee"
      }}>
        <div>
          <p style={{ margin: 0, fontWeight: "bold" }}>{txn.category}</p>
          <small>{new Date(txn.date).toLocaleDateString()}</small>
        </div>

        <div>
          <p style={{
            color: txn.type === "income" ? "green" : "red",
            margin: 0,
            fontWeight: "bold"
          }}>
            ₹ {txn.amount}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{ width: "auto" }} onClick={() => setShowModal(true)}>
            Edit
          </button>

          <button style={{ width: "auto" }} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      {showModal && (
        <EditTransactionModal
          txn={txn}
          onClose={() => setShowModal(false)}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
};

export default TransactionItem;