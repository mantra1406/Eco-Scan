// Emission factors - kg CO2 saved per kg of waste when properly processed
// Labels match the Teachable Machine model: https://teachablemachine.withgoogle.com/models/bYI0yMgNz/
export const EMISSION_FACTORS = {
  Plastic: {
    factor: 2.5,
    color: '#3b82f6',
    icon: '🥤',
    wasteType: 'Recyclable',
  },
  Paper: {
    factor: 1.0,
    color: '#f59e0b',
    icon: '📄',
    wasteType: 'Recyclable',
  },
  Metal: {
    factor: 4.0,
    color: '#6b7280',
    icon: '🥫',
    wasteType: 'Recyclable',
  },
  'White Glass': {
    factor: 0.5,
    color: '#e0f2fe',
    icon: '🍶',
    wasteType: 'Recyclable',
  },
  'Green-Glass': {
    factor: 0.5,
    color: '#10b981',
    icon: '🍾',
    wasteType: 'Recyclable',
  },
  'Brown-Glass': {
    factor: 0.5,
    color: '#92400e',
    icon: '🫙',
    wasteType: 'Recyclable',
  },
  Cardboard: {
    factor: 0.9,
    color: '#d97706',
    icon: '📦',
    wasteType: 'Recyclable',
  },
  Biological: {
    factor: 0.8,
    color: '#22c55e',
    icon: '🍎',
    wasteType: 'Biodegradable',
  },
  Battery: {
    factor: 3.0,
    color: '#ef4444',
    icon: '🔋',
    wasteType: 'Hazardous',
  },
  Trash: {
    factor: 0.3,
    color: '#78716c',
    icon: '🗑️',
    wasteType: 'Non-Recyclable',
  },
  Shoes: {
    factor: 1.2,
    color: '#a78bfa',
    icon: '👟',
    wasteType: 'Non-Recyclable',
  },
  Clothes: {
    factor: 1.5,
    color: '#f472b6',
    icon: '👕',
    wasteType: 'Recyclable',
  },
};

// AI Model configuration
export const CONFIDENCE_THRESHOLD = 0.70;
export const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/bYI0yMgNz'; // Teachable Machine model

// Gamification settings
export const POINTS_PER_KG = 10;
export const TREES_PER_KG_CO2 = 21; // One tree absorbs ~21kg CO2 per year

// Category weights for simulation mode (matches model labels)
export const CATEGORY_WEIGHTS = {
  Plastic: 0.20,
  Biological: 0.15,
  Paper: 0.15,
  Cardboard: 0.10,
  'White Glass': 0.08,
  'Green-Glass': 0.07,
  'Brown-Glass': 0.07,
  Metal: 0.07,
  Clothes: 0.04,
  Shoes: 0.03,
  Battery: 0.02,
  Trash: 0.02,
};

// App metadata
export const APP_NAME = 'EcoScan';
export const APP_TAGLINE = 'AI-Powered Sustainability Platform';
export const APP_VERSION = '1.0.0';

// LocalStorage keys
export const STORAGE_KEYS = {
  RECORDS: 'ecoscan_records',
  USER: 'ecoscan_user',
  SETTINGS: 'ecoscan_settings',
};

// Chart colors
export const CHART_COLORS = {
  primary: '#3ddc60',
  secondary: '#8fffaa',
  surface: '#111811',
  grid: '#1f2f1f',
  text: '#e8f5e9',
  muted: '#6b8f6e',
};

// Mock users for leaderboard
export const MOCK_USERS = [
  { name: 'Priya Sharma', scans: 18, co2Saved: 42.3, greenPoints: 380 },
  { name: 'Rohan Mehta', scans: 15, co2Saved: 38.1, greenPoints: 310 },
  { name: 'Divya Iyer', scans: 12, co2Saved: 29.7, greenPoints: 240 },
  { name: 'Alex Kumar', scans: 9, co2Saved: 18.4, greenPoints: 170 },
  { name: 'Sam Joshi', scans: 6, co2Saved: 11.2, greenPoints: 120 },
];

// Feature descriptions for landing page
export const FEATURES = [
  {
    icon: '🤖',
    title: 'AI Classification',
    description: 'Upload any waste image. Our model identifies it instantly with confidence scoring.',
  },
  {
    icon: '🌍',
    title: 'Carbon Analytics',
    description: 'Every scan calculates real CO₂ savings using scientific emission factors.',
  },
  {
    icon: '🏆',
    title: 'Green Rewards',
    description: 'Earn points for proper segregation. Compete on the leaderboard.',
  },
];

// Navigation links
export const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/scanner', label: 'Scanner' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/admin', label: 'Admin' },
];
