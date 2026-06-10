import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', quantity: '', location: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:3000/inventory');
      setItems(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // PUT: Modifica oggetto esistente
        await axios.put(`http://localhost:3000/inventory/${editingId}`, { 
          ...form, quantity: Number(form.quantity) 
        });
        setEditingId(null); // Esci dalla modalità modifica
      } else {
        // POST: Aggiungi nuovo oggetto
        await axios.post('http://localhost:3000/inventory', { 
          ...form, quantity: Number(form.quantity) 
        });
      }
      setForm({ name: '', category: '', quantity: '', location: '' });
      fetchItems();
    } catch (err) {
      console.error("Errore nel salvataggio:", err);
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, category: item.category, quantity: item.quantity, location: item.location });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo oggetto?")) {
      await axios.delete(`http://localhost:3000/inventory/${id}`);
      fetchItems();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: '', category: '', quantity: '', location: '' });
  };

  // Filtra gli oggetti in base alla ricerca (nome o categoria)
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Metriche per la Dashboard
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = items.filter(item => item.quantity <= item.min_threshold).length;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>📦 Inventory Tracker</h1>
      
      {/* 📊 DASHBOARD METRICHE */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
        <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '8px', textAlign: 'center', flex: 1 }}>
          <h3 style={{ margin: 0, color: '#1565c0' }}>Totale Oggetti</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold', color: '#0d47a1' }}>{totalItems}</p>
        </div>
        <div style={{ background: lowStockCount > 0 ? '#ffebee' : '#e8f5e9', padding: '1rem', borderRadius: '8px', textAlign: 'center', flex: 1 }}>
          <h3 style={{ margin: 0, color: lowStockCount > 0 ? '#c62828' : '#2e7d32' }}>Scorte Basse</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold', color: lowStockCount > 0 ? '#c62828' : '#2e7d32' }}>{lowStockCount}</p>
        </div>
      </div>

      {/* 🔍 BARRA DI RICERCA */}
      <input 
        placeholder="🔍 Cerca per nome o categoria..." 
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }}
      />

      {/* 📝 FORM AGGIUNGI / MODIFICA */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
        <input placeholder="Nome" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{ flex: 2, padding: '0.5rem' }} />
        <input placeholder="Categoria" value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ flex: 1, padding: '0.5rem' }} />
        <input type="number" placeholder="Qtà" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required style={{ width: '80px', padding: '0.5rem' }} />
        <input placeholder="Posizione" value={form.location} onChange={e => setForm({...form, location: e.target.value})} style={{ flex: 1, padding: '0.5rem' }} />
        <button type="submit" style={{ padding: '0.5rem 1rem', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {editingId ? '💾 Salva' : '➕ Aggiungi'}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancel} style={{ padding: '0.5rem 1rem', background: '#9e9e9e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Annulla
          </button>
        )}
      </form>

      {/* 📋 LISTA OGGETTI */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredItems.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Nessun oggetto trovato.</p>
        ) : (
          filteredItems.map(item => (
            <li key={item.id} style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '1.1rem' }}>{item.name}</strong> 
                <span style={{ color: '#666', marginLeft: '0.5rem' }}>({item.category})</span>
                <br />
                <span>Qtà: {item.quantity} | 📍 {item.location}</span>
                {item.quantity <= item.min_threshold && <span style={{ color: 'red', marginLeft: '0.5rem', fontWeight: 'bold' }}>⚠️ Scorta bassa!</span>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(item)} style={{ padding: '0.4rem 0.8rem', background: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  ✏️ Modifica
                </button>
                <button onClick={() => handleDelete(item.id)} style={{ padding: '0.4rem 0.8rem', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  🗑️ Elimina
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
export default App;