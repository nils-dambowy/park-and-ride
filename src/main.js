import { MapManager } from './components/mapManager.js';
import { intermodalEngine } from './services/intermodalEngine.js';
import { EUROPEAN_PRESETS } from './services/europeanPresets.js';
import { setupAutocomplete } from './components/autocomplete.js';
import { setupVoiceSearch } from './components/voiceSearch.js';
import { renderOverviewDashboard } from './components/overviewDashboard.js';
import { renderComparisonCards } from './components/comparisonCards.js';
import { renderTimeline } from './components/timelineRenderer.js';
import { renderDepartureBoard } from './components/departureBoard.js';
import { renderStatusPageModal } from './components/statusPageModal.js';
import { renderAdminDashboard } from './components/adminDashboard.js';
import { renderAuthModal } from './components/authModal.js';
import { renderSavedRoutesDrawer } from './components/savedRoutesDrawer.js';
import { renderCostCalculatorModal } from './components/costCalculatorModal.js';
import { authService } from './services/authService.js';
import { storageService } from './services/storageService.js';
import { downloadCalendarEvent } from './utils/calendarExport.js';

class App {
  constructor() {
    this.mapManager = new MapManager('leaflet-map-container');
    this.currentRoute = null;
    this.originCoords = { lat: 49.8550, lng: 8.7520 }; // Default Roßdorf b. Darmstadt
    this.destCoords = { lat: 50.0010, lng: 8.2590 };  // Default Mainz Hbf
    this.selectedMode = 'smart';
  }

  init() {
    // 1. Initialize Leaflet Map
    this.mapManager.initMap([49.9000, 8.5000], 10);

    // 2. INSTANT 0ms RENDERING ON PAGE LOAD
    this.loadInstantDefaultRoute();

    // 3. Setup Autocomplete & Voice Search
    setupAutocomplete(
      document.getElementById('origin-input'),
      document.getElementById('origin-autocomplete'),
      (loc) => { this.originCoords = loc.coords; }
    );

    setupAutocomplete(
      document.getElementById('dest-input'),
      document.getElementById('dest-autocomplete'),
      (loc) => { this.destCoords = loc.coords; }
    );

    setupVoiceSearch(
      document.getElementById('voice-search-btn'),
      document.getElementById('origin-input')
    );

    // 4. Render Presets & Event Handlers
    this.renderPresets();
    this.bindEvents();
    this.updateAuthHeader();

    // 5. Background Silent API Refresh (Non-blocking)
    setTimeout(() => {
      this.executeRouting(
        document.getElementById('origin-input').value,
        document.getElementById('dest-input').value,
        true // silent background refresh
      );
    }, 150);
  }

  loadInstantDefaultRoute() {
    const defaultOrigin = "36, Thomas-Mann-Straße, 64380 Roßdorf";
    const defaultDest = "Mainz Hbf, Bahnhofplatz 1, 55116 Mainz";
    
    document.getElementById('origin-input').value = defaultOrigin;
    document.getElementById('dest-input').value = defaultDest;

    // 0ms Instant Pre-calculated Route
    this.currentRoute = intermodalEngine.getInstantInitialRoute(this.selectedMode);
    this.renderAllViews();
  }

  renderAllViews() {
    if (!this.currentRoute) return;
    this.mapManager.renderRoute(this.currentRoute, this.originCoords, this.destCoords);
    renderOverviewDashboard(this.currentRoute, document.getElementById('overview-dashboard'));
    renderComparisonCards(
      this.currentRoute,
      document.getElementById('comparison-cards'),
      (newMode) => {
        this.selectedMode = newMode;
        this.recalculateInstant();
      }
    );
    renderTimeline(this.currentRoute, document.getElementById('timeline-section'));
    renderDepartureBoard(this.currentRoute.hubName, document.getElementById('departure-board-section'));
  }

  recalculateInstant() {
    this.currentRoute = intermodalEngine.getInstantInitialRoute(this.selectedMode);
    this.renderAllViews();
  }

