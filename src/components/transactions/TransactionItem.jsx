import { useState } from "react";
import API from "../../services/api";
import EditTransactionModal from "./EditTransactionModal";
import DeleteConfirmModal from "../common/DeleteConfirmModal";
import {
  toastSuccess,
  toastApiError,
  toastWarning,
} from "../../utils/toast";

const TransactionItem = ({ txn, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [hover, setHover] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;

    try {
      setDeleting(true);

      await API.delete(`/transactions/${txn._id}`);

      toastSuccess("Transaction deleted 🗑️");

      setShowDeleteModal(false);
      onRefresh();

    } catch (err) {
      toastApiError(err);
    } finally {
      setDeleting(false);
    }
  };

  const isIncome = txn.type === "income";

  return (
    <>
      <div
        style={{
          ...styles.card,
          transform: hover ? "scale(1.01)" : "scale(1)",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* LEFT */}
        <div style={styles.left}>
          <p style={styles.category}>{txn.category}</p>

          {txn.note && (
            <p style={styles.note}>{txn.note}</p>
          )}

          <small style={styles.date}>
            {new Date(txn.date).toLocaleDateString()}
          </small>
        </div>

        {/* MIDDLE (AMOUNT) */}
        <div style={styles.middle}>
          <span
            style={{
              ...styles.amount,
              background: isIncome ? "#dcfce7" : "#fee2e2",
              color: isIncome ? "#166534" : "#991b1b",
            }}
          >
            {isIncome ? "+ ₹" : "- ₹"} {txn.amount}
          </span>
        </div>

        {/* RIGHT (ACTIONS) */}
        <div style={styles.actions}>
          <button
            style={styles.editBtn}
            onClick={() => setShowModal(true)}
          >
            ✏️
          </button>

          <button
            style={styles.deleteBtn}
            onClick={() => setShowDeleteModal(true)}
          >
            🗑️
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
      {showDeleteModal && (
        <DeleteConfirmModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}
    </>
  );
};

const styles = {
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    marginBottom: "12px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    transition: "all 0.2s ease",
    position: "relative",
    zIndex: 1,
  },

  left: {
    flex: 2,
  },

  category: {
    margin: 0,
    fontWeight: "bold",
    fontSize: "15px",
  },

  note: {
    margin: "4px 0",
    fontSize: "13px",
    color: "#6b7280",
  },

  date: {
    fontSize: "12px",
    color: "#9ca3af",
  },

  middle: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },

  amount: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontWeight: "bold",
    fontSize: "14px",
  },

  actions: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
  },

  editBtn: {
    border: "none",
    background: "#e0f2fe",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  deleteBtn: {
    border: "none",
    background: "#fee2e2",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default TransactionItem;