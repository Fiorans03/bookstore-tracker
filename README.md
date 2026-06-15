# 📚 BookStore Tracker

BookStore Tracker è un'applicazione web full-stack per la gestione multi-tenant delle scorte di una libreria, con monitoraggio dei volumi in tempo reale. Il progetto è completamente containerizzato tramite Docker Compose.

## Progetto
Ho sviluppato un'applicazione web che permette la gestione del catalogo di una libreria tramite autenticazione JWT. Gli utenti possono registrarsi, effettuare login e gestire i propri volumi in modo isolato, con dashboard in tempo reale e alert automatici per i libri da riordinare.

### 1. Funzionalità
- **UX avanzata e catalogazione precisa**: Selezione multipla dei generi (oltre 20 categorie) con visualizzazione in lista del solo genere principale per massima pulizia visiva, mantenendo comunque la ricercabilità su tutti i generi associati al volume.
- **Isolamento dati multi-utente**: Ogni utente visualizza e gestisce esclusivamente il proprio catalogo (Multi-tenancy).
- **UX avanzata e catalogazione precisa**: Selezione multipla dei generi (oltre 20 categorie tra narrativa, saggistica, accademico e hobby) e scelta della Tipologia, per una classificazione dei volumi realistica, flessibile e senza errori di battitura.
- **Monitoraggio scorte granulare**: Indicatore visivo di stato per ogni singolo volume (🟢 DISPONIBILE, 🟡 SCORTA BASSA, 🔴 DA RIORDINARE) basato sulla soglia minima.
- **Filtro operativo rapido**: Checkbox "Solo da riordinare" per isolare istantaneamente i libri che necessitano di rifornimento.
- **Ricerca avanzata**: Barra di ricerca istantanea che filtra simultaneamente per Titolo, Autore o Genere.
- **Architettura containerizzata**: Portabilità totale garantita da Docker Compose.
- **Design moderno e accogliente**: Interfaccia utente dotata dell'effetto *glassmorphism* (vetro smerigliato) e sfondo tematico a biblioteca, per un'esperienza professionale, leggibile e visivamente appagante su qualsiasi dispositivo.

### 2. Architettura del progetto
L'applicazione segue una 3-tier architecture:
- **Frontend**: React 19 + Vite
- **Backend**: Node.js 20 + Express (API REST)
- **Database**: PostgreSQL 16

### 3. Database
Il database viene inizializzato automaticamente tramite Docker.
- **Tabelle**: `users` (credenziali) e `inventory` (volumi del catalogo).
- **Relazione**: un utente può avere più volumi nel proprio catalogo (1 → N), associati tramite `user_id`.

### 4. Scelte progettuali
- **React + Vite** → UI moderna, reattiva e build veloce.
- **Node.js + Express** → API REST leggere, modulari e scalabili.
- **PostgreSQL** → database relazionale affidabile e robusto.
- **JWT + bcrypt** → autenticazione stateless e massima sicurezza per le password.
- **Docker Compose** → portabilità totale del progetto (funziona su qualsiasi macchina).

### 5. Avvio del progetto con Docker
1. Clona il repository:
   ```bash
   git clone https://github.com/Fiorans03/bookstore-tracker.git
   cd inventory-tracker

2. Avvia i container:
   docker compose up --build

3. I servizi disponibili sono:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

### 6. CI/CD Pipeline
Il progetto include una pipeline GitHub Actions che si attiva automaticamente ad ogni push sul branch main. La pipeline esegue il checkout del codice, l'installazione delle dipendenze, la verifica della sintassi, la build del frontend e la build delle immagini Docker, garantendo la qualità del codice a ogni modifica.

### 7. Struttura del progetto

```text
bookstore-tracker/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── inventory.routes.js
│   │   └── app.js
│   ├── Dockerfile
│   ── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── Dockerfile
│   └── package.json
│
├── db/
│   └── init.sql
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
├── .env
└── README.md
```

```bash
Autore: Fiorans03
Tecnologie utilizzate: React, Node.js, Express, PostgreSQL, Docker, GitHub Actions