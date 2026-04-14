import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        monthlyBudget: "",
    });

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await API.post("/auth/register", {
                ...form,
                monthlyBudget: Number(form.monthlyBudget)
            });

            alert("Registration successful");
            navigate("/");
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("Registration failed");
        }
    };

    return (
        <div className="container">
            <h2>Create Account 🚀</h2>

            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        placeholder="Your name"
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Your email"
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Monthly Budget</label>
                    <input
                        type="number"
                        placeholder="e.g. 50000"
                        onChange={(e) =>
                            setForm({ ...form, monthlyBudget: e.target.value })
                        }
                    />
                </div>

                <button type="submit">Register</button>
            </form>

            <p style={{ textAlign: "center", marginTop: "15px" }}>
                Already have an account? <Link to="/">Login</Link>
            </p>
        </div>
    );
};

export default Register;