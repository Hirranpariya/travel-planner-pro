import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { Trip } from '../types';
import { format } from 'date-fns';
import { MapPin, Calendar, CheckSquare, Clock, Map as MapIcon, Plane } from 'lucide-react';
import { motion } from 'framer-motion';

export const SharedTrip: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shareId) loadTrip(shareId);
  }, [shareId]);

  const loadTrip = async (id: string) => {
    setLoading(true);
    // In real app, call endpoint /api/trips/shared/:shareId
    // For demo, we search all
    const trips = await StorageService.getTrips();
    const found = trips.find(t => t.shareId === id || t.id === id); // Fallback logic for demo
    setTrip(found || null);
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  
  if (!trip) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
        <p className="text-xl text-slate-600 mb-8">Trip not found or has been removed.</p>
        <Link to="/" className="text-indigo-600 hover:underline">Go Home</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
       {/* Public Header */}
       <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
           <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-1.5 rounded text-white">
                        <Plane size={18} />
                    </div>
                    <span className="font-bold text-lg">Wanderlust</span>
                </Link>
                <div className="text-sm text-slate-500">
                    Shared Itinerary
                </div>
           </div>
       </div>

       {/* Hero */}
       <div className="relative h-96">
            <img src={trip.coverImage} className="w-full h-full object-cover" alt="Cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-center md:text-left max-w-4xl mx-auto">
                 <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-4xl md:text-6xl font-bold text-white mb-4"
                >
                    {trip.title}
                 </motion.h1>
                 <p className="text-white/90 text-lg flex items-center justify-center md:justify-start gap-2">
                    <Calendar size={20} />
                    {format(new Date(trip.startDate), 'MMMM d, yyyy')} — {format(new Date(trip.endDate), 'MMMM d, yyyy')}
                 </p>
            </div>
       </div>

       <div className="max-w-4xl mx-auto px-4 mt-12">
            <div className="grid gap-12 relative border-l-2 border-indigo-200 ml-4 pl-8 md:ml-8 md:pl-12 pb-4">
                {trip.destinations.map((dest, i) => (
                    <motion.div 
                        key={dest.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative"
                    >
                        {/* Timeline Marker */}
                        <div className="absolute -left-[45px] md:-left-[61px] top-0 w-8 h-8 bg-indigo-600 rounded-full border-4 border-slate-50 flex items-center justify-center text-white font-bold text-sm z-10">
                            {i + 1}
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                             <div className="h-64 relative">
                                 <img src={dest.imageUrl} className="w-full h-full object-cover" alt={dest.location} />
                                 <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6">
                                    <h2 className="text-3xl font-bold text-white">{dest.location}</h2>
                                    {dest.arrivalDate && <p className="text-slate-200 text-sm mt-1">{format(new Date(dest.arrivalDate), 'EEEE, MMMM d')}</p>}
                                 </div>
                             </div>
                             
                             <div className="p-8">
                                 {dest.notes && (
                                     <div className="mb-6 text-lg text-slate-700 leading-relaxed italic border-l-4 border-indigo-100 pl-4">
                                         "{dest.notes}"
                                     </div>
                                 )}

                                 <div className="grid md:grid-cols-2 gap-8">
                                     <div>
                                         <h3 className="font-bold text-indigo-600 uppercase tracking-wider text-sm mb-3">Planned Activities</h3>
                                         <ul className="space-y-3">
                                             {dest.activities.map(act => (
                                                 <li key={act.id} className="flex items-start gap-3">
                                                     <div className={`mt-1 ${act.isCompleted ? 'text-green-500' : 'text-slate-300'}`}>
                                                         <CheckSquare size={18} />
                                                     </div>
                                                     <span className={act.isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}>
                                                         {act.name}
                                                     </span>
                                                 </li>
                                             ))}
                                             {dest.activities.length === 0 && <li className="text-slate-400 italic">No activities listed.</li>}
                                         </ul>
                                     </div>
                                     
                                     <div className="h-48 rounded-xl overflow-hidden bg-slate-100">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            style={{ border: 0 }}
                                            src={`https://maps.google.com/maps?q=${encodeURIComponent(dest.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                            aria-hidden="false"
                                        />
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-16 text-center">
                <p className="text-slate-500 mb-4">Want to plan a trip like this?</p>
                <Link to="/" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-all">
                    Start Your Adventure
                </Link>
            </div>
       </div>
    </div>
  );
};