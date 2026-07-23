import { formatMoney, formatCO2 } from '../utils/metricsCalculator.js';

export function renderCostCalculatorModal(routeData, containerEl, onClose) {
  if (!containerEl || !routeData) return;

  const monthlyMoney = routeData.metrics.moneySavedEuro * 22; // 22 working days
  const annualMoney = monthlyMoney * 11; // 11 months

  const monthlyCO2 = (routeData.metrics.co2SavedGram * 22) / 1000;
  const annualCO2 = monthlyCO2 * 11;

  containerEl.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-box cost-modal-box glass-panel">
        <div class="modal-header">
          <h2>💰 Kosten- & CO₂-Jahresersparnis Rechner</h2>
          <button class="close-btn" id="close-cost-modal">✕</button>
        </div>

        <div class="modal-body">
          <div class="cost-summary-hero">
            <div class="hero-stat">
              <span class="hero-val text-green">${formatMoney(annualMoney)}</span>
              <span class="hero-lbl">Ersparnis pro Jahr</span>
            </div>
            <div class="hero-stat">
              <span class="hero-val text-purple">${(annualCO2).toFixed(1)} kg</span>
              <span class="hero-lbl">CO₂-Ersparnis pro Jahr</span>
            </div>
          </div>

          <div class="cost-breakdown-table">
            <h4>Vergleichsaufschlüsselung (Pendeln)</h4>
            <table class="table-styled">
              <thead>
                <tr>
                  <th>Kategorie</th>
                  <th>Reines Auto (Innenstadt)</th>
                  <th>P+R / B+R Kombi</th>
                  <th>Deine Ersparnis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tägliche Kosten</td>
                  <td>${formatMoney(routeData.metrics.moneySavedEuro + 2.50)}</td>
                  <td>2,50 €</td>
                  <td><b class="text-green">${formatMoney(routeData.metrics.moneySavedEuro)} / Tag</b></td>
                </tr>
                <tr>
                  <td>Monatliche Kosten</td>
                  <td>${formatMoney((routeData.metrics.moneySavedEuro + 2.50) * 22)}</td>
                  <td>55,00 € (incl. Abo)</td>
                  <td><b class="text-green">${formatMoney(monthlyMoney)} / Monat</b></td>
                </tr>
                <tr>
                  <td>Jährliche Kosten</td>
                  <td>${formatMoney(((routeData.metrics.moneySavedEuro + 2.50) * 22) * 11)}</td>
                  <td>605,00 €</td>
                  <td><b class="text-green">${formatMoney(annualMoney)} / Jahr</b></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="cost-cta-box">
            <p>Parken Sie entspannt am P+R Knotenpunkt und sparen Sie jährlich über <b>${formatMoney(annualMoney)}</b>!</p>
          </div>
        </div>
      </div>
    </div>
  `;

  containerEl.querySelector('#close-cost-modal')?.addEventListener('click', onClose);
}
