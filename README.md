# Inventory Tracker

Inventory tracker è un'applicazione web full-stack per la gestione multi-utente di un inventario con monitoraggio delle scorte in tempo reale. Il progetto è completamente containerizzato tramite Docker Compose.

## Progetto
Applicazione web che permette la gestione di un inventario personale o professionale tramite autenticazione JWT. Gli utenti possono registrarsi, effettuare login e gestire i propri articoli in modo isolato, con dashboard in tempo reale e alert automatici per le scorte basse.

### 1. Funzionalità
- **Registrazione e login utenti** con autenticazione JWT
- **Validazione sicura**: Regole rigorose per la password (lunghezza minima, maiuscole, minuscole, numeri e    caratteri speciali) verificate sia lato frontend che backend
- **Isolamento dati multi-utente**: ogni utente visualizza e gestisce esclusivamente il proprio inventario
- **CRUD completo**: creazione, lettura, modifica e cancellazione articoli
- **Dashboard intelligente**: metriche in tempo reale su totale oggetti e alert per scorte basse
- **Barra di ricerca istantanea**: filtro per nome o categoria
- **Persistenza dati** su PostgreSQL
- **Architettura containerizzata** con Docker Compose

### 2. Architettura del progetto
L'applicazione segue una 3-tier architecture:
- **frontend** -> React (Vite)
- **backend** -> Node.js + Express (API REST)
- **db** -> PostgreSQL

### 3. Database
Il database viene inizializzato automaticamente tramite Docker.
- **Tabelle**: `users` (credenziali) e `inventory` (articoli)
- **Relazione**: un utente può avere più articoli in inventario (1 → N)

### 4. Scelte progettuali
- **React + Vite** → UI moderna e build veloce
- **Node.js + Express** → API REST leggere e modulari
- **PostgreSQL** → database relazionale affidabile
- **JWT + bcrypt** → autenticazione stateless e password criptate
- **Docker Compose** → portabilità totale del progetto

### 5. Avvio del progetto con Docker
1. Clona il repository:
   git clone https://github.com/Fiorans03/inventory-tracker.git
   cd inventory-tracker

2. Avvia i container:
   docker compose up --build

3. I servizi disponibili sono:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

### 6. CI/CD Pipeline
Il progetto include una pipeline GitHub Actions che si attiva automaticamente ad ogni push sul branch main, eseguendo linting, build del frontend e build delle immagini Docker.

### 7. Struttura del progetto

```text
inventory-tracker/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── routes/ (auth.routes.js, inventory.routes.js)
│   │   └── app.js
│   └── package.json
├── frontend/
│   ├── src/App.jsx
│   └── package.json
├── db/init.sql
├── .github/workflows/ci.yml
├── docker-compose.yml
├── .env
└── README.md
```

Autore: Fiorans03
Tecnologie utilizzate: React, Node.js, Express, PostgreSQL, Docker, GitHub Actions