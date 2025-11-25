export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Activity {
  id: string;
  name: string;
  isCompleted: boolean;
}

export interface Destination {
  id: string;
  location: string;
  arrivalDate: string; // ISO date string
  departureDate: string; // ISO date string
  notes: string;
  imageUrl?: string;
  activities: Activity[];
}

export interface Trip {
  id: string;
  userId: string; // Owner of the trip
  shareId: string;
  title: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  destinations: Destination[];
  coverImage: string;
  createdAt: number;
}

export interface TripFormData {
  title: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
}

export enum TripFilter {
  UPCOMING = 'UPCOMING',
  PAST = 'PAST',
  ALL = 'ALL'
}