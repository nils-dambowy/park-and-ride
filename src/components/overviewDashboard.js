import { formatTime, formatCO2, formatMoney } from '../utils/metricsCalculator.js';

export function renderOverviewDashboard(routeData, containerEl) {
  if (!containerEl || !routeData) return;

  const html = `
    <div class="overview-dashboard-card">
      <div class="kpi-grid">
        <div class="kpi-item">
          <span class="kpi-label">⏱️ Gesamtreisezeit</span>
          <span class="kpi-value highlight-purple">${formatTime(routeData.totalDurationMinutes)}</span>
          <span class="kpi-sub font-green">-${routeData.timeSavedMinutes} Min. schneller als Stau</span>
        </div>

        <div class="kpi-item">
          <span class="kpi-label">🌱 CO₂-Ersparnis</span>
          <span class="kpi-value highlight-green">${formatCO2(routeData.metrics.co2SavedGram)}</span>
          <span class="kpi-sub">vs. Reines Auto (${routeData.metrics.totalDistanceKm} km)</span>
        </div>

        <div class="kpi-item">
          <span class="kpi-label">💰 Ersparnis (Sprit & Parken)</span>
          <span class="kpi-value highlight-blue">${formatMoney(routeData.metrics.moneySavedEuro)}</span>
          <span class="kpi-sub">Keine Innenstadt-Parkgebühr</span>
        </div>

        <div class="kpi-item">
          <span class="kpi-label">🔥 Kalorien & Gesundheit</span>
          <span class="kpi-value">${routeData.metrics.caloriesBurned} kcal</span>
          <span class="kpi-sub">${routeData.weather.summary}</span>
        </div>
      </div>
    </div>
  `;

  containerEl.innerHTML = html;
}
