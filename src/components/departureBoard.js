import { transitApi } from '../services/api/transitApi.js';

export async function renderDepartureBoard(stationName, containerEl) {
  if (!containerEl) return;

  containerEl.innerHTML = `
    <div class="departure-board-card">
      <div class="board-header">
        <h4>🚉 Live-Abfahrtstafel (${stationName})</h4>
        <span class="live-dot">LIVE</span>
      </div>
      <div id="departures-loading" class="text-muted">Abfahrten werden geladen...</div>
      <div id="departures-list" class="departures-list"></div>
    </div>
  `;

  const deps = await transitApi.getDepartureBoard(stationName);
  const listEl = containerEl.querySelector('#departures-list');
  const loadEl = containerEl.querySelector('#departures-loading');

  if (loadEl) loadEl.style.display = 'none';

  if (listEl) {
    listEl.innerHTML = deps.map(d => `
      <div class="dep-item">
        <div class="dep-line-badge">${d.line}</div>
        <div class="dep-direction">Richtung <b>${d.direction}</b></div>
        <div class="dep-time-platform">
          <span class="dep-time">${d.time}</span>
          ${d.delay > 0 ? `<span class="dep-delay">+${d.delay} Min.</span>` : ''}
          <span class="dep-platform">${d.platform}</span>
        </div>
      </div>
    `).join('');
  }
}
