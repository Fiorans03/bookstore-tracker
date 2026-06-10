import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/tasks.css";
import { useNavigate } from "react-router-dom";

export default function Tasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks");
        setTasks(res.data || []);
      } catch (err) {
        console.error("Errore caricamento tasks:", err);
        setTasks([]);
      }
    };

    fetchTasks();
  }, []);

  const refreshTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      await api.put(`/tasks/${id}`, { completed: !completed });
      refreshTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      refreshTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
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

          <div className="sidebar-item active">
            I miei task
          </div>

          <div className="sidebar-item" onClick={() => navigate("/calendar")}>
            Calendario
          </div>

          <div className="sidebar-item" onClick={() => navigate("/profile")}>
            Profilo
          </div>

          <div
            className="sidebar-item"
            onClick={() => setShowLogout(true)}
          >
            Esci
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="content">

        <h2 className="page-title">I miei task</h2>

        <div className="tasks-list">

          {tasks.length === 0 ? (
            <p className="empty">Nessun task presente</p>
          ) : (
            tasks.map((task) => (
              <div className="task-card" key={task.id}>

                <div className="task-left">

                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id, task.completed)}
                  />

                  <div className="task-info">

                    <div className={`task-title ${task.completed ? "done" : ""}`}>
                      {task.title}
                    </div>

                    {task.description && (
                      <div className="task-desc">
                        {task.description}
                      </div>
                    )}

                  </div>

                </div>

                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  ✕
                </button>

              </div>
            ))
          )}

        </div>

      </div>

      {/* MODAL LOGOUT */}
      {showLogout && (
        <div className="modal-overlay" onClick={() => setShowLogout(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>

            <h2>Logout</h2>
            <p>Sei sicuro di voler uscire?</p>

            <div className="modal-actions">

              <button
                className="modal-cancel"
                onClick={() => setShowLogout(false)}
              >
                Annulla
              </button>

              <button
                className="modal-save"
                onClick={handleLogout}
              >
                Esci
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}