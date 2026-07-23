import { formatTime, formatCO2, formatMoney } from '../utils/metricsCalculator.js';

export function renderComparisonCards(routeData, containerEl, onSelectMode) {
  if (!containerEl) return;

  const currentMode = routeData.modeType;

  const html = `
    <div class="comparison-grid">
      <!-- Card 1: Fastest Intermodal (P+R Car) -->
      <div class="comp-card ${currentMode === 'car' ? 'active-card' : ''}" data-mode="car_pt">
        <div class="card-badge badge-blue">⚡ Schnellste Kombi (P+R)</div>
        <div class="card-icon">🚗 + 🚆</div>
        <h4>Auto + ÖPNV</h4>
        <div class="card-time">${formatTime(routeData.totalDurationMinutes)}</div>
        <div class="card-metrics">
          <span>Stau gespart: <b>-${routeData.timeSavedMinutes} Min.</b></span>
          <span>CO₂ gespart: <b>${formatCO2(routeData.metrics.co2SavedGram)}</b></span>
          <span>Geld gespart: <b>${formatMoney(routeData.metrics.moneySavedEuro)}</b></span>
        </div>
        <button class="btn btn-sm ${currentMode === 'car' ? 'btn-primary' : 'btn-outline'} select-mode-btn">
          ${currentMode === 'car' ? 'Aktiviert' : 'Wählen'}
        </button>
      </div>

      <!-- Card 2: Eco Champion (B+R Bike) -->
      <div class="comp-card ${currentMode === 'bike' ? 'active-card' : ''}" data-mode="bike_pt">
        <div class="card-badge badge-green">🌿 Eco Champion (B+R)</div>
        <div class="card-icon">🚲 + 🚆</div>
        <h4>Fahrrad + ÖPNV</h4>
        <div class="card-time">${formatTime(routeData.totalDurationMinutes + 4)}</div>
        <div class="card-metrics">
          <span>1. Meile: <b>0g CO₂ (Zero Emission)</b></span>
          <span>Kalorien: <b>~${routeData.metrics.caloriesBurned} kcal</b></span>
          <span>Wetter: <b>${routeData.weather.summary}</b></span>
        </div>
        <button class="btn btn-sm ${currentMode === 'bike' ? 'btn-primary' : 'btn-outline'} select-mode-btn">
          ${currentMode === 'bike' ? 'Aktiviert' : 'Wählen'}
        </button>
      </div>

      <!-- Card 3: Pure Car Baseline Warning -->
      <div class="comp-card card-crossed-out">
        <div class="card-badge badge-red">🚗 Reiner MIV (Vergleich)</div>
        <div class="card-icon">🚗</div>
        <h4>Reines Auto (Nicht empfohlen)</h4>
        <div class="card-time time-crossed">${formatTime(routeData.pureCarTotalTime)}</div>
        <div class="card-metrics">
          <span>Innenstadt-Stau: <b>+25 Min. Verzögerung</b></span>
          <span>Parkgebühr: <b>ca. 18,00 € / Tag</b></span>
          <span>Hohe Emissionen: <b>Keine CO₂-Ersparnis</b></span>
        </div>
        <div class="warning-tag">P+R / B+R empfohlen</div>
      </div>
    </div>
  `;

  containerEl.innerHTML = html;

  // Bind click handlers for mode switching
  containerEl.querySelectorAll('.comp-card[data-mode]').forEach(card => {
    card.addEventListener('click', () => {
      const mode = card.getAttribute('data-mode');
      if (onSelectMode) onSelectMode(mode);
    });
  });
}
