import { storageService } from '../services/storageService.js';
import { authService } from '../services/authService.js';
import { commuterAlertService } from '../services/commuterAlertService.js';

export function renderSavedRoutesDrawer(containerEl, onClose, onLoadRoute) {
  if (!containerEl) return;

  const user = authService.getCurrentUser();
  if (!user) {
    containerEl.innerHTML = `
      <div class="drawer-backdrop">
        <div class="drawer-panel glass-panel">
          <div class="drawer-header">
            <h3>⭐ Gespeicherte Routen & Pendler-Alarm</h3>
            <button class="close-btn" id="close-drawer">✕</button>
          </div>
          <div class="drawer-body">
            <p>Bitte melden Sie sich an, um Ihre Lieblingsrouten zu speichern und den morgendlichen Stau-Alarm zu aktivieren.</p>
          </div>
        </div>
      </div>
    `;
    containerEl.querySelector('#close-drawer')?.addEventListener('click', onClose);
    return;
  }

  const saved = storageService.getSavedRoutes(user.id);
  const alerts = commuterAlertService.checkRouteAlerts(saved);

  containerEl.innerHTML = `
    <div class="drawer-backdrop">
      <div class="drawer-panel glass-panel">
        <div class="drawer-header">
          <h3>⭐ Gespeicherte Routen (${user.name})</h3>
          <button class="close-btn" id="close-drawer">✕</button>
        </div>

        <div class="drawer-body">
          ${alerts.length > 0 ? `
            <div class="commuter-alerts-section">
              <h4>🔔 Aktive Pendler-Stauwarnungen</h4>
              ${alerts.map(a => `
                <div class="alert-box alert-warning">
                  <b>${a.routeTitle}</b><br>
                  ${a.message}
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div class="saved-routes-list">
            ${saved.length === 0 ? `
              <p class="text-muted">Noch keine Routen gespeichert. Berechnen Sie eine Route und klicken Sie auf "Route speichern".</p>
            ` : saved.map(r => `
              <div class="saved-route-card">
                <div class="route-card-header">
                  <b>${r.title}</b>
                  <button class="btn btn-xs btn-danger delete-route-btn" data-id="${r.id}">Löschen</button>
                </div>
                <div class="route-card-details">
                  <span>Knoten: ${r.hubName}</span>
                  <span>Dauer: ${r.totalDuration} Min. | CO₂ gespart: ${r.co2SavingsKg} kg</span>
                </div>
                <div class="route-card-actions">
                  <button class="btn btn-xs btn-primary load-route-btn" data-id="${r.id}">
                    ▶️ Route laden & anzeigen
                  </button>
                  <label class="toggle-switch">
                    <input type="checkbox" class="alert-toggle" data-id="${r.id}" ${r.commuterAlert ? 'checked' : ''} />
                    <span>🔔 Stau-Alarm</span>
                  </label>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Events
  containerEl.querySelector('#close-drawer')?.addEventListener('click', onClose);

  containerEl.querySelectorAll('.delete-route-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const routeId = e.target.getAttribute('data-id');
      storageService.deleteSavedRoute(user.id, routeId);
      renderSavedRoutesDrawer(containerEl, onClose, onLoadRoute);
    });
  });

  containerEl.querySelectorAll('.load-route-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const routeId = e.target.getAttribute('data-id');
      const targetRoute = saved.find(r => r.id === routeId);
      if (targetRoute && onLoadRoute) {
        onLoadRoute(targetRoute);
        onClose();
      }
    });
  });

  containerEl.querySelectorAll('.alert-toggle').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const routeId = e.target.getAttribute('data-id');
      storageService.toggleCommuterAlert(user.id, routeId);
    });
  });
}
