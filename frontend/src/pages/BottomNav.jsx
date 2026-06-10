import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bottom-nav">

      <div
        className={location.pathname === "/" ? "active" : ""}
        onClick={() => navigate("/")}
      >
        Home
      </div>

      <div
        className={location.pathname === "/calendar" ? "active" : ""}
        onClick={() => navigate("/calendar")}
      >
        Calendario
      </div>

      <div
        className={location.pathname === "/profile" ? "active" : ""}
        onClick={() => navigate("/profile")}
      >
        Profilo
      </div>

    </div>
  );
}