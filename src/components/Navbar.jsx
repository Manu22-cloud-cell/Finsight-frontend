import { useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import API from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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

  const handleBuyPremium = async () => {
    try {
      setLoadingPayment(true);

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      const { data } = await API.post("/payments/create-order");

      const rzp = new window.Razorpay({
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "FinSight Premium",
        description: "Unlock analytics & reports",
        order_id: data.orderId,

        handler: async (response) => {
          await API.post("/payments/verify", response);
          alert("🎉 Premium activated");

          const updatedUser = await API.get("/user/profile");
          localStorage.setItem("user", JSON.stringify(updatedUser.data));
          setUser(updatedUser.data);
        },

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        theme: { color: "#2563eb" },
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setLoadingPayment(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
      <h2 style={styles.logo} onClick={() => navigate("/dashboard")}>
        FinSight
      </h2>

      <div style={styles.links}>
        <NavLink to="/transactions" style={navLinkStyle}>Transactions</NavLink>
        <NavLink to="/dashboard" style={navLinkStyle}>Dashboard</NavLink>
        <NavLink to="/reports" style={navLinkStyle}>Reports</NavLink>
      </div>

      <div style={styles.userSection} ref={dropdownRef}>
        <div style={styles.userInfo} onClick={() => setOpen(!open)}>
          <img
            src={
              user?.profilePic ||
              `https://ui-avatars.com/api/?name=${user?.name || "User"}`
            }
            alt="avatar"
            style={styles.avatar}
          />
          <span style={styles.userName}>
            {user?.name || "User"}
            {user?.isPremium && <span style={styles.premiumBadge}>PRO</span>}
          </span>
        </div>

        {open && (
          <div style={styles.dropdown}>
            {/* HEADER */}
            <div style={styles.dropdownHeader}>
              <img
                src={
                  user?.profilePic ||
                  `https://ui-avatars.com/api/?name=${user?.name || "User"}`
                }
                alt="avatar"
                style={styles.avatarLarge}
              />
              <div>
                <p style={styles.dropdownName}>{user?.name || "User"}</p>
                <p style={styles.dropdownEmail}>{user?.email}</p>
              </div>
            </div>

            <div style={styles.divider} />

            {/* PROFILE */}
            <div
              style={styles.dropdownItem}
              onClick={() => {
                navigate("/profile");
                setOpen(false); // optional: close dropdown after click
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              👤 Profile
            </div>

            {/* PREMIUM CTA */}
            {!user?.isPremium && (
              <div style={styles.premiumBox}>
                <p style={styles.premiumText}>
                  Unlock insights & reports
                </p>
                <button
                  style={styles.premiumBtn}
                  disabled={loadingPayment}
                  onClick={handleBuyPremium}
                >
                  {loadingPayment ? "Processing..." : "Upgrade"}
                </button>
              </div>
            )}

            <div style={styles.divider} />

            {/* LOGOUT */}
            <div
              style={{ ...styles.dropdownItem, color: "#dc2626" }}
              onMouseEnter={(e) => (e.target.style.background = "#f3f4f6")}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
              onClick={handleLogout}
            >
              🚪 Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const navLinkStyle = ({ isActive }) => ({
  color: isActive ? "#4ade80" : "#e5e7eb",
  textDecoration: "none",
  fontWeight: 500,
  paddingBottom: "4px",
  borderBottom: isActive ? "2px solid #4ade80" : "2px solid transparent",
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

  logo: { cursor: "pointer" },

  links: { display: "flex", gap: "25px" },

  userSection: { position: "relative" },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    padding: "6px 10px",
    borderRadius: "6px",
    transition: "background 0.2s",
  },

  userName: { fontSize: "14px", fontWeight: 500 },

  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
  },

  avatarLarge: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
  },

  dropdown: {
    position: "absolute",
    top: "48px",
    right: 0,
    width: "220px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
    overflow: "hidden",
    color: "#111827",
    border: "1px solid #e5e7eb",
  },

  dropdownHeader: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    padding: "12px",
  },

  dropdownName: {
    margin: 0,
    fontWeight: "600",
    fontSize: "14px",
    color: "#111827",
  },

  dropdownEmail: {
    margin: 0,
    fontSize: "12px",
    color: "#6b7280",
  },

  dropdownItem: {
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#111827",
    transition: "background 0.2s",
  },

  dropdownItemHover: {
    background: "#f3f4f6",
  },

  divider: {
    height: "1px",
    background: "#eee",
    margin: "4px 0",
  },

  premiumBox: {
    padding: "12px",
    background: "#f9fafb",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  premiumText: {
    fontSize: "12px",
    margin: 0,
    color: "#555",
  },

  premiumBtn: {
    padding: "6px",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px",
  },

  premiumBadge: {
    marginLeft: "6px",
    fontSize: "10px",
    background: "#facc15",
    color: "#000",
    padding: "2px 6px",
    borderRadius: "6px",
    fontWeight: "bold",
  },
};

export default Navbar;