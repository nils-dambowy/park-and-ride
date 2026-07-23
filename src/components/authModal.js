import { authService } from '../services/authService.js';

export function renderAuthModal(containerEl, onClose, onLoginSuccess) {
  if (!containerEl) return;

  let isRegisterMode = false;

  function updateView() {
    containerEl.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-box auth-modal-box glass-panel">
          <div class="modal-header">
            <h2>${isRegisterMode ? '📝 Benutzerkonto registrieren' : '🔑 Anmelden'}</h2>
            <button class="close-btn" id="close-auth-modal">✕</button>
          </div>

          <div class="modal-body">
            <div class="demo-accounts-banner">
              <b>⚡ Schnell-Test Zugänge:</b><br>
              👑 Admin: <code>admin@park-ride.de</code> | Passwort: <code>Admin123!</code><br>
              👤 User: <code>user@park-ride.de</code> | Passwort: <code>User123!</code>
            </div>

            <form id="auth-form" class="auth-form">
              ${isRegisterMode ? `
                <div class="form-group">
                  <label>Vollständiger Name</label>
                  <input type="text" id="auth-name" class="form-control" placeholder="Max Mustermann" required />
                </div>
              ` : ''}

              <div class="form-group">
                <label>E-Mail-Adresse</label>
                <input type="email" id="auth-email" class="form-control" placeholder="ihre.email@beispiel.de" required />
              </div>

              <div class="form-group">
                <label>Passwort</label>
                <input type="password" id="auth-password" class="form-control" placeholder="••••••••" required />
              </div>

              <div id="auth-error-msg" class="auth-error text-red"></div>

              <button type="submit" class="btn btn-primary btn-block">
                ${isRegisterMode ? 'Konto erstellen' : 'Anmelden'}
              </button>
            </form>

            <div class="auth-toggle-link">
              <a href="#" id="toggle-auth-mode">
                ${isRegisterMode ? 'Bereits ein Konto? Hier anmelden' : 'Noch kein Konto? Jetzt registrieren'}
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind events
    containerEl.querySelector('#close-auth-modal')?.addEventListener('click', onClose);

    containerEl.querySelector('#toggle-auth-mode')?.addEventListener('click', (e) => {
      e.preventDefault();
      isRegisterMode = !isRegisterMode;
      updateView();
    });

    containerEl.querySelector('#auth-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = containerEl.querySelector('#auth-email').value;
      const password = containerEl.querySelector('#auth-password').value;
      const errorDiv = containerEl.querySelector('#auth-error-msg');
      errorDiv.textContent = '';

      try {
        let user;
        if (isRegisterMode) {
          const name = containerEl.querySelector('#auth-name').value;
          user = await authService.register(name, email, password);
        } else {
          user = await authService.login(email, password);
        }
        if (onLoginSuccess) onLoginSuccess(user);
        onClose();
      } catch (err) {
        errorDiv.textContent = err.message;
      }
    });
  }

  updateView();
}
