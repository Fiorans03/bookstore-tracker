import "../styles/modal.css";

export default function LogoutModal({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <h2 className="modal-title">Conferma logout</h2>

        <p className="modal-text">
          Sei sicuro di voler uscire?
        </p>

        <div className="modal-actions">

          <button className="btn-cancel" onClick={onCancel}>
            Annulla
          </button>

          <button className="btn-danger" onClick={onConfirm}>
            Esci
          </button>

        </div>

      </div>
    </div>
  );
}