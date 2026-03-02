import { EMISSION_FACTORS, POINTS_PER_KG, TREES_PER_KG_CO2 } from '../config/constants';

/**
 * Calculate carbon saved for a given waste category and weight
 * @param {string} category - Waste category (Plastic, Paper, Metal, Glass, Organic, Hazardous)
 * @param {number} weightKg - Weight in kilograms
 * @returns {number} - Carbon saved in kg CO2
 */
export function calculateCarbon(category, weightKg) {
  if (!category || !weightKg || weightKg <= 0) return 0;
  const factor = EMISSION_FACTORS[category]?.factor || 0;
  return parseFloat((weightKg * factor).toFixed(2));
}

/**
 * Calculate trees equivalent for carbon saved
 * @param {number} carbonSaved - Carbon saved in kg CO2
 * @returns {number} - Trees equivalent
 */
export function calculateTrees(carbonSaved) {
  if (!carbonSaved || carbonSaved <= 0) return 0;
  return parseFloat((carbonSaved / TREES_PER_KG_CO2).toFixed(3));
}

/**
 * Calculate green points earned
 * @param {number} weightKg - Weight in kilograms
 * @returns {number} - Green points
 */
export function calculatePoints(weightKg) {
  if (!weightKg || weightKg <= 0) return 0;
  return Math.round(weightKg * POINTS_PER_KG);
}

/**
 * Get impact badge based on carbon saved
 * @param {number} carbonSaved - Carbon saved in kg CO2
 * @returns {string} - Impact level (Low, Medium, High)
 */
export function getImpactBadge(carbonSaved) {
  if (!carbonSaved || carbonSaved < 1) return 'Low Impact';
  if (carbonSaved < 5) return 'Medium Impact';
  return 'High Impact';
}

/**
 * Build a complete record object
 * @param {string} category - Waste category
 * @param {number} weightKg - Weight in kilograms
 * @param {number} confidence - AI confidence score (0-1)
 * @param {string} userId - User identifier
 * @returns {object} - Complete record object
 */
export function buildRecord(category, weightKg, confidence, userId) {
  const carbonSaved = calculateCarbon(category, weightKg);
  const treesEquivalent = calculateTrees(carbonSaved);
  const greenPoints = calculatePoints(weightKg);
  const wasteType = EMISSION_FACTORS[category]?.wasteType || 'Unknown';

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    category,
    wasteType,
    weight: weightKg,
    confidence,
    carbonSaved,
    treesEquivalent,
    greenPoints,
    userId: userId || 'Anonymous',
  };
}

/**
 * Format carbon saved for display
 * @param {number} carbonSaved - Carbon saved in kg CO2
 * @returns {string} - Formatted string
 */
export function formatCarbon(carbonSaved) {
  if (carbonSaved === 0) return '0';
  if (carbonSaved < 0.01) return '< 0.01';
  return carbonSaved.toFixed(2);
}

/**
 * Format trees equivalent for display
 * @param {number} trees - Trees equivalent
 * @returns {string} - Formatted string
 */
export function formatTrees(trees) {
  if (trees === 0) return '0';
  if (trees < 0.001) return '< 0.001';
  return trees.toFixed(3);
}

/**
 * Format weight for display
 * @param {number} weight - Weight in kg
 * @returns {string} - Formatted string
 */
export function formatWeight(weight) {
  if (weight === 0) return '0';
  return weight.toFixed(1);
}

/**
 * Get category color
 * @param {string} category - Waste category
 * @returns {string} - Hex color code
 */
export function getCategoryColor(category) {
  return EMISSION_FACTORS[category]?.color || '#6b8f6e';
}

/**
 * Get category icon
 * @param {string} category - Waste category
 * @returns {string} - Emoji icon
 */
export function getCategoryIcon(category) {
  return EMISSION_FACTORS[category]?.icon || '📦';
}

/**
 * Get waste type for category
 * @param {string} category - Waste category
 * @returns {string} - Waste type
 */
export function getWasteType(category) {
  return EMISSION_FACTORS[category]?.wasteType || 'Unknown';
}
