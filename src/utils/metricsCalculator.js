/**
 * Formatting & Metrics Calculation Utilities
 */

export function formatTime(minutes) {
  if (minutes < 60) return `${minutes} Min.`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} Std. ${m} Min.` : `${h} Std.`;
}

export function formatMoney(euros) {
  return `${euros.toFixed(2).replace('.', ',')} €`;
}

export function formatCO2(grams) {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(2).replace('.', ',')} kg`;
  }
  return `${grams} g`;
}
