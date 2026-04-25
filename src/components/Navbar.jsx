import { useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import {
  toastSuccess,
  toastApiError,
  toastError,
} from "../utils/toast";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
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
      setOpen(false);

      if (!window.Razorpay) {
        toastError("Payment service not loaded. Please try again.");
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
          try {
            await API.post("/payments/verify", response);

            toastSuccess("🎉 Premium activated!");

            const updatedUser = await API.get("/user/profile");
            localStorage.setItem("user", JSON.stringify(updatedUser.data));
            setUser(updatedUser.data);

            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 800);
          } catch (err) {
            toastApiError(err);
          }
        },

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        theme: { color: "#2563eb" },
      });

      rzp.open();
    } catch (err) {
      toastApiError(err);
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

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await API.get("/alerts");
        setUnreadCount(
          res.data.filter((a) => !a.isRead).length
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchAlerts();

    // refetch every time page changes
    const interval = setInterval(fetchAlerts, 5000);

    return () => clearInterval(interval);
  }, []);

  return (

    <div style={styles.nav}>
      {/* LEFT: LOGO */}
      <div style={styles.left} >
        <h2 style={styles.logo} onClick={() => navigate("/dashboard")}>
          FinSight
        </h2>
      </div>


      {/* CENTER: NAV LINKS */}
      <div style={styles.center}>
        <NavLink to="/transactions" style={navLinkStyle}>Transactions</NavLink>
        <NavLink to="/dashboard" style={navLinkStyle}>Dashboard</NavLink>
        <NavLink to="/reports" style={navLinkStyle}>Reports</NavLink>
      </div>

      {/* RIGHT: BELL + USER */}
      <div style={styles.right}>
        {/* BELL */}
        <div style={styles.bell} onClick={() => navigate("/alerts")}>
          🔔
          {unreadCount > 0 && (
            <span style={styles.badge}>{unreadCount}</span>
          )}
        </div>

        {/* USER */}
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
              {user?.isPremium && (
                <span style={styles.premiumBadge}>PRO</span>
              )}
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
                  setOpen(false);
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
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
                onMouseEnter={(e) =>
                  (e.target.style.background = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "transparent")
                }
                onClick={handleLogout}
              >
                🚪 Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const navLinkStyle = ({ isActive }) => ({
  color: isActive ? "#4ade80" : "#e5e7eb",
  textDecoration: "none",
  fontWeight: 500,
  paddingBottom: "4px",
  borderBottom: isActive
    ? "2px solid #4ade80"
    : "2px solid transparent",
});

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    background: "#1f2937",
    color: "#fff",
    position: "relative", // important for centering trick
  },


  center: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "24px",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  bell: {
    position: "relative",
    cursor: "pointer",
    fontSize: "20px",
  },

  logo: { cursor: "pointer" },

  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  links: {
    display: "flex",
    gap: "18px",
  },

  badge: {
    position: "absolute",
    top: "-6px",
    right: "-8px",
    background: "red",
    color: "#fff",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "bold",
  },

  userSection: { position: "relative" },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    padding: "6px 10px",
    borderRadius: "6px",
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