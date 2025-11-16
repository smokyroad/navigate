import { Checkpoint } from '../types';

export const CHECKPOINTS: Checkpoint[] = [
  {
    id: 'airport-entrance',
    name: 'Airport Entrance',
    type: 'entrance',
    location: 'Terminal 1, Ground Floor',
    description: 'Main entrance to the airport terminal',
    terminal: 'Terminal 1',
    x: 15,
    y: 25,
    isMandatory: true,
    estimatedDuration: 2, // 2 minutes at entrance
  },
  {
    id: 'customs',
    name: 'Customs & Immigration',
    type: 'customs',
    location: 'Terminal 1, Level 5',
    description: 'Immigration and customs clearance',
    terminal: 'Terminal 1',
    x: 18,
    y: 50,
    isMandatory: true,
    estimatedDuration: 15, // 15 minutes for customs
  },
  {
    id: 'gate-23',
    name: 'Gate 23',
    type: 'gate',
    location: 'Terminal 1, Gates 20-29',
    description: 'Boarding gate for your flight',
    terminal: 'Terminal 1',
    x: 80,
    y: 50,
    isMandatory: true,
    estimatedDuration: 5, // 5 minutes at gate before boarding
  },
  {
    id: 'cafe-pacific',
    name: 'Café Pacific',
    type: 'dining',
    location: 'Terminal 1, Gate 20-29 Area',
    description: 'Coffee and light snacks with a runway view',
    terminal: 'Terminal 1',
    x: 45,
    y: 35,
    estimatedDuration: 15, // Quick coffee and snacks
  },
  {
    id: 'pier-restaurant',
    name: 'The Pier Restaurant',
    type: 'dining',
    location: 'Terminal 1, Gate 1-19 Area',
    description: 'Full service dining with Asian and Western cuisine',
    terminal: 'Terminal 1',
    x: 48,
    y: 65,
    estimatedDuration: 45, // Full service dining
  },
  {
    id: 'jade-dragon',
    name: 'Jade Dragon',
    type: 'dining',
    location: 'Terminal 1, Central Area',
    description: 'Premium Chinese cuisine',
    terminal: 'Terminal 1',
    x: 55,
    y: 42,
    estimatedDuration: 60, // Premium dining experience
  },
  {
    id: 'quick-bites',
    name: 'Quick Bites',
    type: 'dining',
    location: 'Terminal 1, Gate 30-39 Area',
    description: 'Fast food and grab-and-go options',
    terminal: 'Terminal 1',
    x: 70,
    y: 55,
    estimatedDuration: 10, // Fast food
  },
  {
    id: 'duty-free',
    name: 'Duty Free',
    type: 'shopping',
    location: 'Terminal 1, Central Area',
    description: 'Liquor, tobacco, perfumes and cosmetics',
    terminal: 'Terminal 1',
    x: 38,
    y: 45,
    estimatedDuration: 20, // Shopping time
  },
  {
    id: 'electronics-hub',
    name: 'Electronics Hub',
    type: 'shopping',
    location: 'Terminal 1, Gate 20-29 Area',
    description: 'Latest gadgets and tech accessories',
    terminal: 'Terminal 1',
    x: 42,
    y: 58,
    estimatedDuration: 25, // Electronics shopping
  },
  {
    id: 'fashion-gallery',
    name: 'Fashion Gallery',
    type: 'shopping',
    location: 'Terminal 1, Central Area',
    description: 'Designer boutiques and fashion brands',
    terminal: 'Terminal 1',
    x: 52,
    y: 55,
    estimatedDuration: 30, // Fashion browsing
  },
  {
    id: 'wing-lounge',
    name: 'The Wing Lounge',
    type: 'lounge',
    location: 'Terminal 1, Gate 1-19 Area',
    description: 'First Class lounge with spa and dining',
    terminal: 'Terminal 1',
    x: 62,
    y: 38,
    estimatedDuration: 60, // Lounge relaxation
  },
  {
    id: 'pier-lounge',
    name: 'The Pier Lounge',
    type: 'lounge',
    location: 'Terminal 1, Gate 20-29 Area',
    description: 'Business Class lounge with shower facilities',
    terminal: 'Terminal 1',
    x: 58,
    y: 62,
    estimatedDuration: 45, // Lounge with shower
  },
  {
    id: 'restroom-a',
    name: 'Restroom A',
    type: 'restroom',
    location: 'Terminal 1, Near Gate 15',
    description: 'Full facilities including family rooms',
    terminal: 'Terminal 1',
    x: 28,
    y: 50,
    estimatedDuration: 5, // Quick restroom break
  },
  {
    id: 'restroom-b',
    name: 'Restroom B',
    type: 'restroom',
    location: 'Terminal 1, Near Gate 25',
    description: 'Full facilities including accessible rooms',
    terminal: 'Terminal 1',
    x: 75,
    y: 45,
    estimatedDuration: 5, // Quick restroom break
  },
  {
    id: 'luggage-storage',
    name: 'Luggage Storage',
    type: 'luggage',
    location: 'Terminal 1, Level 5',
    description: 'Secure storage lockers for your belongings',
    terminal: 'Terminal 1',
    x: 22,
    y: 35,
    estimatedDuration: 10, // Time to store luggage
  },
];
