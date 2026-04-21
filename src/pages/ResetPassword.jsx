import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../services/api";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [hover, setHover] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");

        if (!password || !confirmPassword) {
            return setError("Please fill all fields");
        }

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        if (password.length < 6) {
            return setError("Password must be at least 6 characters");
        }

        try {
            setLoading(true);

            await API.post("/auth/reset-password", {
                token,
                newPassword: password,
            });

            setSuccess(true);

            // redirect after 2 sec
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.error || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>

                <h2 style={styles.title}>Reset Password 🔐</h2>

                {error && <p style={styles.error}>{error}</p>}

                {success ? (
                    <div style={{ textAlign: "center" }}>
                        <p style={{ color: "#16a34a", fontWeight: "500" }}>
                            ✅ Password reset successful!
                        </p>
                        <p style={{ fontSize: "14px", marginTop: "8px" }}>
                            Redirecting to login...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleReset} style={styles.form}>

                        <div style={styles.field}>
                            <label>New Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.field}>
                            <label>Confirm Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.checkboxWrapper}>
                            <input
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                                style={styles.checkbox}
                            />
                            <label htmlFor="showPassword" style={styles.checkboxLabel}>
                                Show Password
                            </label>
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
                            {loading ? "Resetting..." : "Reset Password"}
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
    checkboxWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        marginTop: "2px",
    },
    checkbox: {
        margin: 0,
        width: "14px",
        height: "14px",
        cursor: "pointer",
    },
    checkboxLabel: {
        fontSize: "13px",
        color: "#555",
        cursor: "pointer",
        lineHeight: "1",
    },
};

export default ResetPassword;