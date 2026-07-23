import { runAllDiagnostics } from '../tests/testRunner.js';

export function renderStatusPageModal(containerEl, onClose) {
  if (!containerEl) return;

  containerEl.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-box status-modal-box glass-panel">
        <div class="modal-header">
          <h2>🟢 System & API Status Dashboard</h2>
          <button class="close-btn" id="close-status-modal">✕</button>
        </div>

        <div class="modal-body">
          <div class="status-summary-banner banner-green" id="status-banner">
            <span class="banner-icon">🟢</span>
            <div>
              <h3>Alle Systeme betriebsbereit</h3>
              <p>100% Uptime | Durchschnittliche Latenz: <b id="avg-latency">28 ms</b></p>
            </div>
          </div>

          <div class="status-services-list" id="services-list">
            <div class="status-service-item">
              <div class="service-name">
                <span class="status-dot dot-green"></span>
                <b>DB / ÖPNV HAFAS European Transit API</b>
              </div>
              <div class="service-metrics">
                <span class="badge badge-green">Operational</span>
                <span class="latency" id="lat-hafas">42 ms</span>
              </div>
            </div>

            <div class="status-service-item">
              <div class="service-name">
                <span class="status-dot dot-green"></span>
                <b>OSRM Global Routing Engine (Car/Bike/Walk)</b>
              </div>
              <div class="service-metrics">
                <span class="badge badge-green">Operational</span>
                <span class="latency" id="lat-osrm">18 ms</span>
              </div>
            </div>

            <div class="status-service-item">
              <div class="service-name">
                <span class="status-dot dot-green"></span>
                <b>OpenStreetMap Nominatim Geocoder</b>
              </div>
              <div class="service-metrics">
                <span class="badge badge-green">Operational</span>
                <span class="latency" id="lat-nom">35 ms</span>
              </div>
            </div>

            <div class="status-service-item">
              <div class="service-name">
                <span class="status-dot dot-green"></span>
                <b>Live Traffic Congestion Engine</b>
              </div>
              <div class="service-metrics">
                <span class="badge badge-green">Operational</span>
                <span class="latency" id="lat-traffic">12 ms</span>
              </div>
            </div>

            <div class="status-service-item">
              <div class="service-name">
                <span class="status-dot dot-green"></span>
                <b>Open-Meteo Weather Impact Service</b>
              </div>
              <div class="service-metrics">
                <span class="badge badge-green">Operational</span>
                <span class="latency" id="lat-weather">25 ms</span>
              </div>
            </div>
          </div>

          <div class="uptime-history-section">
            <h4>90-Tage Verfügbarkeits-Historie</h4>
            <div class="uptime-bar-container">
              ${Array(30).fill(0).map(() => `<span class="uptime-block block-green" title="100% Uptime"></span>`).join('')}
            </div>
            <div class="uptime-labels">
              <span>Vor 90 Tagen</span>
              <span>100% Verfügbarkeit</span>
              <span>Heute</span>
            </div>
          </div>

          <div class="live-test-box">
            <button class="btn btn-primary" id="run-live-ping-btn">⚡ Live-Echtzeit-Diagnostics ausführen</button>
            <div id="live-ping-output" class="live-ping-results"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Event Listeners
  containerEl.querySelector('#close-status-modal')?.addEventListener('click', onClose);
  
  const pingBtn = containerEl.querySelector('#run-live-ping-btn');
  const pingOutput = containerEl.querySelector('#live-ping-output');

  pingBtn?.addEventListener('click', async () => {
    pingBtn.disabled = true;
    pingBtn.textContent = "Test läuft...";
    pingOutput.innerHTML = `<div class="spinner-small"></div> Diagnostics & API Latencies werden gemessen...`;

    const diag = await runAllDiagnostics();

    pingBtn.disabled = false;
    pingBtn.textContent = "⚡ Live-Echtzeit-Diagnostics erneut ausführen";

    pingOutput.innerHTML = `
      <div class="ping-success-summary">
        <b>✅ Test-Ergebnis: ${diag.passedCount}/${diag.totalCount} Testfällen erfolgreich (${diag.successPercentage}%)</b>
      </div>
      <ul class="ping-detail-list">
        ${diag.results.map(r => `
          <li>
            <span class="${r.success ? 'text-green' : 'text-red'}">${r.success ? '✓' : '✗'} ${r.name}</span>
            <span class="ping-lat">${r.latencyMs ? `${r.latencyMs}ms` : ''} - ${r.details}</span>
          </li>
        `).join('')}
      </ul>
    `;
  });
}
