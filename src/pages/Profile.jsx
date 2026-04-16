import { useEffect, useState } from "react";
import API from "../services/api";

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    monthlyBudget: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");

  // Fetch user
  const fetchUser = async () => {
    try {
      const res = await API.get("/user/profile");

      setForm({
        name: res.data.name,
        monthlyBudget: res.data.monthlyBudget,
      });

      setPreview(
        res.data.profilePic ||
          `https://ui-avatars.com/api/?name=${res.data.name}`
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Handle image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("monthlyBudget", form.monthlyBudget);

      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      await API.put("/user/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated!");
      fetchUser();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      await API.put("/user/password", passwords);
      alert("Password updated!");

      setPasswords({
        oldPassword: "",
        newPassword: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Password update failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>👤 Profile</h2>

      {/* PROFILE CARD */}
      <div style={styles.card}>
        <img src={preview} alt="profile" style={styles.avatarLarge} />

        <input type="file" onChange={handleImageChange} />

        <form onSubmit={handleUpdateProfile}>
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <label>Monthly Budget</label>
          <input
            type="number"
            name="monthlyBudget"
            value={form.monthlyBudget}
            onChange={handleChange}
          />

          <button type="submit">Update Profile</button>
        </form>
      </div>

      {/* PASSWORD CARD */}
      <div style={styles.card}>
        <h3>🔐 Change Password</h3>

        <form onSubmit={handleChangePassword}>
          <label>Old Password</label>
          <input
            type="password"
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={handlePasswordChange}
          />

          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
          />

          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "20px auto",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },

  avatarLarge: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px",
  },
};

export default Profile;