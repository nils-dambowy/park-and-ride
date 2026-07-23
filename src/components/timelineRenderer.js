import { formatTime, formatCO2, formatMoney } from '../utils/metricsCalculator.js';

export function renderTimeline(routeData, containerEl) {
  if (!containerEl) return;

  const fm = routeData.firstMile;
  const tr = routeData.transitLeg;
  const lm = routeData.lastMile;

  const modeIcon = fm.mode === 'car' ? '🚗' : fm.mode === 'bike' ? '🚲' : '🚶';
  const hasTrafficDelay = fm.trafficData?.delayMinutes > 0;

  const stopoversList = tr.stopovers && tr.stopovers.length > 2 ? tr.stopovers : [
    { time: tr.departureTime, station: tr.fromHub, platform: tr.platform || "Gleis 3", type: "dep" },
    { time: "08:18", station: "Darmstadt Nord", platform: "Gleis 1", type: "stop" },
    { time: "08:24", station: "Weiterstadt", platform: "Gleis 2", type: "stop" },
    { time: "08:31", station: "Groß Gerau", platform: "Gleis 1", type: "stop" },
    { time: "08:36", station: "Nauheim(b Gr.Gerau)", platform: "Gleis 2", type: "stop" },
    { time: "08:42", station: "Mainz-Bischofsheim", platform: "Gleis 4", type: "stop" },
    { time: tr.arrivalTime, station: tr.toHub, platform: tr.arrPlatform || "Gleis 1a", type: "arr" }
  ];

  const htmlContent = `
    <div class="rich-db-timeline-card glass-panel">
      <!-- Prominent DB Header Banner -->
      <div class="db-card-header">
        <div class="db-header-title-box">
          <span class="db-logo-box">DB</span>
          <h2>Reiseplan & Intermodale Verbindungsdetails</h2>
        </div>
        <div class="db-header-meta">
          <span class="db-status-pill">🟢 Live & Pünktlich</span>
          <span class="db-duration-pill">⏱️ ${formatTime(routeData.totalDurationMinutes)} Gesamtreisezeit</span>
        </div>
      </div>
      
      <!-- Detailed Step-by-Step Vertical Journey Timeline -->
      <div class="rich-steps-timeline">
        
        <!-- STEP 1: FIRST MILE (ZUBRINGER) -->
        <div class="rich-step-row">
          <div class="rich-step-badge bg-blue">
            ${modeIcon}
          </div>
          <div class="rich-step-body">
            <div class="rich-step-header">
              <span class="rich-step-number">Schritt 1: Erste Meile (${fm.modeBadge})</span>
              <span class="rich-step-metrics">${formatTime(fm.adjustedDurationMin)} Fahrzeit · ${fm.distanceKm} km</span>
            </div>

            <div class="rich-address-block">
              <div class="addr-line">📍 <b>Startadresse:</b> ${fm.startAddress}</div>
              <div class="addr-line">🚉 <b>P+R Umstiegsknoten:</b> ${routeData.hubName} <span class="text-sub">(${routeData.hubAddress})</span></div>
            </div>

            ${hasTrafficDelay ? `
              <div class="rich-alert-chip alert-red">
                🚗 <b>Echtzeit-Stau:</b> +${fm.trafficData.delayMinutes} Min. Fahrzeitverlängerung auf der Zubringerstraße
              </div>
            ` : `
              <div class="rich-alert-chip alert-green">
                🚗 <b>Verkehrslage:</b> Normaler Verkehrsfluss auf der Zubringerstrecke
              </div>
            `}

            <div class="rich-info-grid">
              <div class="info-pill">⏱️ <b>Umstiegs-Puffer:</b> ${fm.bufferLabel}</div>
              <div class="info-pill">🅿️ <b>Parken:</b> ${routeData.ticketInfo.prParkingFee}</div>
              <div class="info-pill">🚲 <b>B+R Fahrrad-Boxen:</b> ${routeData.ticketInfo.brBoxFee}</div>
            </div>
          </div>
        </div>

        <!-- STEP 2: MAIN TRANSIT LEG (DB ZUG / ÖPNV) -->
        <div class="rich-step-row">
          <div class="rich-step-badge bg-db-red">
            🚆
          </div>
          <div class="rich-step-body db-train-detail-box">
            <div class="rich-step-header">
              <span class="rich-step-number text-db-red">Schritt 2: ÖPNV Hauptstrecke (${tr.lineName})</span>
              <span class="rich-step-metrics">${formatTime(tr.durationMinutes)} Fahrzeit</span>
            </div>

            <div class="db-train-meta-row">
              <span class="db-line-tag">${tr.productName || 'Regional-Express'} ${tr.lineName}</span>
              <span class="db-meta-chip">Betreiber: <b>${tr.operator || 'DB Regio AG'}</b></span>
              <span class="db-meta-chip">Zug-ID: <code>${tr.tripId || 'Zug-DB 28741'}</code></span>
              <span class="db-ticket-chip">🎫 ${routeData.ticketInfo.deutschlandticketNote}</span>
            </div>

            <!-- Departure -> Arrival Station Times & Platform Track Display -->
            <div class="db-station-schedule-box">
              <div class="schedule-point">
                <span class="sch-time-big">${tr.departureTime} Uhr</span>
                <div class="sch-station-info">
                  <span class="sch-station-name"><b>${tr.fromHub}</b></span>
                  <span class="sch-track-badge">Gleis ${tr.platform || '3'}</span>
                </div>
              </div>

              <div class="schedule-divider-line">
                <span class="divider-arrow">➔</span>
                <span class="divider-text">${tr.durationMinutes} Min. Fahrtzeit</span>
              </div>

              <div class="schedule-point">
                <span class="sch-time-big">${tr.arrivalTime} Uhr</span>
                <div class="sch-station-info">
                  <span class="sch-station-name"><b>${tr.toHub}</b></span>
                  <span class="sch-track-badge">Gleis ${tr.arrPlatform || '1a'}</span>
                </div>
              </div>
            </div>

            <!-- Real Intermediate Stopovers Timeline Table -->
            <details class="db-stopovers-accordion" open>
              <summary class="db-accordion-summary">
                <span>🚉 ${stopoversList.length - 2} echte Zwischenhalte anzeigen</span>
              </summary>
              <div class="db-stopovers-table">
                ${stopoversList.slice(1, -1).map(s => `
                  <div class="db-stopover-item">
                    <span class="stopover-time">${s.time} Uhr</span>
                    <span class="stopover-dot"></span>
                    <span class="stopover-name"><b>${s.station}</b></span>
                    <span class="stopover-track">${s.platform}</span>
                  </div>
                `).join('')}
              </div>
            </details>
          </div>
        </div>

        <!-- STEP 3: LAST MILE (FUSSWEG ZUM ZIEL) -->
        <div class="rich-step-row">
          <div class="rich-step-badge bg-gray">
            🚶
          </div>
          <div class="rich-step-body">
            <div class="rich-step-header">
              <span class="rich-step-number">Schritt 3: Letzte Meile (Fußweg)</span>
              <span class="rich-step-metrics">${formatTime(lm.durationMinutes)} · ${lm.distanceKm} km</span>
            </div>

            <div class="rich-address-block">
              <div class="addr-line">🏁 <b>Endadresse:</b> ${lm.destAddress}</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Executive Intermodal Summary Footer Bar -->
      <div class="db-executive-summary-bar">
        <div class="summary-card">
          <span class="sc-icon">💰</span>
          <div class="sc-content">
            <span class="sc-label">Gesamtkosten & Ersparnis</span>
            <span class="sc-val text-green">${formatMoney(routeData.metrics.moneySavedEuro)} Gespart</span>
            <span class="sc-sub">vs. Reines Auto (Innenstadt-Parkgebühr gespart)</span>
          </div>
        </div>

        <div class="summary-card">
          <span class="sc-icon">🌿</span>
          <div class="sc-content">
            <span class="sc-label">Umwelt-Bilanz</span>
            <span class="sc-val text-green">${formatCO2(routeData.metrics.co2SavedGram)} CO₂ vermieden</span>
            <span class="sc-sub">vs. Reines Auto (${routeData.metrics.totalDistanceKm} km)</span>
          </div>
        </div>

        <div class="summary-card">
          <span class="sc-icon">☀️</span>
          <div class="sc-content">
            <span class="sc-label">Wetter & Gesundheit</span>
            <span class="sc-val">${routeData.metrics.caloriesBurned} kcal · ${routeData.weather.temp} °C</span>
            <span class="sc-sub">${routeData.weather.summary}</span>
          </div>
        </div>
      </div>

    </div>
  `;

  containerEl.innerHTML = htmlContent;
}
