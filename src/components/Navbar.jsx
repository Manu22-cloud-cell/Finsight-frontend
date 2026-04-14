import { useNavigate, NavLink } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div style={styles.nav}>
            <h2 style={styles.logo}>FinSight</h2>

            <div style={styles.links}>
                <NavLink to="/transactions" style={navLinkStyle}>
                    Transactions
                </NavLink>

                <NavLink to="/dashboard" style={navLinkStyle}>
                    Dashboard
                </NavLink>
            </div>

            <button style={styles.logoutBtn} onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};


// Dynamic NavLink Style
const navLinkStyle = ({ isActive }) => ({
    color: isActive ? "#4CAF50" : "#ffffff", // green highlight
    textDecoration: "none",
    fontWeight: isActive ? "bold" : "normal",
    borderBottom: isActive ? "2px solid #4CAF50" : "none",
    paddingBottom: "2px",
});

const styles = {
    nav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        background: "#1f2937", // nicer dark (Tailwind gray-800)
        color: "#fff",
    },
    logo: {
        margin: 0,
    },
    links: {
        display: "flex",
        gap: "25px",
        alignItems: "center",
    },
    logoutBtn: {
        background: "#ef4444",
        color: "#fff",
        border: "none",
        padding: "6px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        width: "auto",
        marginTop: "0",
    },
};

export default Navbar;