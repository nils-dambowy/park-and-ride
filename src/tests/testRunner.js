/**
 * Master Test Execution Engine
 * Runs all unit, RBAC, and API diagnostic tests for the status & diagnostics modals
 */

import { runAuthTests } from './auth.test.js';
import { runRoutingEngineTests } from './routingEngine.test.js';
import { runApiServicesTests } from './apiServices.test.js';

export async function runAllDiagnostics() {
  const authResults = await runAuthTests();
  const routingResults = await runRoutingEngineTests();
  const apiResults = await runApiServicesTests();

  const all = [...authResults, ...routingResults, ...apiResults];
  const passedCount = all.filter(r => r.success).length;
  const totalCount = all.length;
  const isAllOperational = passedCount === totalCount;

  return {
    isAllOperational,
    passedCount,
    totalCount,
    successPercentage: Math.round((passedCount / totalCount) * 100),
    timestamp: new Date().toISOString(),
    results: all
  };
}
