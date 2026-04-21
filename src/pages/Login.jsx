import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hover, setHover] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) navigate("/transactions");
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            return setError("Please fill all fields");
        }

        try {
            setLoading(true);

            const res = await API.post("/auth/login", { email, password });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            window.location.href = "/transactions";
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <h2 style={styles.title}>Welcome Back 👋</h2>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleLogin} style={styles.form}>

                    <div style={styles.field}>
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.field}>
                        <label>Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                    <p style={styles.forgotWrapper}>
                        <Link
                            to="/forgot-password"
                            style={styles.forgotLink}
                            onMouseEnter={(e) => (e.target.style.color = "#2563eb")}
                            onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
                        >
                            Forgot Password?
                        </Link>
                    </p>

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
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>

                <p style={styles.footer}>
                    Don't have an account? <Link to="/register">Register</Link>
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
    checkboxRow: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "13px",
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
    forgotWrapper: {
        textAlign: "right",
        marginTop: "-5px",
    },

    forgotLink: {
        fontSize: "13px",
        color: "#6b7280", // subtle gray
        textDecoration: "none",
        transition: "color 0.2s ease",
        cursor: "pointer",
    },
};

export default Login;