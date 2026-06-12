# Inventory Tracker

Applicazione web full-stack per la gestione multi-utente di un inventario con monitoraggio delle scorte in tempo reale. Il progetto è completamente containerizzato tramite Docker Compose ed è pensato per essere eseguibile su qualsiasi macchina senza configurazioni manuali complesse.

## Progetto

Applicazione web che permette la gestione di un inventario personale o professionale tramite autenticazione JWT.

Gli utenti possono registrarsi, effettuare login e gestire i propri articoli in modo isolato, con dashboard in tempo reale e alert automatici per le scorte basse.

### 1. Funzionalità

- **Registrazione e login utenti** con autenticazione JWT
- **Isolamento dati multi-utente**: ogni utente visualizza e gestisce esclusivamente il proprio inventario
- **CRUD completo**: creazione, lettura, modifica e cancellazione articoli
- **Dashboard intelligente**: metriche in tempo reale su totale oggetti e alert per scorte basse
- **Barra di ricerca istantanea**: filtro per nome o categoria
- **Persistenza dati** su PostgreSQL
- **Architettura containerizzata** con Docker Compose

### 2. Architettura del progetto

L'applicazione segue una **3-tier architecture**:
