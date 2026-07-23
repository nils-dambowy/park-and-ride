import { formatTime, formatCO2, formatMoney } from '../utils/metricsCalculator.js';

export function renderOverviewDashboard(routeData, containerEl) {
  if (!containerEl || !routeData) return;

  const html = `
    <div class="minimal-summary-bar glass-panel">
      <div class="summary-pill">
        <span class="pill-icon">⏱️</span>
        <span class="pill-label">Gesamtzahl</span>
        <span class="pill-value text-purple">${formatTime(routeData.totalDurationMinutes)}</span>
        <span class="pill-sub">(-${routeData.timeSavedMinutes} Min. vs. Stau)</span>
      </div>

      <div class="summary-divider"></div>

      <div class="summary-pill">
        <span class="pill-icon">🌿</span>
        <span class="pill-label">CO₂-Gespart</span>
        <span class="pill-value text-green">${formatCO2(routeData.metrics.co2SavedGram)}</span>
      </div>

      <div class="summary-divider"></div>

      <div class="summary-pill">
        <span class="pill-icon">💰</span>
        <span class="pill-label">Ersparnis</span>
        <span class="pill-value text-blue">${formatMoney(routeData.metrics.moneySavedEuro)}</span>
      </div>
    </div>
  `;

  containerEl.innerHTML = html;
}
