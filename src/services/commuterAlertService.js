/**
 * Commuter Alert & Departure Reminder Service
 * Simulates real-time morning traffic checks & delays for saved routes
 */

export class CommuterAlertService {
  checkRouteAlerts(savedRoutes) {
    const alerts = [];
    if (!savedRoutes || savedRoutes.length === 0) return alerts;

    // Check saved routes against simulated traffic/delay conditions
    savedRoutes.forEach(route => {
      if (!route.commuterAlert) return;

      // Deterministic simulation based on route id hash
      const randomTrafficDelay = (route.id.length % 3 === 0) ? 18 : 0;
      
      if (randomTrafficDelay > 10) {
        alerts.push({
          id: `alert_${route.id}`,
          routeTitle: route.title,
          delayMinutes: randomTrafficDelay,
          severity: "HIGH",
          message: `Stau-Warnung für "${route.title}": +${randomTrafficDelay} Min. Verzögerung auf der Autobahn zur P+R Station ${route.hubName}. Wir empfehlen heute B+R (Fahrrad) oder 15 Min. frühere Abfahrt!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    });

    return alerts;
  }
}

export const commuterAlertService = new CommuterAlertService();
