import { buildRecord } from './carbonEngine';
import { CATEGORY_WEIGHTS } from '../config/constants';

const MOCK_USER_NAMES = ['Alex K.', 'Priya S.', 'Rohan M.', 'Divya T.', 'Sam J.'];

/**
 * Get a random category based on weighted distribution
 * @returns {string} - Random category
 */
function getRandomCategory() {
  const rand = Math.random();
  let cumulative = 0;
  
  for (const [category, weight] of Object.entries(CATEGORY_WEIGHTS)) {
    cumulative += weight;
    if (rand <= cumulative) {
      return category;
    }
  }
  
  return 'Plastic';
}

/**
 * Get a random weight between min and max
 * @param {number} min - Minimum weight
 * @param {number} max - Maximum weight
 * @returns {number} - Random weight
 */
function getRandomWeight(min = 0.2, max = 3.5) {
  const weight = Math.random() * (max - min) + min;
  return Math.round(weight * 10) / 10; // Round to 1 decimal place
}

/**
 * Get a random confidence score
 * @returns {number} - Random confidence between 0.75 and 0.98
 */
function getRandomConfidence() {
  return Math.round((Math.random() * 0.23 + 0.75) * 100) / 100;
}

/**
 * Get a random user name
 * @returns {string} - Random user name
 */
function getRandomUser() {
  return MOCK_USER_NAMES[Math.floor(Math.random() * MOCK_USER_NAMES.length)];
}

/**
 * Get a random date within the last N days
 * @param {number} days - Number of days to look back
 * @returns {string} - ISO timestamp
 */
function getRandomDateWithin(days = 7) {
  const now = new Date();
  const past = new Date(now.getTime() - Math.random() * days * 24 * 60 * 60 * 1000);
  return past.toISOString();
}

/**
 * Generate a single mock record
 * @returns {object} - Mock record
 */
export function generateMockRecord() {
  const category = getRandomCategory();
  const weight = getRandomWeight();
  const confidence = getRandomConfidence();
  const userId = getRandomUser();
  
  const record = buildRecord(category, weight, confidence, userId);
  record.timestamp = getRandomDateWithin(7);
  
  return record;
}

/**
 * Generate multiple mock records
 * @param {number} count - Number of records to generate
 * @returns {array} - Array of mock records
 */
export function generateMockData(count = 20) {
  const records = [];
  
  for (let i = 0; i < count; i++) {
    records.push(generateMockRecord());
  }
  
  // Sort by timestamp descending
  return records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Seed mock data into localStorage if empty
 * @returns {array} - The seeded records
 */
export function seedMockData() {
  const existing = localStorage.getItem('ecoscan_records');
  
  if (!existing || JSON.parse(existing).length === 0) {
    const mockData = generateMockData(20);
    localStorage.setItem('ecoscan_records', JSON.stringify(mockData));
    return mockData;
  }
  
  return JSON.parse(existing);
}

/**
 * Clear all mock data
 */
export function clearMockData() {
  localStorage.removeItem('ecoscan_records');
  localStorage.removeItem('ecoscan_user');
}
