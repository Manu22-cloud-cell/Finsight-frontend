import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import {
  toastSuccess,
  toastApiError,
  toastError,
} from "../utils/toast";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const dropdownRef = useRef();

  // Handle resize properly
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
        toastError("Payment service not loaded.");
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

  // Dropdown close
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Alerts polling
  useEffect(() => {
    if (!user?.isPremium) return;

    const fetchAlerts = async () => {
      try {
        const res = await API.get("/alerts");
        setUnreadCount(res.data.filter((a) => !a.isRead).length);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div style={styles.nav}>
      {/* LOGO */}
      <h2 style={styles.logo} onClick={() => navigate("/dashboard")}>
        FinSight
      </h2>

      {/* HAMBURGER */}
      {isMobile && (
        <div style={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
      )}

      {/* NAV LINKS */}
      <div
        style={{
          ...styles.center,
          ...(isMobile && !menuOpen ? { display: "none" } : {}),
          ...(menuOpen ? styles.mobileMenu : {}),
        }}
      >
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

      {/* RIGHT SECTION */}
      <div style={styles.right}>
        <div style={styles.bell} onClick={() => navigate("/alerts")}>
          🔔
          {unreadCount > 0 && (
            <span style={styles.badge}>{unreadCount}</span>
          )}
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
            <span>
              {user?.name}
              {user?.isPremium && (
                <span style={styles.premiumBadge}>PRO</span>
              )}
            </span>
          </div>

          {open && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownItem} onClick={() => navigate("/profile")}>
                👤 Profile
              </div>

              {!user?.isPremium && (
                <button
                  style={styles.premiumBtn}
                  onClick={handleBuyPremium}
                  disabled={loadingPayment}
                >
                  {loadingPayment ? "Processing..." : "Upgrade"}
                </button>
              )}

              <div style={styles.dropdownItem} onClick={handleLogout}>
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
});

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    background: "#1f2937",
    color: "#fff",
    position: "relative",
  },

  logo: { cursor: "pointer" },

  center: {
    display: "flex",
    gap: "20px",
  },

  menuIcon: {
    fontSize: "22px",
    cursor: "pointer",
  },

  mobileMenu: {
    position: "absolute",
    top: "60px",
    left: 0,
    width: "100%",
    background: "#1f2937",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px 0",
    gap: "16px",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  bell: {
    position: "relative",
    cursor: "pointer",
  },

  badge: {
    position: "absolute",
    top: "-6px",
    right: "-8px",
    background: "red",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "10px",
  },

  userSection: { position: "relative" },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },

  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
  },

  dropdown: {
    position: "absolute",
    top: "45px",
    right: 0,
    background: "#fff",
    color: "#000",
    borderRadius: "8px",
    padding: "10px",
  },

  dropdownItem: {
    padding: "8px",
    cursor: "pointer",
  },

  premiumBtn: {
    padding: "6px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    marginTop: "6px",
    cursor: "pointer",
  },

  premiumBadge: {
    marginLeft: "6px",
    fontSize: "10px",
    background: "#facc15",
    padding: "2px 6px",
    borderRadius: "6px",
  },
};

export default Navbar;