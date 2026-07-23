/**
 * Leaflet Map Component Manager (Clean bahn.de Light Tiles)
 * Renders smooth polylines matching exact GPS coordinates (Origin -> Hub -> DestHub -> Dest)
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

  initMap(center = [49.9000, 8.5000], zoom = 10) {
    if (!window.L) return;

    this.map = L.map(this.elementId, {
      zoomControl: false
    }).setView(center, zoom);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Official Clean Light Map Tiles by CartoDB (Voyager)
    this.tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
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

    const hubLat = routeData.hubCoords.lat;
    const hubLng = routeData.hubCoords.lng;
    const destHubLat = routeData.destHubCoords.lat;
    const destHubLng = routeData.destHubCoords.lng;

    // 1. Render First Mile Polyline (Starts EXACTLY at originCoords!)
    const firstMileCoords = routeData.firstMile.geometry && routeData.firstMile.geometry.length > 0 
      ? routeData.firstMile.geometry 
      : [
          [originCoords.lat, originCoords.lng],
          [hubLat, hubLng]
        ];

    // Ensure first point connects to originCoords
    firstMileCoords[0] = [originCoords.lat, originCoords.lng];
    firstMileCoords[firstMileCoords.length - 1] = [hubLat, hubLng];

    const firstMileColor = routeData.firstMile.mode === 'car' ? '#0284c7' : routeData.firstMile.mode === 'bike' ? '#16a34a' : '#64748b';
    
    L.polyline(firstMileCoords, {
      color: firstMileColor,
      weight: 6,
      opacity: 0.9,
      dashArray: routeData.firstMile.mode === 'walk' ? '6, 6' : null
    }).addTo(this.polylinesGroup);

    // Live Traffic overlay if car
    if (routeData.firstMile.mode === 'car' && this.showTraffic && routeData.firstMile.trafficData?.delayMinutes > 0) {
      L.polyline(firstMileCoords, {
        color: '#dc2626',
        weight: 10,
        opacity: 0.35
      }).addTo(this.trafficLayerGroup);
    }

    // 2. Render Main ÖPNV Transit Leg Polyline (DB Crimson Red #ec1c24)
    const transitPolyline = [
      [hubLat, hubLng],
      [destHubLat, destHubLng]
    ];
    L.polyline(transitPolyline, {
      color: '#ec1c24',
      weight: 7,
      opacity: 0.95
    }).addTo(this.polylinesGroup);

    // 3. Render Last Mile Polyline (Dash Line)
    const lastMileCoords = [
      [destHubLat, destHubLng],
      [destCoords.lat, destCoords.lng]
    ];
    L.polyline(lastMileCoords, {
      color: '#64748b',
      weight: 5,
      opacity: 0.8,
      dashArray: '6, 6'
    }).addTo(this.polylinesGroup);

    // 4. Custom Clean Map Markers
    // Start Marker
    const originIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `<div class="map-marker-pin origin-pin">📍 Start</div>`,
      iconSize: [60, 26],
      iconAnchor: [30, 26]
    });
    L.marker([originCoords.lat, originCoords.lng], { icon: originIcon })
      .bindPopup(`<b>Startstandort</b><br>${routeData.startAddress}`)
      .addTo(this.markersGroup);

    // P+R / B+R Hub Marker
    const hubBadge = routeData.firstMile.mode === 'car' ? 'P+R' : routeData.firstMile.mode === 'bike' ? 'B+R' : 'Knoten';
    const hubIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `<div class="map-marker-pin hub-pin">🚉 ${hubBadge} ${routeData.hubName.split(' ')[0]}</div>`,
      iconSize: [110, 26],
      iconAnchor: [55, 26]
    });
    L.marker([hubLat, hubLng], { icon: hubIcon })
      .bindPopup(`<b>${routeData.hubName}</b><br>${routeData.hubAddress}`)
      .addTo(this.markersGroup);

    // Ziel Marker
    const destIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `<div class="map-marker-pin dest-pin">🏁 Ziel</div>`,
      iconSize: [50, 26],
      iconAnchor: [25, 26]
    });
    L.marker([destCoords.lat, destCoords.lng], { icon: destIcon })
      .bindPopup(`<b>Zielort</b><br>${routeData.destAddress}`)
      .addTo(this.markersGroup);

    // Fit map bounds cleanly to include all points
    const bounds = L.latLngBounds([
      [originCoords.lat, originCoords.lng],
      [hubLat, hubLng],
      [destHubLat, destHubLng],
      [destCoords.lat, destCoords.lng]
    ]);
    this.map.fitBounds(bounds, { padding: [50, 50] });
  }

  toggleTraffic(show) {
    this.showTraffic = show;
    if (!show) {
      this.trafficLayerGroup.clearLayers();
    }
  }

  toggleHighContrast(enabled) {
    this.highContrast = enabled;
  }
}
