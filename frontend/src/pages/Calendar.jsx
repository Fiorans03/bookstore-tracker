import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/calendar.css";
import { useNavigate } from "react-router-dom";
import LogoutModal from "../components/ModalLogout";

export default function Calendar() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  // LOGOUT MODAL STATE
  const [logoutOpen, setLogoutOpen] = useState(false);

  const today = new Date();

  const [selectedDay, setSelectedDay] = useState(formatDate(today));
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  function formatDate(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  }

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await api.get("/tasks");
      setTasks(res.data || []);
    };
    fetchTasks();
  }, []);

  const normalizeDate = (date) =>
    typeof date === "string" ? date.split("T")[0] : "";

  const filteredTasks = tasks.filter(
    (t) => normalizeDate(t.date) === selectedDay
  );

  const getMonthDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const days = [];
    let start = firstDay.getDay();
    if (start === 0) start = 7;

    for (let i = 1; i < start; i++) days.push(null);

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(currentYear, currentMonth, d);
      days.push({
        date: formatDate(date),
        day: d,
      });
    }

    return days;
  };

  const monthDays = getMonthDays();
  const taskMap = new Set(tasks.map((t) => normalizeDate(t.date)));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
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

          <div className="sidebar-item active">
            Calendario
          </div>

          <div className="sidebar-item" onClick={() => navigate("/profile")}>
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

      {/* CONTENT */}
      <div className="content">

        {/* HEADER CALENDAR */}
        <div className="calendar-header">

          <button
            className="month-btn"
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
          >
            ‹
          </button>

          <h2 className="month-title">
            {new Date(currentYear, currentMonth).toLocaleDateString("it-IT", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <button
            className="month-btn"
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
          >
            ›
          </button>
        </div>

        {/* WEEKDAYS */}
        <div className="weekdays">
          <span>L</span><span>M</span><span>M</span><span>G</span><span>V</span><span>S</span><span>D</span>
        </div>

        {/* GRID */}
        <div className="calendar-grid">

          {monthDays.map((d, i) => {
            if (!d) return <div key={i} className="empty" />;

            const hasTask = taskMap.has(d.date);
            const active = selectedDay === d.date;

            return (
              <div
                key={d.date}
                className={`day ${active ? "active" : ""}`}
                onClick={() => setSelectedDay(d.date)}
              >
                {d.day}
                {hasTask && <div className="dot" />}
              </div>
            );
          })}

        </div>

        {/* TASKS */}
        <div className="task-section">

          <h3 className="selected-date">
            {new Date(selectedDay).toLocaleDateString("it-IT", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h3>

          {filteredTasks.length === 0 ? (
            <p className="empty-text">Nessuna task per questo giorno</p>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                className="task-card"
                onClick={() => setSelectedTask(t)}
              >
                {t.title}
              </div>
            ))
          )}
        </div>

        {/* TASK MODAL */}
        {selectedTask && (
          <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
            <div className="task-modal" onClick={(e) => e.stopPropagation()}>

              <button
                className="close-btn"
                onClick={() => setSelectedTask(null)}
              >
                ✕
              </button>

              <h2>{selectedTask.title}</h2>

              <div className="modal-section">
                <p className="label">Descrizione</p>
                <p>{selectedTask.description || "Nessuna descrizione"}</p>
              </div>

              <div className="modal-section">
                <p className="label">Data</p>
                <p>{normalizeDate(selectedTask.date)}</p>
              </div>

              <div className="modal-section">
                <p className="label">Stato</p>
                <p className={selectedTask.completed ? "done" : ""}>
                  {selectedTask.completed ? "Completata" : "Da fare"}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* LOGOUT MODAL */}
        <LogoutModal
          open={logoutOpen}
          onCancel={() => setLogoutOpen(false)}
          onConfirm={logout}
        />

      </div>
    </div>
  );
}