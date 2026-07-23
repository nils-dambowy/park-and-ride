# Park & Ride / Bike & Ride Calculator 🚗🚲🚆

Eine moderne, hochskalierbare und portable Webanwendung für intermodale Routenplanung (Erste Meile MIV/Fahrrad/Fußweg + ÖPNV-Hauptstrecke + Letzte Meile).

---

## 🌟 Hauptfunktionen & Highlights

- **⚡ Strict Intermodal Engine**: Berechnet die schnellste Kombination aus Individualverkehr (Auto/Fahrrad/Zu Fuß) und öffentlichen Verkehrsmitteln. Reines Autofahren oder reine ÖPNV-Fahrten sind ausgeschlossen.
- **⏱️ Pufferzeiten**: Automatische Addition von +5 Min. Parken & Gleiswechsel (Auto) und +2 Min. Fahrrad anschließen (Bike & Ride).
- **🚗 Live-Verkehr & Stau-Aufschlag**: Dynamische Einberechnung von Verkehrsstaus auf der 1. Meile im Berufsverkehr (+35% Fahrzeit).
- **🌧️ Wetter-Faktor (Regen-Warnung)**: Live Wetter-Check (Open-Meteo API) warnen bei Regenrisiko und empfehlen P+R Auto oder überdachte Fahrrad-Boxen.
- **🗺️ Interaktive Leaflet-Karte**: Farbcodierte Streckenverläufe (Blau = Auto, Grün = Fahrrad, Violett = ÖPNV, Grau = Fußweg) mit klickbaren Bahnhofs-Knotenpunkten.
- **📊 Executive KPI Overview & Vergleichsmatrix**: Side-by-Side Kategorieregister (Schnellste Intermodal-Route, Eco Champion B+R, Reiner MIV Warnung).
- **🎫 Deutschlandticket & Tarif-Berater**: Zeigt Gültigkeit des 49€-Tickets und P+R Parkgebühren.
- **🔐 Auth & Rollen- & Rechtesystem (RBAC)**: Administrator, Benutzer und Gast-Rollen mit Passwort-Hashing & Token-Verwaltung.
- **👑 Executive Admin Dashboard**: Benutzerverwaltung, Rollenzuweisung, System-Control & ESG Community Sustainability Report.
- **🟢 Öffentliche API Status-Page**: Live-Echtzeit-Diagnose und Latzenzmessung aller angebundenen APIs (OSRM, DB/HAFAS, Nominatim, Weather).
- **⭐ Persistenter Routenspeicher & Pendler-Stau-Alarm**: Gespeicherte Lieblingsrouten mit morgendlicher Stauwarnung.
- **🐳 Multi-Stage Docker Suite**: Node 20 Builder $\rightarrow$ Nginx Alpine Runtime (<25 MB) mit `docker-compose.yml`.

---

## 🔑 Demo-Zugänge (Für Sofort-Test)

- **👑 Admin-Konto**: `admin@park-ride.de` | Passwort: `Admin123!`
- **👤 User-Konto**: `user@park-ride.de` | Passwort: `User123!`

---

## 🚀 Quick Start (Entwicklung)

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Entwicklungs-Server starten
npm run dev

# 3. Production Build erstellen
npm run build
```

---

## 🐳 Docker Deployment

```bash
# Container bauen und starten (Port 8080)
docker compose up -d

# Status der Anwendung prüfen
docker compose ps
```

---

## ⚙️ Verwendete APIs & Tech-Stack

- **Frontend Build**: Vite + Vanilla JavaScript ES6 Modules
- **Design System**: Vanilla CSS3 (Custom Properties, Glassmorphism, Dark Mode)
- **Map & GIS**: Leaflet.js mit OpenStreetMap & CartoDB Dark Tiles
- **Routing Engine**: OSRM (Open Source Routing Machine) Global API
- **Transit & Timetable**: Deutsche Bahn / HAFAS REST API (`v6.db.transport.rest`)
- **Geocoding**: OpenStreetMap Nominatim API
- **Weather**: Open-Meteo API
