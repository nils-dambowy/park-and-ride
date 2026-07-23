/**
 * Nominatim OpenStreetMap Geocoding API
 * Worldwide address lookup & autocomplete with caching
 */

const CACHE = new Map();

export class NominatimApi {
  async searchLocations(query) {
    if (!query || query.trim().length < 2) return [];
    
    const cacheKey = query.trim().toLowerCase();
    if (CACHE.has(cacheKey)) {
      return CACHE.get(cacheKey);
    }

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&accept-language=de,en`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'ParkAndRideCalculator/1.0 (contact@park-and-ride.app)'
        }
      });

      if (!response.ok) throw new Error(`Geocoding response error: ${response.status}`);
      const data = await response.json();

      const results = data.map(item => ({
        displayName: item.display_name,
        shortName: item.address.city || item.address.town || item.address.village || item.name || item.display_name.split(',')[0],
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        countryCode: (item.address.country_code || 'de').toUpperCase()
      }));

      CACHE.set(cacheKey, results);
      return results;
    } catch (error) {
      console.warn("Nominatim Geocoding API fetch failed, using fallback preset matching:", error);
      return [];
    }
  }

  async reverseGeocode(lat, lng) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=de,en`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'ParkAndRideCalculator/1.0'
        }
      });
      if (!response.ok) throw new Error("Reverse geocode failed");
      const data = await response.json();
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }
}

export const nominatimApi = new NominatimApi();
