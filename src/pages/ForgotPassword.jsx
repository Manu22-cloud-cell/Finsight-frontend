import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [hover, setHover] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email) {
            return setError("Please enter your email");
        }

        try {
            setLoading(true);

            await API.post("/auth/forgot-password", { email });

            // Always show success (no email enumeration)
            setSuccess(true);

        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>

                <h2 style={styles.title}>Forgot Password 🔑</h2>

                {error && <p style={styles.error}>{error}</p>}

                {success ? (
                    <div style={{ textAlign: "center" }}>
                        <p style={{ color: "#16a34a", fontWeight: "500" }}>
                            📩 If an account exists, a reset link has been sent.
                        </p>
                        <p style={{ fontSize: "13px", marginTop: "8px", color: "#555" }}>
                            Please check your email inbox.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={styles.form}>

                        <div style={styles.field}>
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <button
                            style={{
                                ...styles.button,
                                background: hover ? "#1d4ed8" : "#2563eb",
                                transform: hover ? "translateY(-1px)" : "translateY(0)",
                                boxShadow: hover
                                    ? "0 6px 12px rgba(0,0,0,0.15)"
                                    : "0 2px 6px rgba(0,0,0,0.1)",
                            }}
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                )}

                <p style={styles.footer}>
                    Back to <Link to="/login">Login</Link>
                </p>

            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
    },
    card: {
        width: "350px",
        padding: "25px",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    },
    title: {
        textAlign: "center",
        marginBottom: "15px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "5px",
    },
    input: {
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        boxSizing: "border-box",
    },
    button: {
        padding: "10px",
        border: "none",
        borderRadius: "6px",
        background: "#2563eb",
        color: "#fff",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    error: {
        color: "#dc2626",
        fontSize: "13px",
        marginBottom: "5px",
    },
    footer: {
        textAlign: "center",
        marginTop: "15px",
        fontSize: "14px",
    },
};

export default ForgotPassword;