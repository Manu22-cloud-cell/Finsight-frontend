import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Landing = () => {
    const navigate = useNavigate();
    const [hoverBtn, setHoverBtn] = useState(false);
    const [hoverLogin, setHoverLogin] = useState(false);

    return (
        <div style={styles.wrapper}>

            {/* NAVBAR */}
            <div style={styles.nav}>
                <h2 style={styles.logo}>FinSight</h2>

                <div style={styles.navActions}>
                    <button style={styles.linkBtn} onClick={() => navigate("/login")}>
                        Login
                    </button>

                    <button
                        style={styles.primaryBtn}
                        onClick={() => navigate("/register")}
                    >
                        Get Started
                    </button>
                </div>
            </div>

            {/* HERO */}
            <div style={styles.hero}>
                <h1 style={styles.heading}>
                    Take Control of Your Money <br />
                    <span style={styles.gradientText}>Before It Controls You</span>
                </h1>

                <p style={styles.subtext}>
                    FinSight helps you track expenses, predict spending, and stay ahead of
                    your financial future with smart insights.
                </p>

                <div style={styles.cta}>
                    <button
                        style={{
                            ...styles.primaryBtn,
                            transform: hoverBtn ? "translateY(-2px)" : "translateY(0)",
                            boxShadow: hoverBtn
                                ? "0 10px 20px rgba(37,99,235,0.3)"
                                : "0 4px 10px rgba(0,0,0,0.1)",
                        }}
                        onMouseEnter={() => setHoverBtn(true)}
                        onMouseLeave={() => setHoverBtn(false)}
                        onClick={() => navigate("/register")}
                    >
                        🚀 Start Free
                    </button>

                    <button
                        style={{
                            ...styles.secondaryBtn,
                            background: hoverLogin ? "#eef2ff" : "rgba(255,255,255,0.9)",
                            borderColor: hoverLogin ? "#6366f1" : "#cbd5f5",
                        }}
                        onMouseEnter={() => setHoverLogin(true)}
                        onMouseLeave={() => setHoverLogin(false)}
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </div>
            </div>

            {/* SOCIAL PROOF */}
            <div style={styles.stats}>
                <div>💰 Track Expenses</div>
                <div>📊 Visual Analytics</div>
                <div>🔮 Smart Predictions</div>
                <div>🚨 Budget Alerts</div>
            </div>

            {/* FEATURES */}
            <div style={styles.features}>
                {features.map((f, i) => (
                    <div key={i} style={styles.card}>
                        <h3>{f.icon} {f.title}</h3>
                        <p>{f.desc}</p>
                    </div>
                ))}
            </div>

            {/* FOOTER */}
            <div style={styles.footer}>
                <p>© 2026 FinSight • Built for smarter finance</p>
            </div>
        </div>
    );
};

const features = [
    {
        icon: "📊",
        title: "Powerful Analytics",
        desc: "Understand your money with interactive charts and trends.",
    },
    {
        icon: "🔮",
        title: "Predictive Insights",
        desc: "Know future expenses before they happen.",
    },
    {
        icon: "🚨",
        title: "Smart Alerts",
        desc: "Stay within budget with intelligent notifications.",
    },
    {
        icon: "📁",
        title: "Detailed Reports",
        desc: "Export and analyze your financial history anytime.",
    },
];

const styles = {
    wrapper: {
        minHeight: "100vh",
        background: "#f9fafb",
        fontFamily: "system-ui",
    },

    nav: {
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 40px",
        alignItems: "center",
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
    },

    logo: {
        margin: 0,
        fontWeight: "bold",
    },

    navActions: {
        display: "flex",
        gap: "10px",
    },

    hero: {
        textAlign: "center",
        padding: "100px 20px",
        background:
            "linear-gradient(135deg, #e0e7ff 0%, #f0f9ff 100%)",
    },

    heading: {
        fontSize: "40px",
        fontWeight: "700",
        lineHeight: "1.2",
    },

    gradientText: {
        background: "linear-gradient(90deg, #2563eb, #9333ea)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },

    subtext: {
        marginTop: "15px",
        color: "#555",
        maxWidth: "600px",
        marginInline: "auto",
    },

    cta: {
        marginTop: "30px",
        display: "flex",
        justifyContent: "center",
        gap: "12px",
    },

    stats: {
        display: "flex",
        justifyContent: "center",
        gap: "40px",
        padding: "20px",
        fontSize: "14px",
        color: "#444",
    },

    features: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        padding: "40px",
    },

    card: {
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
        transition: "transform 0.2s",
    },

    footer: {
        textAlign: "center",
        padding: "25px",
        color: "#777",
    },

    primaryBtn: {
        padding: "10px 18px",
        border: "none",
        borderRadius: "8px",
        background: "#2563eb",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "500",
        transition: "all 0.2s ease",
    },

    secondaryBtn: {
        padding: "10px 18px",
        borderRadius: "8px",
        border: "1px solid #cbd5f5",
        background: "rgba(255,255,255,0.9)",
        color: "#1f2937",
        cursor: "pointer",
        fontWeight: "500",
        transition: "all 0.2s ease",
    },

    linkBtn: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontWeight: "500",
    },
};

export default Landing;