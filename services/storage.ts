import { Trip, Destination, Activity } from '../types';
import { AuthService } from './auth';

const STORAGE_KEY = 'wanderlust_trips_v1';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a random ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const StorageService = {
  // Get trips ONLY for the current logged in user
  getTrips: async (): Promise<Trip[]> => {
    await delay(300);
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) return [];

    const data = localStorage.getItem(STORAGE_KEY);
    const allTrips: Trip[] = data ? JSON.parse(data) : [];
    
    // Filter trips by userId
    return allTrips.filter(t => t.userId === currentUser.id);
  },

  // Get a specific trip (check ownership or if it is public share)
  getTripById: async (id: string): Promise<Trip | undefined> => {
    await delay(200);
    const currentUser = AuthService.getCurrentUser();
    const data = localStorage.getItem(STORAGE_KEY);
    const allTrips: Trip[] = data ? JSON.parse(data) : [];

    const trip = allTrips.find(t => t.id === id || t.shareId === id);
    
    if (!trip) return undefined;

    // Allow if it's the owner OR if searching by shareId (public view)
    // Note: In a real app, backend would handle this security
    if (trip.shareId === id) return trip; // Public link access
    if (currentUser && trip.userId === currentUser.id) return trip; // Owner access
    
    return undefined;
  },

  saveTrip: async (trip: Trip): Promise<Trip> => {
    await delay(400);
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) throw new Error("Must be logged in to save trip");

    const data = localStorage.getItem(STORAGE_KEY);
    const allTrips: Trip[] = data ? JSON.parse(data) : [];
    
    // Ensure the trip belongs to the current user
    const tripToSave = { ...trip, userId: currentUser.id };

    const existingIndex = allTrips.findIndex(t => t.id === tripToSave.id);
    
    let updatedTrips;
    if (existingIndex >= 0) {
      updatedTrips = [...allTrips];
      updatedTrips[existingIndex] = tripToSave;
    } else {
      updatedTrips = [tripToSave, ...allTrips];
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
    return tripToSave;
  },

  deleteTrip: async (id: string): Promise<void> => {
    await delay(300);
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) return;

    const data = localStorage.getItem(STORAGE_KEY);
    const allTrips: Trip[] = data ? JSON.parse(data) : [];
    
    const updatedTrips = allTrips.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
  },

  createEmptyTrip: (): Trip => {
    const currentUser = AuthService.getCurrentUser();
    return {
      id: generateId(),
      userId: currentUser ? currentUser.id : '',
      shareId: generateId(), // Public share ID
      title: 'New Adventure',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000 * 5).toISOString(), // +5 days
      destinations: [],
      coverImage: `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 1000)}`,
      createdAt: Date.now()
    };
  }
};