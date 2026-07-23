import { formatTime } from '../utils/metricsCalculator.js';

export function renderTimeline(routeData, containerEl) {
  if (!containerEl) return;

  const fm = routeData.firstMile;
  const tr = routeData.transitLeg;
  const lm = routeData.lastMile;

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
    <div class="clean-timeline-card glass-panel">
      <div class="timeline-header-row">
        <span class="timeline-title">
          <span class="db-logo-box" style="font-size: 0.75rem; padding: 1px 5px;">DB</span>
          Reiseverlauf & Umstieg
        </span>
        <span class="timeline-status-badge">🟢 Pünktlich</span>
      </div>
      
      <div class="clean-steps-list">
        <!-- Step 1: First Mile -->
        <div class="clean-step-item">
          <div class="step-dot-container">
            <span class="clean-dot dot-car"></span>
            <span class="clean-line"></span>
          </div>
          <div class="step-details">
            <div class="step-top-line">
              <span class="step-mode-tag">${fm.modeBadge}</span>
              <span class="step-time-text">${formatTime(fm.adjustedDurationMin)} (${fm.distanceKm} km)</span>
            </div>
            <div class="step-route-text">
              <span>📍 ${fm.startAddress}</span>
              <span class="arrow">→</span>
              <span>🚉 <b>${routeData.hubName}</b></span>
            </div>
          </div>
        </div>

        <!-- Step 2: Main ÖPNV Transit Leg -->
        <div class="clean-step-item">
          <div class="step-dot-container">
            <span class="clean-dot dot-train"></span>
            <span class="clean-line"></span>
          </div>
          <div class="step-details highlight-train-box">
            <div class="step-top-line">
              <span class="step-mode-tag tag-purple">🚆 ${tr.lineName}</span>
              <span class="step-time-text">${formatTime(tr.durationMinutes)}</span>
            </div>
            
            <div class="train-schedule-row">
              <div class="sch-item">
                <span class="sch-time">${tr.departureTime} Uhr</span>
                <span class="sch-station"><b>${tr.fromHub}</b></span>
                <span class="sch-platform">${tr.platform || 'Gleis 3'}</span>
              </div>
              <div class="sch-arrow">→</div>
              <div class="sch-item">
                <span class="sch-time">${tr.arrivalTime} Uhr</span>
                <span class="sch-station"><b>${tr.toHub}</b></span>
                <span class="sch-platform">${tr.arrPlatform || 'Gleis 1a'}</span>
              </div>
            </div>

            <details class="clean-stops-details">
              <summary class="clean-stops-summary">${stopoversList.length - 2} Zwischenhalte anzeigen</summary>
              <div class="clean-stops-sublist">
                ${stopoversList.slice(1, -1).map(s => `
                  <div class="clean-substop-row">
                    <span class="substop-time">${s.time}</span>
                    <span class="substop-name">${s.station}</span>
                    <span class="substop-platform">${s.platform}</span>
                  </div>
                `).join('')}
              </div>
            </details>
          </div>
        </div>

        <!-- Step 3: Last Mile Walking -->
        <div class="clean-step-item">
          <div class="step-dot-container">
            <span class="clean-dot dot-walk"></span>
          </div>
          <div class="step-details">
            <div class="step-top-line">
              <span class="step-mode-tag">🚶 Fußweg</span>
              <span class="step-time-text">${formatTime(lm.durationMinutes)} (${lm.distanceKm} km)</span>
            </div>
            <div class="step-route-text">
              <span>🏁 <b>${lm.destAddress}</b></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  containerEl.innerHTML = htmlContent;
}
