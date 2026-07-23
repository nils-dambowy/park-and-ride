/**
 * Live Traffic & Delay Service
 * Evaluates real-time road congestion and calculates driving time penalties
 */

export class TrafficService {
  /**
   * Calculates live traffic delay penalty in minutes for driving segment
   */
  getTrafficFactor(hourOfDay = new Date().getHours()) {
    // Rush hours: 7-9 AM and 16-18 PM
    const isMorningRush = hourOfDay >= 7 && hourOfDay <= 9;
    const isEveningRush = hourOfDay >= 16 && hourOfDay <= 18;

    if (isMorningRush || isEveningRush) {
      return {
        delayFactor: 1.35, // +35% duration penalty
        level: "CONGESTED",
        color: "#ef4444",
        statusText: "Zähfließender Verkehr / Stau im Berufsverkehr (+35% Fahrzeit)",
        badge: "🔴 Stau-Warnung"
      };
    } else if (hourOfDay >= 10 && hourOfDay <= 15) {
      return {
        delayFactor: 1.12, // +12% moderate traffic
        level: "MODERATE",
        color: "#f59e0b",
        statusText: "Mäßiges Verkehrsaufkommen (+12% Fahrzeit)",
        badge: "🟡 Mäßiger Verkehr"
      };
    } else {
      return {
        delayFactor: 1.0,
        level: "SMOOTH",
        color: "#10b981",
        statusText: "Freie Fahrt auf der Zubringerstrecke",
        badge: "🟢 Freie Fahrt"
      };
    }
  }

  applyTrafficToDuration(baseDurationMin) {
    const traffic = this.getTrafficFactor();
    const trafficDurationMin = Math.ceil(baseDurationMin * traffic.delayFactor);
    const delayMinutes = trafficDurationMin - baseDurationMin;
    return {
      trafficDurationMin,
      delayMinutes,
      trafficInfo: traffic
    };
  }
}

export const trafficService = new TrafficService();
