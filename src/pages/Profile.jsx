import { useEffect, useState } from "react";
import API from "../services/api";
import {
  toastSuccess,
  toastWarning,
  toastApiError,
} from "../utils/toast";

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    monthlyBudget: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  const fetchUser = async () => {
    try {
      const res = await API.get("/user/profile");

      setForm({
        name: res.data.name,
        monthlyBudget: res.data.monthlyBudget,
        email: res.data.email,
      });

      setPreview(
        res.data.profilePic ||
          `https://ui-avatars.com/api/?name=${res.data.name}`
      );
    } catch (err) {
      toastApiError(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  // UPDATE PROFILE
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!form.name || !form.monthlyBudget) {
      return toastWarning("Please fill all required fields");
    }

    if (Number(form.monthlyBudget) <= 0) {
      return toastWarning("Enter a valid budget");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("monthlyBudget", form.monthlyBudget);

      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      await API.put("/user/profile", formData);

      toastSuccess("Profile updated successfully");

      fetchUser();
    } catch (err) {
      toastApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // CHANGE PASSWORD
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwords.oldPassword || !passwords.newPassword) {
      return toastWarning("Please fill all password fields");
    }

    if (passwords.newPassword.length < 6) {
      return toastWarning("New password must be at least 6 characters");
    }

    try {
      setLoading(true);

      await API.put("/user/password", passwords);

      toastSuccess("Password updated successfully");

      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      toastApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h2>👤 Profile Settings</h2>

      <div className="grid grid-2" style={{ marginTop: "20px" }}>
        {/* PROFILE CARD */}
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <img src={preview} alt="profile" style={styles.avatar} />

            <label style={styles.uploadBtn}>
              📷
              <input
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <form onSubmit={handleUpdateProfile} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input value={form.email} disabled style={styles.input} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Monthly Budget</label>
              <input
                type="number"
                name="monthlyBudget"
                value={form.monthlyBudget}
                onChange={handleChange}
                style={styles.input}
              />
              <p style={styles.helper}>
                Current: {formatCurrency(form.monthlyBudget)}
              </p>
            </div>

            <button style={styles.button} disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>

        {/* PASSWORD CARD */}
        <div className="card">
          <h3>🔐 Change Password</h3>

          <form onSubmit={handleChangePasswordSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Old Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="oldPassword"
                value={passwords.oldPassword}
                onChange={handlePasswordChange}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
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

            <button style={styles.button} disabled={loading}>
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  avatar: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  uploadBtn: {
    position: "absolute",
    bottom: "0",
    right: "0",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "50%",
    padding: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },
  form: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    textAlign: "left",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    paddingRight: "4px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
  },
  helper: {
    fontSize: "12px",
    color: "#777",
  },
  checkboxWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "4px",
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
  button: {
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    marginTop: "6px",
  },
};

export default Profile;