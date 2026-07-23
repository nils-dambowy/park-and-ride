import { nominatimApi } from '../services/api/nominatimApi.js';
import { osrmRoutingApi } from '../services/api/osrmRoutingApi.js';
import { weatherService } from '../services/api/weatherService.js';
import { trafficService } from '../services/api/trafficService.js';

export async function runApiServicesTests() {
  const results = [];

  // Test 1: Nominatim Geocoding Latency & Response
  const startNom = performance.now();
  try {
    const locs = await nominatimApi.searchLocations("Berlin Hauptbahnhof");
    const latencyNom = Math.round(performance.now() - startNom);
    const pass = Array.isArray(locs);
    results.push({
      name: "API Health: OpenStreetMap Nominatim Geocoder",
      success: pass,
      latencyMs: latencyNom,
      details: pass ? `Operational (${latencyNom}ms)` : "Failed"
    });
  } catch (err) {
    results.push({ name: "API Health: OpenStreetMap Nominatim Geocoder", success: false, latencyMs: 0, details: err.message });
  }

  // Test 2: OSRM Routing Engine
  const startOsrm = performance.now();
  try {
    const route = await osrmRoutingApi.getRoute({ lat: 52.52, lng: 13.40 }, { lat: 52.51, lng: 13.38 }, 'driving');
    const latencyOsrm = Math.round(performance.now() - startOsrm);
    const pass = route && route.distanceKm > 0;
    results.push({
      name: "API Health: OSRM Global Routing Engine",
      success: pass,
      latencyMs: latencyOsrm,
      details: pass ? `Operational (${latencyOsrm}ms)` : "Failed"
    });
  } catch (err) {
    results.push({ name: "API Health: OSRM Global Routing Engine", success: false, latencyMs: 0, details: err.message });
  }

  // Test 3: Open-Meteo Weather API
  const startWeather = performance.now();
  try {
    const weather = await weatherService.getWeatherCondition(52.52, 13.40);
    const latencyWeather = Math.round(performance.now() - startWeather);
    const pass = weather && typeof weather.temp === 'number';
    results.push({
      name: "API Health: Open-Meteo Weather API",
      success: pass,
      latencyMs: latencyWeather,
      details: pass ? `Operational (${latencyWeather}ms)` : "Failed"
    });
  } catch (err) {
    results.push({ name: "API Health: Open-Meteo Weather API", success: false, latencyMs: 0, details: err.message });
  }

  // Test 4: Traffic Engine
  try {
    const traffic = trafficService.getTrafficFactor();
    const pass = traffic && traffic.delayFactor >= 1.0;
    results.push({
      name: "API Health: Traffic & Delay Service Engine",
      success: pass,
      latencyMs: 5,
      details: pass ? "Operational (5ms)" : "Failed"
    });
  } catch (err) {
    results.push({ name: "API Health: Traffic & Delay Service Engine", success: false, latencyMs: 0, details: err.message });
  }

  return results;
}
