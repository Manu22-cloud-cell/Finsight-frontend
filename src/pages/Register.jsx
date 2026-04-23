import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import {
    toastSuccess,
    toastWarning,
    toastApiError,
} from "../utils/toast";


const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        monthlyBudget: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [hover, setHover] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validation
        if (!form.name || !form.email || !form.password || !form.monthlyBudget) {
            return toastWarning("Please fill all fields");
        }

        if (form.password.length < 6) {
            return toastWarning("Password must be at least 6 characters");
        }

        if (Number(form.monthlyBudget) <= 0) {
            return toastWarning("Enter a valid budget");
        }

        try {
            setLoading(true);

            await API.post("/auth/register", {
                ...form,
                monthlyBudget: Number(form.monthlyBudget),
            });

            toastSuccess("Registration successful 🎉");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (err) {
            toastApiError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create Account 🚀</h2>

                <form onSubmit={handleRegister} style={styles.form}>

                    <div style={styles.field}>
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Your name"
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.field}>
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Your email"
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.field}>
                        <label>Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
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

                    <div style={styles.field}>
                        <label>Monthly Budget</label>
                        <input
                            type="number"
                            placeholder="e.g. 50000"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    monthlyBudget: e.target.value,
                                })
                            }
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
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p style={styles.footer}>
                    Already have an account? <Link to="/login">Login</Link>
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
        transition: "all 0.2s ease",
    },
    error: {
        color: "#dc2626",
        fontSize: "13px",
    },
    footer: {
        textAlign: "center",
        marginTop: "15px",
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

export default Register;