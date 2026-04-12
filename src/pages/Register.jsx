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
            <h2>Register</h2>

            <form onSubmit={handleRegister}>

                <input
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <br /><br />

                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <br /><br />

                <input
                    type="number"
                    placeholder="Monthly Budget"
                    onChange={(e) =>
                        setForm({ ...form, monthlyBudget: e.target.value })
                    }
                />

                <br /><br />

                <button type="submit">Register</button>
            </form>

            <p>
                Already have an account? <Link to="/">Login</Link>
            </p>
        </div>
    );
};

export default Register;