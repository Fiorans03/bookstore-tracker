import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";
import LogoutModal from "../components/ModalLogout";

export default function Profile() {
  const navigate = useNavigate();

  const [logoutOpen, setLogoutOpen] = useState(false);

  const email = localStorage.getItem("email");
  const username = email ? email.split("@")[0] : "Utente";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-layout">

      <div className="sidebar">

        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">✓</div>
          <div className="sidebar-logo-title">Task Manager</div>
        </div>

        <div className="sidebar-menu">
          <div className="sidebar-item" onClick={() => navigate("/")}>
            Dashboard
          </div>

          <div className="sidebar-item" onClick={() => navigate("/tasks")}>
            I miei task
          </div>

          <div className="sidebar-item" onClick={() => navigate("/calendar")}>
            Calendario
          </div>

          <div className="sidebar-item active">
            Profilo
          </div>

          <div
            className="sidebar-item"
            onClick={() => setLogoutOpen(true)}
          >
            Esci
          </div>
        </div>

      </div>

      <div className="content">

        <h2 className="page-title">Profilo</h2>

        <div className="profile-card">

          <div className="avatar">
            <span>{username.charAt(0).toUpperCase()}</span>
          </div>

          <h3 className="profile-name">{username}</h3>
          <p className="profile-email">{email}</p>

        </div>

        <div className="settings-section">

          <div className="settings-title">Account</div>

          <div className="settings-item">
            <span>Modifica profilo</span>
            <span className="arrow">›</span>
          </div>

          <div className="settings-item">
            <span>Cambia password</span>
            <span className="arrow">›</span>
          </div>

        </div>

        <div className="settings-section">

          <div className="settings-title">App</div>

          <div className="settings-item">
            <span>Notifiche</span>
            <span className="arrow">›</span>
          </div>

          <div className="settings-item">
            <span>Tema</span>
            <span className="arrow">›</span>
          </div>

          <div className="settings-item">
            <span>Info</span>
            <span className="arrow">›</span>
          </div>

        </div>

      </div>

      <LogoutModal
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={logout}
      />

    </div>
  );
}