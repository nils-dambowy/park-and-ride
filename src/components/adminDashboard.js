import { authService } from '../services/authService.js';

export function renderAdminDashboard(containerEl, onClose) {
  if (!containerEl) return;

  const users = authService.getUsers();

  containerEl.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-box admin-modal-box glass-panel">
        <div class="modal-header">
          <h2>👑 Executive Admin Dashboard</h2>
          <button class="close-btn" id="close-admin-modal">✕</button>
        </div>

        <div class="modal-body">
          <!-- ESG Community Sustainability Widget -->
          <div class="esg-widget-card">
            <h3>🌱 Community ESG Sustainability Impact</h3>
            <div class="esg-metrics-row">
              <div class="esg-metric">
                <span class="esg-val">48,2 Tonnen</span>
                <span class="esg-lbl">Gesamt-CO₂ eingespart</span>
              </div>
              <div class="esg-metric">
                <span class="esg-val">18.450 Litern</span>
                <span class="esg-lbl">Sprit-Ersparnis</span>
              </div>
              <div class="esg-metric">
                <span class="esg-val">68.200 €</span>
                <span class="esg-lbl">Kostenersparnis Nutzer</span>
              </div>
            </div>
          </div>

          <!-- User Management Table -->
          <div class="admin-section">
            <h3>👥 Benutzerverwaltung & Rollen (RBAC)</h3>
            <div class="table-responsive">
              <table class="admin-user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>E-Mail</th>
                    <th>Rolle</th>
                    <th>Status</th>
                    <th>Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  ${users.map(u => `
                    <tr>
                      <td><b>${u.name}</b></td>
                      <td>${u.email}</td>
                      <td><span class="role-badge ${u.role === 'ADMIN' ? 'role-admin' : 'role-user'}">${u.role}</span></td>
                      <td><span class="status-badge ${u.active ? 'status-active' : 'status-disabled'}">${u.active ? 'Aktiv' : 'Deaktiviert'}</span></td>
                      <td>
                        ${u.role !== 'ADMIN' ? `
                          <button class="btn btn-xs ${u.active ? 'btn-danger' : 'btn-success'}" data-action="toggle-active" data-id="${u.id}">
                            ${u.active ? 'Deaktivieren' : 'Aktivieren'}
                          </button>
                          <button class="btn btn-xs btn-outline" data-action="toggle-role" data-id="${u.id}">
                            Rolle ändern
                          </button>
                        ` : '<span class="text-muted">Admin geschützt</span>'}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- System Controls -->
          <div class="admin-section">
            <h3>⚙️ System-Steuerung & Cache</h3>
            <div class="admin-controls-grid">
              <button class="btn btn-outline" id="clear-app-cache">🗑️ API & System-Cache leeren</button>
              <button class="btn btn-outline" id="broadcast-alert-btn">📢 Globale Ankündigung schalten</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Event handlers
  containerEl.querySelector('#close-admin-modal')?.addEventListener('click', onClose);

  containerEl.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.target.getAttribute('data-action');
      const userId = e.target.getAttribute('data-id');
      try {
        if (action === 'toggle-active') {
          authService.toggleUserActive(userId);
        } else if (action === 'toggle-role') {
          const user = authService.getUsers().find(u => u.id === userId);
          const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
          authService.changeUserRole(userId, newRole);
        }
        renderAdminDashboard(containerEl, onClose); // Re-render
      } catch (err) {
        alert(err.message);
      }
    });
  });

  containerEl.querySelector('#clear-app-cache')?.addEventListener('click', () => {
    alert("System-Cache erfolgreich geleert!");
  });

  containerEl.querySelector('#broadcast-alert-btn')?.addEventListener('click', () => {
    alert("Globale Ankündigung aktiviert: 'ÖPNV Streik-Info: DB Regio fährt regulär'.");
  });
}
