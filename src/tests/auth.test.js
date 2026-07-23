import { authService } from '../services/authService.js';

export async function runAuthTests() {
  const results = [];
  
  // Test 1: Seed Users Login
  try {
    const admin = await authService.login("admin@park-ride.de", "Admin123!");
    const pass = admin && admin.role === "ADMIN";
    results.push({ name: "Auth: Admin Login & RBAC Role", success: pass, details: pass ? "OK (Admin Role verified)" : "Failed" });
    authService.logout();
  } catch (err) {
    results.push({ name: "Auth: Admin Login & RBAC Role", success: false, details: err.message });
  }

  // Test 2: User Login
  try {
    const user = await authService.login("user@park-ride.de", "User123!");
    const pass = user && user.role === "USER";
    results.push({ name: "Auth: Regular User Login", success: pass, details: pass ? "OK (User Role verified)" : "Failed" });
    authService.logout();
  } catch (err) {
    results.push({ name: "Auth: Regular User Login", success: false, details: err.message });
  }

  return results;
}
