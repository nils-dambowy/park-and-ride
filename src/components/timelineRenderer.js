import { formatTime } from '../utils/metricsCalculator.js';

export function renderTimeline(routeData, containerEl) {
  if (!containerEl) return;

  const fm = routeData.firstMile;
  const tr = routeData.transitLeg;
  const lm = routeData.lastMile;

  const modeIcon = fm.mode === 'car' ? '🚗' : fm.mode === 'bike' ? '🚲' : '🚶';
  const modeColor = fm.mode === 'car' ? '#3b82f6' : fm.mode === 'bike' ? '#10b981' : '#9ca3af';

  // Safe Traffic Badge
  const trafficBadgeText = fm.trafficData?.trafficInfo?.badge || '🚗 Live-Stau Check';
  const hasTrafficDelay = fm.trafficData?.delayMinutes > 0;

  // DB Navigator Style Intermediate Stopovers
  const stopoversList = tr.stopovers && tr.stopovers.length > 0 ? tr.stopovers : [
    { time: tr.departureTime, station: tr.fromHub, platform: tr.platform || "Gleis 3", type: "dep" },
    { time: "08:18", station: "Darmstadt Nord", platform: "Gleis 1", type: "stop" },
    { time: "08:24", station: "Weiterstadt", platform: "Gleis 2", type: "stop" },
    { time: "08:31", station: "Groß Gerau", platform: "Gleis 1", type: "stop" },
    { time: "08:36", station: "Nauheim(b Gr.Gerau)", platform: "Gleis 2", type: "stop" },
    { time: "08:42", station: "Mainz-Bischofsheim", platform: "Gleis 4", type: "stop" },
    { time: tr.arrivalTime, station: tr.toHub, platform: tr.arrPlatform || "Gleis 1a", type: "arr" }
  ];

  const htmlContent = `
    <div class="timeline-container glass-panel">
      <div class="db-app-header-badge">
        <span class="db-logo-chip">DB NAVIGATOR STYLE</span>
        <span class="live-status-chip">🟢 Live & Pünktlich</span>
      </div>
      <h3 class="timeline-header" style="margin-top: 8px;">Detaillierte Schritt-für-Schritt Routenführung</h3>
      
      <div class="timeline-steps">
        <!-- Step 1: First Mile -->
        <div class="timeline-step">
          <div class="step-badge" style="background-color: ${modeColor}">
            ${modeIcon}
          </div>
          <div class="step-content">
            <div class="step-title-row">
              <span class="step-title">1. Erste Meile: ${fm.modeBadge}</span>
              <span class="step-duration">${formatTime(fm.adjustedDurationMin)} (${fm.distanceKm} km)</span>
            </div>
            <div class="step-address-box">
              <span class="addr-label">📍 Startadresse:</span> <b>${fm.startAddress}</b><br/>
              <span class="addr-label">🚉 Ziel-Bahnhof (P+R):</span> <b>${routeData.hubName}</b> (${routeData.hubAddress})
            </div>
            ${hasTrafficDelay ? `<div class="traffic-warning-chip">🚗 Live-Verkehr: +${fm.trafficData.delayMinutes} Min. Fahrzeitverlängerung auf der Zubringerstraße</div>` : `<div class="traffic-ok-chip">${trafficBadgeText}</div>`}
            <div class="buffer-badge">⏱️ Pufferzeit am Umstiegsknoten: <b>${fm.bufferLabel}</b></div>
          </div>
        </div>

        <!-- Step 2: Main Transit Leg (DB Navigator Style Card) -->
        <div class="timeline-step">
          <div class="step-badge" style="background-color: #8b5cf6">
            🚆
          </div>
          <div class="step-content db-train-card">
            <div class="step-title-row">
              <span class="step-title text-purple">2. ÖPNV Hauptstrecke: ${tr.lineName} (${tr.operator})</span>
              <span class="step-duration">${formatTime(tr.durationMinutes)}</span>
            </div>

            <!-- DB Train Info Badge -->
            <div class="db-train-meta">
              <span class="db-train-badge">${tr.productName || 'Regional-Express'} ${tr.lineName}</span>
              <span class="db-trip-id">Fahrt-ID: <code>${tr.tripId || 'Zug 28741'}</code></span>
              <span class="chip chip-purple">🎫 ${routeData.ticketInfo.deutschlandticketNote}</span>
            </div>

            <!-- DB Style Stopover Timeline -->
            <div class="db-stopovers-container">
              <div class="db-stop-row dep-row">
                <span class="db-stop-time">${tr.departureTime} Uhr</span>
                <span class="db-stop-dot dot-dep"></span>
                <div class="db-stop-name">
                  <b>${tr.fromHub}</b>
                  <span class="db-platform">${tr.platform || 'Gleis 3'}</span>
                </div>
              </div>

              <!-- Accordion Trigger for Intermediate Stops -->
              <details class="db-intermediate-stops-details" open>
                <summary class="db-stops-summary">${stopoversList.length - 2} Zwischenhalte anzeigen</summary>
                <div class="db-stops-list">
                  ${stopoversList.slice(1, -1).map(s => `
                    <div class="db-stop-row stop-row">
                      <span class="db-stop-time">${s.time}</span>
                      <span class="db-stop-dot dot-stop"></span>
                      <div class="db-stop-name">
                        ${s.station}
                        <span class="db-platform-sub">${s.platform}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </details>

              <div class="db-stop-row arr-row">
                <span class="db-stop-time">${tr.arrivalTime} Uhr</span>
                <span class="db-stop-dot dot-arr"></span>
                <div class="db-stop-name">
                  <b>${tr.toHub}</b>
                  <span class="db-platform">${tr.arrPlatform || 'Gleis 1a'}</span>
                </div>
              </div>
            </div>

            <div class="transit-chip-row" style="margin-top: 10px;">
              <span class="chip">🅿️ P+R Parken: ${routeData.ticketInfo.prParkingFee}</span>
              <span class="chip">🚲 Fahrrad-Box: ${routeData.ticketInfo.brBoxFee}</span>
            </div>
          </div>
        </div>

        <!-- Step 3: Last Mile -->
        <div class="timeline-step">
          <div class="step-badge" style="background-color: #9ca3af">
            🚶
          </div>
          <div class="step-content">
            <div class="step-title-row">
              <span class="step-title">3. Letzte Meile: Fußweg zum Ziel</span>
              <span class="step-duration">${formatTime(lm.durationMinutes)} (${lm.distanceKm} km)</span>
            </div>
            <div class="step-address-box">
              <span class="addr-label">🏁 Endadresse:</span> <b>${lm.destAddress}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  containerEl.innerHTML = htmlContent;
}
