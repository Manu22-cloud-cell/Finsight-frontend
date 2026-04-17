import { useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import API from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Fetch user profile
  const fetchUser = async () => {
    try {
      const res = await API.get("/user/profile");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

        <NavLink to="/reports" style={navLinkStyle} >
          Reports
        </NavLink>
      </div>

      {/* USER DROPDOWN */}
      <div style={styles.userSection} ref={dropdownRef}>
        <div
          style={styles.userInfo}
          onClick={() => setOpen((prev) => !prev)}
        >
          <img
            src={
              user?.profilePic ||
              "https://ui-avatars.com/api/?name=" + user?.name
            }
            alt="avatar"
            style={styles.avatar}
          />
          <span>{user?.name || "User"}</span>
        </div>

        {open && (
          <div style={styles.dropdown}>
            <div
              style={styles.dropdownItem}
              onClick={() => navigate("/profile")}
            >
              Profile
            </div>

            <div
              style={{ ...styles.dropdownItem, color: "red" }}
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Active link styling
const navLinkStyle = ({ isActive }) => ({
  color: isActive ? "#4CAF50" : "#ffffff",
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
    background: "#1f2937",
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

  userSection: {
    position: "relative",
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },

  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  dropdown: {
    position: "absolute",
    top: "40px",
    right: 0,
    background: "#fff",
    color: "#000",
    borderRadius: "8px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    overflow: "hidden",
    minWidth: "150px",
  },

  dropdownItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },
};

export default Navbar;