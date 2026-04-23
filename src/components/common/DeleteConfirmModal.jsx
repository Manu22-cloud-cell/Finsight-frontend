import React from "react";

const DeleteConfirmModal = ({ onClose, onConfirm, loading }) => {
    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal}>
                <h3 style={styles.title}>Delete Transaction</h3>
                <p style={styles.text}>
                    Are you sure you want to delete this transaction?
                </p>

                <div style={styles.actions}>
                    <button
                        style={styles.cancelBtn}
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        style={{
                            ...styles.deleteBtn,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
        backdropFilter: "blur(2px)",
    },

    modal: {
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        width: "320px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    },

    title: {
        margin: 0,
        marginBottom: "10px",
    },

    text: {
        fontSize: "14px",
        color: "#6b7280",
        marginBottom: "20px",
    },

    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
    },

    cancelBtn: {
        padding: "6px 12px",
        borderRadius: "6px",
        border: "none",
        background: "#4CAF50",
        color: "#fff",
        cursor: "pointer",
        width: "auto",
    },

    deleteBtn: {
        padding: "6px 12px",
        borderRadius: "6px",
        border: "none",
        background: "#ef4444",
        color: "#fff",
        cursor: "pointer",
        width: "auto",
    },
};

export default DeleteConfirmModal;