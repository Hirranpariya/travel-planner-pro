import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { TripCard } from '../components/TripCard';
import { StorageService } from '../services/storage';
import { Trip, TripFilter } from '../types';
import { Search, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TripCardSkeleton } from '../components/Skeleton';
import { Link } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<TripFilter>(TripFilter.ALL);
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadTrips();
  }, [user]);

  const loadTrips = async () => {
    setLoading(true);
    // Simulate slightly longer network delay to show off skeletons
    await new Promise(r => setTimeout(r, 800));
    const data = await StorageService.getTrips();
    setTrips(data.sort((a, b) => b.createdAt - a.createdAt));
    setLoading(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); 
    if (confirm('Are you sure you want to delete this trip?')) {
      await StorageService.deleteTrip(id);
      setTrips(trips.filter(t => t.id !== id));
      showToast('Trip deleted successfully', 'error');
    }
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(search.toLowerCase());
    const endDate = new Date(trip.endDate);
    const isPast = endDate < new Date();

    if (!matchesSearch) return false;
    if (filter === TripFilter.UPCOMING) return !isPast;
    if (filter === TripFilter.PAST) return isPast;
    return true;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">My Trips</h1>
              <p className="text-slate-500">Welcome back, {user?.name}. Manage your adventures.</p>
          </div>
          <Link to="/create" className="md:hidden flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg font-medium">
              <Plus size={18} /> New Trip
          </Link>
        </div>

        {/* Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search trips..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
            {Object.values(TripFilter).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  filter === f 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TripCardSkeleton />
              <TripCardSkeleton />
              <TripCardSkeleton />
          </div>
        ) : (
          <>
            {filteredTrips.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-indigo-400" size={24} />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No trips found</h3>
                <p className="text-slate-500 mt-1">Try adjusting your search or create a new trip.</p>
                {trips.length === 0 && (
                    <Link to="/create" className="mt-4 inline-block text-indigo-600 font-medium hover:underline">Create your first trip &rarr;</Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredTrips.map(trip => (
                    <TripCard 
                      key={trip.id} 
                      trip={trip} 
                      onDelete={(e) => handleDelete(e, trip.id)} 
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};