/**
 * Persistent Storage Service
 * Stores favorite routes, commuter alert schedules, and user preferences
 */

const STORAGE_ROUTES_KEY = "pr_app_saved_routes_v1";

export class StorageService {
  getSavedRoutes(userId) {
    if (!userId) return [];
    try {
      const allRoutes = JSON.parse(localStorage.getItem(STORAGE_ROUTES_KEY)) || [];
      return allRoutes.filter(r => r.userId === userId);
    } catch {
      return [];
    }
  }

  saveRoute(userId, routeData) {
    if (!userId) throw new Error("Sie müssen angemeldet sein, um Routen zu speichern.");
    const allRoutes = this.getAllRoutes();
    
    const newRoute = {
      id: `route_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId,
      title: routeData.title || `${routeData.originName} → ${routeData.destinationName}`,
      originName: routeData.originName,
      originCoords: routeData.originCoords,
      destinationName: routeData.destinationName,
      destinationCoords: routeData.destinationCoords,
      modePreference: routeData.modePreference,
      hubName: routeData.hubName,
      totalDuration: routeData.totalDuration,
      co2SavingsKg: routeData.co2SavingsKg,
      commuterAlert: true, // Enable morning alert by default
      savedAt: new Date().toISOString()
    };

    allRoutes.push(newRoute);
    localStorage.setItem(STORAGE_ROUTES_KEY, JSON.stringify(allRoutes));
    return newRoute;
  }

  deleteSavedRoute(userId, routeId) {
    let allRoutes = this.getAllRoutes();
    allRoutes = allRoutes.filter(r => !(r.userId === userId && r.id === routeId));
    localStorage.setItem(STORAGE_ROUTES_KEY, JSON.stringify(allRoutes));
  }

  toggleCommuterAlert(userId, routeId) {
    const allRoutes = this.getAllRoutes();
    const route = allRoutes.find(r => r.userId === userId && r.id === routeId);
    if (route) {
      route.commuterAlert = !route.commuterAlert;
      localStorage.setItem(STORAGE_ROUTES_KEY, JSON.stringify(allRoutes));
    }
  }

  getAllRoutes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_ROUTES_KEY)) || [];
    } catch {
      return [];
    }
  }
}

export const storageService = new StorageService();
