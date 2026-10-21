import { AppItem, Review } from '../types/store';

// Clean slate: Zero pre-seeded applications. Store starts 100% empty for user publishing.
export const INITIAL_APPS: AppItem[] = [];

// Clean slate: Zero pre-seeded reviews/ratings.
export const INITIAL_REVIEWS: Review[] = [];

// Clean slate: Empty demo starter sets for publishing
export const DEMO_STARTER_APPS: AppItem[] = [];
export const DEMO_STARTER_REVIEWS: Review[] = [];

export const CATEGORIES = [
  { id: 'All', name: 'All Categories', icon: 'Sparkles' },
  { id: 'Games', name: 'Action & Games', icon: 'Gamepad2' },
  { id: 'AI & AR', name: 'AI & Spatial AR', icon: 'BrainCircuit' },
  { id: 'Tools', name: 'Tools & Utilities', icon: 'ShieldCheck' },
  { id: 'Productivity', name: 'Productivity', icon: 'Layers' },
  { id: 'Entertainment', name: 'Music & Media', icon: 'Music' },
  { id: 'Social', name: 'Social & Chat', icon: 'Users' },
  { id: 'Developer', name: 'Dev Tools & SDKs', icon: 'Code' },
  { id: 'Health', name: 'Health & Fitness', icon: 'HeartPulse' },
  { id: 'Finance', name: 'Finance & Crypto', icon: 'Coins' }
];
