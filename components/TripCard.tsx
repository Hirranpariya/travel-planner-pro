import React from 'react';
import { Calendar, MapPin, ArrowRight, Trash2 } from 'lucide-react';
import { Trip } from '../types';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface TripCardProps {
  trip: Trip;
  onDelete: (e: React.MouseEvent) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onDelete }) => {
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const today = new Date();
  
  const daysUntil = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  const isPast = endDate < today;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-all duration-300"
    >
      <Link to={`/trip/${trip.id}`} className="block h-full flex flex-col">
        {/* Image Header */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={trip.coverImage} 
            alt={trip.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-bold truncate pr-4">{trip.title}</h3>
            <div className="flex items-center text-xs text-slate-200 mt-1">
              <Calendar size={12} className="mr-1" />
              {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
            </div>
          </div>

          {!isPast && daysUntil > 0 && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-indigo-600 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {daysUntil} days to go
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center text-slate-500 text-sm">
              <MapPin size={14} className="mr-1 text-slate-400" />
              <span>{trip.destinations.length} Destinations</span>
            </div>
          </div>

          <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100">
            <span className="text-xs font-medium text-indigo-600 flex items-center group-hover:translate-x-1 transition-transform">
              View Itinerary <ArrowRight size={12} className="ml-1" />
            </span>
            
            <button 
              onClick={onDelete}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Delete Trip"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};