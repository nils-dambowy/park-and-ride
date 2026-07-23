/**
 * Leaflet Map Component Manager
 * Handles multi-colored polylines (Blue=Car, Green=Bike, Purple=ÖPNV, Gray=Walk),
 * custom SVG markers for Origin, P+R/B+R Hub, Transit Hub, Destination,
 * live traffic congestion overlays, and high-contrast outdoor mode!
 */

export class MapManager {
  constructor(elementId) {
    this.elementId = elementId;
    this.map = null;
    this.markersGroup = null;
    this.polylinesGroup = null;
    this.trafficLayerGroup = null;
    this.showTraffic = true;
    this.highContrast = false;
  }

  initMap(center = [52.5200, 13.4050], zoom = 11) {
    if (!window.L) return;

    this.map = L.map(this.elementId, {
      zoomControl: false
    }).setView(center, zoom);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Dark Mode Tiles by CartoDB
    this.tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);

    this.markersGroup = L.layerGroup().addTo(this.map);
    this.polylinesGroup = L.layerGroup().addTo(this.map);
    this.trafficLayerGroup = L.layerGroup().addTo(this.map);
  }

  renderRoute(routeData, originCoords, destCoords) {
    if (!this.map || !window.L) return;

    this.markersGroup.clearLayers();
    this.polylinesGroup.clearLayers();
    this.trafficLayerGroup.clearLayers();

    // 1. Render First Mile Polyline (Blue for Car, Green for Bike, Gray for Walk)
    const firstMileColor = routeData.firstMile.mode === 'car' ? '#3b82f6' : routeData.firstMile.mode === 'bike' ? '#10b981' : '#9ca3af';
    
    if (routeData.firstMile.geometry) {
      const firstPoly = L.polyline(routeData.firstMile.geometry, {
        color: firstMileColor,
        weight: 6,
        opacity: 0.9,
        dashArray: routeData.firstMile.mode === 'walk' ? '8, 8' : null
      }).addTo(this.polylinesGroup);

      // Render Traffic Congestion overlay if car and traffic active
      if (routeData.firstMile.mode === 'car' && this.showTraffic && routeData.firstMile.trafficData.delayMinutes > 0) {
        L.polyline(routeData.firstMile.geometry, {
          color: '#ef4444',
          weight: 10,
          opacity: 0.4
        }).addTo(this.trafficLayerGroup);
      }
    }

    // 2. Render Main Transit Leg Polyline (Purple #8b5cf6)
    const transitPolyline = [
      [routeData.hubCoords.lat, routeData.hubCoords.lng],
      [routeData.destHubCoords.lat, routeData.destHubCoords.lng]
    ];
    L.polyline(transitPolyline, {
      color: '#8b5cf6',
      weight: 6,
      opacity: 0.95
    }).addTo(this.polylinesGroup);

    // 3. Render Last Mile Polyline (Gray #9ca3af)
    if (routeData.lastMile.geometry) {
      L.polyline(routeData.lastMile.geometry, {
        color: '#9ca3af',
        weight: 5,
        opacity: 0.8,
        dashArray: '6, 6'
      }).addTo(this.polylinesGroup);
    }

    // 4. Custom SVG Markers
    // Origin Marker
    const originIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `<div class="map-marker-pin origin-pin"><span class="pin-icon">📍</span><span class="pin-label">Start</span></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
    L.marker([originCoords.lat, originCoords.lng], { icon: originIcon })
      .bindPopup(`<b>Startstandort</b><br>${routeData.firstMile.modeBadge}`)
      .addTo(this.markersGroup);

    // P+R / B+R Hub Marker
    const hubBadge = routeData.firstMile.mode === 'car' ? 'P+R' : routeData.firstMile.mode === 'bike' ? 'B+R' : 'Knoten';
    const hubIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `<div class="map-marker-pin hub-pin"><span class="pin-icon">🚉</span><span class="pin-label">${hubBadge}</span></div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 44]
    });
    L.marker([routeData.hubCoords.lat, routeData.hubCoords.lng], { icon: hubIcon })
      .bindPopup(`<b>${routeData.hubName}</b><br>Knotenpunkt | ${routeData.firstMile.bufferLabel}`)
      .addTo(this.markersGroup);

    // Destination Marker
    const destIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `<div class="map-marker-pin dest-pin"><span class="pin-icon">🏁</span><span class="pin-label">Ziel</span></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
    L.marker([destCoords.lat, destCoords.lng], { icon: destIcon })
      .bindPopup(`<b>Zielort</b>`)
      .addTo(this.markersGroup);

    // Fit map bounds to show entire route
    const allCoords = [
      [originCoords.lat, originCoords.lng],
      [routeData.hubCoords.lat, routeData.hubCoords.lng],
      [routeData.destHubCoords.lat, routeData.destHubCoords.lng],
      [destCoords.lat, destCoords.lng]
    ];
    this.map.fitBounds(allCoords, { padding: [60, 60] });
  }

  toggleTraffic(show) {
    this.showTraffic = show;
    if (!show) {
      this.trafficLayerGroup.clearLayers();
    }
  }

  toggleHighContrast(enabled) {
    this.highContrast = enabled;
    const container = document.getElementById(this.elementId);
    if (container) {
      if (enabled) {
        container.classList.add('outdoor-high-contrast');
      } else {
        container.classList.remove('outdoor-high-contrast');
      }
    }
  }
}
