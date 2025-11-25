import { Trip } from '../types';

const API_URL = 'http://localhost:5000/api/trips';

export const ApiService = {
  getTrips: async (): Promise<Trip[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch trips');
    return response.json();
  },

  getTripById: async (id: string): Promise<Trip | undefined> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) return undefined;
    return response.json();
  },

  saveTrip: async (trip: Trip): Promise<Trip> => {
    // Check if trip exists (by checking if it has a real MongoDB _id or we are creating new)
    // Note: In a real app, you might distinguish create vs update more explicitly
    const exists = await ApiService.getTripById(trip.id);
    
    if (exists) {
      const response = await fetch(`${API_URL}/${trip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trip),
      });
      return response.json();
    } else {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trip),
      });
      return response.json();
    }
  },

  deleteTrip: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
  }
};