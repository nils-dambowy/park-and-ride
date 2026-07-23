import { intermodalEngine } from '../services/intermodalEngine.js';

export async function runRoutingEngineTests() {
  const results = [];

  // Test 1: Intermodal Rule Enforcement
  try {
    const route = await intermodalEngine.calculateIntermodalRoute({
      originCoords: { lat: 52.3920, lng: 12.9810 },
      originName: "Potsdam",
      destCoords: { lat: 52.5219, lng: 13.4132 },
      destName: "Berlin Alexanderplatz",
      modePreference: "car_pt"
    });

    const isIntermodalValid = route.isIntermodal && route.firstMile && route.transitLeg && route.lastMile;
    results.push({
      name: "Routing Engine: Strict Intermodal Combination Enforcement",
      success: isIntermodalValid,
      details: isIntermodalValid ? "OK (Valid 1st mile + Transit + Last mile)" : "Failed"
    });

    // Test 2: Buffer Time Enforcement (+5 min for Car, +2 min for Bike)
    const carBufferPass = route.firstMile.bufferMin === 5;
    results.push({
      name: "Routing Engine: Car Parking Buffer (+5 min)",
      success: carBufferPass,
      details: carBufferPass ? "OK (+5 min applied)" : `Failed (got ${route.firstMile.bufferMin})`
    });

    // Test 3: Bike Lock Buffer (+2 min)
    const bikeRoute = await intermodalEngine.calculateIntermodalRoute({
      originCoords: { lat: 52.3920, lng: 12.9810 },
      originName: "Potsdam",
      destCoords: { lat: 52.5219, lng: 13.4132 },
      destName: "Berlin",
      modePreference: "bike_pt"
    });

    const bikeBufferPass = bikeRoute.firstMile.bufferMin === 2;
    results.push({
      name: "Routing Engine: Bike Lock Buffer (+2 min)",
      success: bikeBufferPass,
      details: bikeBufferPass ? "OK (+2 min applied)" : `Failed (got ${bikeRoute.firstMile.bufferMin})`
    });

  } catch (err) {
    results.push({
      name: "Routing Engine: Calculations Test",
      success: false,
      details: err.message
    });
  }

  return results;
}
