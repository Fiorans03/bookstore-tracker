import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [view, setView] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });
  
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', quantity: '', location: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false); // NUOVO FILTRO
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchItems();
    }
  }, [token]);

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:3000/inventory');
      setItems(res.data);
    } catch (err) { console.error("Errore fetch:", err); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/login', loginForm);
      const newToken = res.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setView('inventory');
    } catch (err) {
      alert(err.response?.data?.error || "Login fallito: controlla email e password");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/register', registerForm);
      alert("Registrazione avvenuta con successo! Ora effettua il login.");
      setView('login');
      setRegisterForm({ username: '', email: '', password: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registrazione fallita.";
      alert(errorMsg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setView('login');
    setLoginForm({ email: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/inventory/${editingId}`, { ...form, quantity: Number(form.quantity) });
        setEditingId(null);
      } else {
        await axios.post('http://localhost:3000/inventory', { ...form, quantity: Number(form.quantity) });
      }
      setForm({ name: '', category: '', quantity: '', location: '' });
      fetchItems();
    } catch (err) { console.error("Errore salvataggio:", err); }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, category: item.category, quantity: item.quantity, location: item.location });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Eliminare questo oggetto?")) {
      await axios.delete(`http://localhost:3000/inventory/${id}`);
      fetchItems();
    }
  };

  // LOGICA DI FILTRAGGIO AGGIORNATA
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const isLowStock = item.quantity <= item.min_threshold;
    
    // Se il filtro "solo in esaurimento" è attivo, mostra solo quelli sotto soglia
    if (showLowStockOnly && !isLowStock) return false;
    
    return matchesSearch;
  });

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Funzione per determinare lo stato visivo della singola merce
  const getItemStatus = (quantity, threshold) => {
    if (quantity <= threshold) return { color: '#c62828', bg: '#ffebee', label: '🔴 CRITICO' };
    if (quantity <= threshold * 1.5) return { color: '#f57c00', bg: '#fff3e0', label: '🟡 ATTENZIONE' };
    return { color: '#2e7d32', bg: '#e8f5e9', label: '🟢 OK' };
  };

  if (!token) {
    return (
      <div style={{ maxWidth: '450px', margin: '4rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h2>📦 Inventory Tracker</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button onClick={() => setView('login')} style={{ fontWeight: view === 'login' ? 'bold' : 'normal', background: 'none', border: 'none', borderBottom: view === 'login' ? '2px solid blue' : 'none', cursor: 'pointer', fontSize: '1rem' }}>Accedi</button>
          <button onClick={() => setView('register')} style={{ fontWeight: view === 'register' ? 'bold' : 'normal', background: 'none', border: 'none', borderBottom: view === 'register' ? '2px solid blue' : 'none', cursor: 'pointer', fontSize: '1rem' }}>Registrati</button>
        </div>

        {view === 'login' ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input placeholder="Email" type="email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input placeholder="Password" type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <button type="submit" style={{ padding: '0.7rem', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>Entra</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input placeholder="Username" value={registerForm.username} onChange={e => setRegisterForm({...registerForm, username: e.target.value})} required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input placeholder="Email" type="email" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input placeholder="Password" type="password" value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <div style={{ background: '#f5f5f5', padding: '0.8rem', borderRadius: '4px', fontSize: '0.85rem', color: '#555', textAlign: 'left' }}>
              <strong>🔒 Requisiti password:</strong>
              <ul style={{ margin: '0.5rem 0 0 1.5rem', lineHeight: '1.6' }}>
                <li>Minimo 8 caratteri</li>
                <li>Almeno una lettera maiuscola (A-Z)</li>
                <li>Almeno una lettera minuscola (a-z)</li>
                <li>Almeno un numero (0-9)</li>
                <li>Almeno un carattere speciale (!@#$%^&*...)</li>
              </ul>
            </div>
            <button type="submit" style={{ padding: '0.7rem', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>Crea Account</button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>📦 Inventory Tracker</h1>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🚪 Logout</button>
      </div>
      
      {/* DASHBOARD SEMPLIFICATA: Solo Totale Oggetti */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
        <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '8px', textAlign: 'center', flex: 1 }}>
          <h3 style={{ margin: 0, color: '#1565c0' }}>Totale Oggetti</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold', color: '#0d47a1' }}>{totalItems}</p>
        </div>
      </div>

      {/* BARRA DI RICERCA E FILTRO IN ESAURIMENTO */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
        <input 
          placeholder="🔍 Cerca per nome o categoria..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }} 
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 'bold', color: '#c62828' }}>
          <input 
            type="checkbox" 
            checked={showLowStockOnly} 
            onChange={e => setShowLowStockOnly(e.target.checked)} 
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          🚨 Solo in esaurimento
        </label>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
        <input placeholder="Nome" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{ flex: 2, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
        <input placeholder="Categoria" value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
        <input type="number" placeholder="Qtà" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required style={{ width: '80px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
        <input placeholder="Posizione" value={form.location} onChange={e => setForm({...form, location: e.target.value})} style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
        <button type="submit" style={{ padding: '0.5rem 1rem', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>{editingId ? '💾 Salva' : '➕ Aggiungi'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', category: '', quantity: '', location: '' }); }} style={{ padding: '0.5rem 1rem', background: '#9e9e9e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Annulla</button>}
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredItems.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            {showLowStockOnly ? "Nessun articolo in esaurimento. Ottimo lavoro! 🎉" : "Nessun oggetto trovato."}
          </p>
        ) : (
          filteredItems.map(item => {
            const status = getItemStatus(item.quantity, item.min_threshold);
            return (
              <li key={item.id} style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* INDICATORE VISIVO DI STATO */}
                  <div style={{ 
                    background: status.bg, 
                    color: status.color, 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    minWidth: '90px',
                    textAlign: 'center'
                  }}>
                    {status.label}
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>{item.name}</strong> <span style={{ color: '#666' }}>({item.category})</span><br />
                    <span>Qtà: {item.quantity} (Min: {item.min_threshold}) | 📍 {item.location}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(item)} style={{ padding: '0.4rem 0.8rem', background: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✏️ Modifica</button>
                  <button onClick={() => handleDelete(item.id)} style={{ padding: '0.4rem 0.8rem', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🗑️ Elimina</button>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
export default App;