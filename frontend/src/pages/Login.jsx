import { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.email);

      navigate("/");
    } catch {
      alert("Credenziali non valide");
    }
  };

  return (
    <div className="login-container">

      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="login-brand">
          <div className="brand-icon">✓</div>
          <h1>Task Manager</h1>
          <p>Organizza. Monitora. Completa.</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-form">

          <h2>Bentornato!</h2>
          <p className="login-sub">Accedi al tuo account</p>

          <label>Email</label>
          <input
            type="email"
            placeholder="esempio@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Accedi</button>

          <p className="login-switch">
            Non hai un account?
            <Link to="/register">Registrati</Link>
          </p>

        </div>
      </div>

    </div>
  );
}
