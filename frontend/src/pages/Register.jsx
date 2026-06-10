import { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();

  const handleRegister = async () => {
    if (!email || !password || !confirm) {
      alert("Compila tutti i campi");
      return;
    }

    if (password !== confirm) {
      alert("Le password non coincidono");
      return;
    }

    try {
      await api.post("/auth/register", { email, password });
      alert("Registrazione completata!");
      navigate("/login");
    } catch {
      alert("Errore durante la registrazione");
    }
  };

  return (
    <div className="register-container">

      {/* LEFT SIDE */}
      <div className="register-left">
        <div className="register-brand">
          <div className="brand-icon">✓</div>
          <h1>Task Manager</h1>
          <p>Organizza. Monitora. Completa.</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="register-right">
        <div className="register-form">

          <h2>Crea un account</h2>
          <p className="register-sub">Registrati per iniziare</p>

          {/* EMAIL */}
          <label>Email</label>
          <input
            type="email"
            placeholder="esempio@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#555" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z"/>
                  <line x1="4" y1="4" x2="20" y2="20" stroke="#555" strokeWidth="2" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#555" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z"/>
                </svg>
              )}
            </span>
          </div>

          {/* STRENGTH BAR */}
          <div className="strength-bar">
            <div className={`bar ${strength >= 1 ? "active" : ""}`}></div>
            <div className={`bar ${strength >= 2 ? "active" : ""}`}></div>
            <div className={`bar ${strength >= 3 ? "active" : ""}`}></div>
            <div className={`bar ${strength >= 4 ? "active" : ""}`}></div>
          </div>

          {/* REQUIREMENTS */}
          <ul className="requirements">
            <li className={password.length >= 8 ? "ok" : ""}>Minimo 8 caratteri</li>
            <li className={/[A-Z]/.test(password) ? "ok" : ""}>Una lettera maiuscola</li>
            <li className={/[0-9]/.test(password) ? "ok" : ""}>Un numero</li>
            <li className={/[^A-Za-z0-9]/.test(password) ? "ok" : ""}>Un simbolo</li>
          </ul>

          {/* CONFIRM PASSWORD */}
          <label>Conferma password</label>
          <div className="password-wrapper">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Conferma password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <span
              className="eye-icon"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#555" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z"/>
                  <line x1="4" y1="4" x2="20" y2="20" stroke="#555" strokeWidth="2" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#555" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z"/>
                </svg>
              )}
            </span>
          </div>

          {confirm.length > 0 && (
            <p className={`match ${password === confirm ? "ok" : "no"}`}>
              {password === confirm
                ? "✔ Le password coincidono"
                : "✖ Le password non coincidono"}
            </p>
          )}

          <button onClick={handleRegister}>Registrati</button>

          <p className="register-switch">
            Hai già un account?
            <Link to="/login">Accedi</Link>
          </p>

        </div>
      </div>

    </div>
  );
}
