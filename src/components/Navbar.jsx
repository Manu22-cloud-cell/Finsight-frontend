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

  // Close dropdown
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
      {/* LOGO */}
      <h2 style={styles.logo} onClick={() => navigate("/dashboard")}>
        FinSight
      </h2>

      {/* NAV LINKS */}
      <div style={styles.links}>
        <NavLink to="/transactions" style={navLinkStyle}>
          Transactions
        </NavLink>

        <NavLink to="/dashboard" style={navLinkStyle}>
          Dashboard
        </NavLink>

        <NavLink to="/reports" style={navLinkStyle}>
          Reports
        </NavLink>
      </div>

      {/* USER */}
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
          <span style={styles.userName}>
            {user?.name || "User"}
          </span>
        </div>

        {open && (
          <div style={styles.dropdown}>
            {/* HEADER */}
            <div style={styles.dropdownHeader}>
              <p style={styles.dropdownName}>{user?.name}</p>
              <p style={styles.dropdownEmail}>{user?.email}</p>
            </div>

            {/* ITEMS */}
            <div
              style={styles.dropdownItem}
              onClick={() => navigate("/profile")}
              onMouseEnter={(e) => (e.target.style.background = "#f3f4f6")}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              👤 Profile
            </div>

            <div
              style={{ ...styles.dropdownItem, color: "#dc2626" }}
              onClick={handleLogout}
              onMouseEnter={(e) => (e.target.style.background = "#f3f4f6")}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              🚪 Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// NavLink styling
const navLinkStyle = ({ isActive }) => ({
  color: isActive ? "#4ade80" : "#e5e7eb",
  textDecoration: "none",
  fontWeight: 500,
  position: "relative",
  paddingBottom: "4px",
  borderBottom: isActive ? "2px solid #4ade80" : "2px solid transparent",
  transition: "all 0.2s ease",
});

// Styles
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
    cursor: "pointer",
    fontWeight: "bold",
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
    padding: "6px 10px",
    borderRadius: "6px",
    transition: "background 0.2s",
  },

  userName: {
    fontSize: "14px",
    fontWeight: 500,
  },

  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  dropdown: {
    position: "absolute",
    top: "45px",
    right: 0,
    background: "#fff",
    color: "#000",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    minWidth: "180px",
    overflow: "hidden",
  },

  dropdownHeader: {
    padding: "12px",
    borderBottom: "1px solid #eee",
  },

  dropdownName: {
    margin: 0,
    fontWeight: "600",
  },

  dropdownEmail: {
    margin: 0,
    fontSize: "12px",
    color: "#777",
  },

  dropdownItem: {
    padding: "10px 12px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background 0.2s",
  },
};

export default Navbar;