/**
 * Open-Meteo Weather API Integration
 * Fetches live weather conditions to issue rain warnings for Bike & Ride
 */

export class WeatherService {
  async getWeatherCondition(lat, lng) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Weather API failed");
      const data = await response.json();
      
      const code = data.current_weather.weathercode;
      const temp = Math.round(data.current_weather.temperature);
      
      // Weather code interpretation (WMO standard)
      const isRainy = (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
      const isSnowy = (code >= 71 && code <= 77) || (code >= 85 && code <= 86);

      return {
        temp,
        code,
        isRainy,
        isSnowy,
        summary: isRainy ? "Leichter bis mäßiger Regen" : isSnowy ? "Schneefall" : "Trocken / Sonnig bis bewölkt",
        bikeWarning: isRainy 
          ? "🌧️ Regenrisiko! Fahrrad-Überdachung am B+R Bahnhof oder P+R Auto empfohlen." 
          : isSnowy ? "❄️ Glättegefahr! B+R nur mit Winterschutz." 
          : "☀️ Optimales Wetter für Bike & Ride!"
      };
    } catch {
      // Fallback
      return {
        temp: 18,
        code: 0,
        isRainy: false,
        isSnowy: false,
        summary: "Trocken (Angenehm)",
        bikeWarning: "☀️ Gute Bedingungen für Bike & Ride!"
      };
    }
  }
}

export const weatherService = new WeatherService();