  renderPresets() {
    const container = document.getElementById('presets-container');
    if (!container) return;

    container.innerHTML = EUROPEAN_PRESETS.map(p => `
      <button type="button" class="preset-chip" data-id="${p.id}">
        ${p.label}
      </button>
    `).join('');

    container.querySelectorAll('.preset-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const presetId = btn.getAttribute('data-id');
        const preset = EUROPEAN_PRESETS.find(p => p.id === presetId);
        if (preset) {
          document.getElementById('origin-input').value = preset.originName;
          document.getElementById('dest-input').value = preset.destinationName;
          this.originCoords = preset.originCoords;
          this.destCoords = preset.destinationCoords;
          this.executeRouting(preset.originName, preset.destinationName);
        }
      });
    });
  }

  bindEvents() {
    // Mode Segmented Buttons
    const modeBtns = document.querySelectorAll('#mode-selector .mode-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedMode = btn.getAttribute('data-mode');
        this.recalculateInstant();
      });
    });

    // Form Submit
    document.getElementById('route-planner-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const originName = document.getElementById('origin-input').value;
      const destName = document.getElementById('dest-input').value;
      this.executeRouting(originName, destName);
    });

    // Traffic Toggle
    document.getElementById('traffic-toggle')?.addEventListener('change', (e) => {
      this.mapManager.toggleTraffic(e.target.checked);
      this.recalculateInstant();
    });

    // Outdoor Mode Toggle
    document.getElementById('toggle-outdoor-mode')?.addEventListener('click', () => {
      const isHigh = !this.mapManager.highContrast;
      this.mapManager.toggleHighContrast(isHigh);
    });

    // Direct Header Status Page Trigger
    document.getElementById('header-status-page-btn')?.addEventListener('click', () => {
      this.openStatusModal();
    });

    // Direct Header Admin Dashboard Trigger
    document.getElementById('header-admin-direct-btn')?.addEventListener('click', () => {
      this.openAdminModal();
    });

    // Status Page Trigger from Footer
    document.getElementById('footer-system-status')?.addEventListener('click', () => {
      this.openStatusModal();
    });

    // Saved Routes Drawer Trigger
    document.getElementById('open-saved-routes')?.addEventListener('click', () => {
      renderSavedRoutesDrawer(
        document.getElementById('drawer-container'),
        () => { document.getElementById('drawer-container').innerHTML = ''; },
        (route) => {
          this.originCoords = route.originCoords;
          this.destCoords = route.destinationCoords;
          document.getElementById('origin-input').value = route.originName;
          document.getElementById('dest-input').value = route.destinationName;
          this.executeRouting(route.originName, route.destinationName);
        }
      );
    });

    // Cost Calculator Modal Trigger
    document.getElementById('open-cost-modal')?.addEventListener('click', () => {
      if (!this.currentRoute) return;
      renderCostCalculatorModal(
        this.currentRoute,
        document.getElementById('modal-container'),
        () => { document.getElementById('modal-container').innerHTML = ''; }
      );
    });

    // Save Route Button
    document.getElementById('save-route-btn')?.addEventListener('click', () => {
      const user = authService.getCurrentUser();
      if (!user) {
        this.openAuthModal();
        return;
      }
      if (!this.currentRoute) return;
      storageService.saveRoute(user.id, {
        originName: document.getElementById('origin-input').value,
        originCoords: this.originCoords,
        destinationName: document.getElementById('dest-input').value,
        destinationCoords: this.destCoords,
        modePreference: this.selectedMode,
        hubName: this.currentRoute.hubName,
        totalDuration: this.currentRoute.totalDurationMinutes,
        co2SavingsKg: this.currentRoute.metrics.co2SavingsKg
      });
      alert("⭐ Route erfolgreich gespeichert!");
    });

    // Export Calendar Event
    document.getElementById('export-calendar-btn')?.addEventListener('click', () => {
      if (this.currentRoute) {
        downloadCalendarEvent(this.currentRoute);
      }
    });
  }

  async executeRouting(originName, destName, isSilentBackground = false) {
    const calcBtn = document.getElementById('calculate-btn');
    const loadingBanner = document.getElementById('global-loading-banner');
    
    if (!isSilentBackground) {
      if (calcBtn) {
        calcBtn.disabled = true;
        calcBtn.innerHTML = `⌛ Route wird berechnet...`;
      }
      if (loadingBanner) {
        loadingBanner.style.display = 'flex';
      }
    }

    try {
      const freshRoute = await intermodalEngine.calculateIntermodalRoute({
        originCoords: this.originCoords,
        originName,
        destCoords: this.destCoords,
        destName,
        modePreference: this.selectedMode
      });

      this.currentRoute = freshRoute;
      this.renderAllViews();

    } catch (err) {
      console.error("Routing error:", err);
    } finally {
      if (!isSilentBackground) {
        if (calcBtn) {
          calcBtn.disabled = false;
          calcBtn.innerHTML = `🔍 Intermodale Route berechnen`;
        }
        if (loadingBanner) {
          loadingBanner.style.display = 'none';
        }
      }
    }
  }

  openStatusModal() {
    renderStatusPageModal(document.getElementById('modal-container'), () => {
      document.getElementById('modal-container').innerHTML = '';
    });
  }

  openAdminModal() {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      alert("🔒 Zugriff geschützt: Bitte melden Sie sich als Administrator (admin@park-ride.de) an.");
      this.openAuthModal();
      return;
    }

    renderAdminDashboard(document.getElementById('modal-container'), () => {
      document.getElementById('modal-container').innerHTML = '';
    });
  }

  updateAuthHeader() {
    const container = document.getElementById('auth-header-btn-container');
    if (!container) return;

    const user = authService.getCurrentUser();
    if (user) {
      container.innerHTML = `
        <div style="display: flex; gap: 8px; align-items: center;">
          <span style="font-size: 0.85rem; font-weight: 600;">👤 ${user.name}</span>
          <button class="btn btn-xs btn-outline" id="header-logout-btn">Abmelden</button>
        </div>
      `;

      container.querySelector('#header-logout-btn')?.addEventListener('click', () => {
        authService.logout();
        this.updateAuthHeader();
      });
    } else {
      container.innerHTML = `
        <button class="btn btn-primary btn-sm" id="header-login-btn">🔑 Anmelden</button>
      `;
      container.querySelector('#header-login-btn')?.addEventListener('click', () => {
        this.openAuthModal();
      });
    }
  }

  openAuthModal() {
    renderAuthModal(
      document.getElementById('modal-container'),
      () => { document.getElementById('modal-container').innerHTML = ''; },
      () => { this.updateAuthHeader(); }
    );
  }
}

// Initialize Application when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
