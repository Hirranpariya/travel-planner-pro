import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { Trip, Destination, Activity } from '../types';
import { Layout } from '../components/Layout';
import { format } from 'date-fns';
import { 
  MapPin, Calendar, CheckSquare, Plus, Save, Download, 
  Share2, Image as ImageIcon, Trash2, Clock, Loader2, ArrowLeft
} from 'lucide-react';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';
import { useToast } from '../components/Toast';

export const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  
  // State for adding a new destination
  const [showAddDest, setShowAddDest] = useState(false);
  const [newDest, setNewDest] = useState<Partial<Destination>>({
    location: '',
    arrivalDate: '',
    notes: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingDestId, setUploadingDestId] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadTrip(id);
  }, [id]);

  const loadTrip = async (tripId: string) => {
    setLoading(true);
    const data = await StorageService.getTripById(tripId);
    if (data) setTrip(data);
    setLoading(false);
  };

  const handleUpdateTrip = async (updatedTrip: Trip) => {
    setTrip(updatedTrip);
    await StorageService.saveTrip(updatedTrip);
  };

  const toggleActivity = async (destId: string, activityId: string) => {
    if (!trip) return;
    const updatedDestinations = trip.destinations.map(d => {
      if (d.id !== destId) return d;
      return {
        ...d,
        activities: d.activities.map(a => 
          a.id === activityId ? { ...a, isCompleted: !a.isCompleted } : a
        )
      };
    });
    handleUpdateTrip({ ...trip, destinations: updatedDestinations });
  };

  const addActivity = async (destId: string, name: string) => {
    if (!trip || !name.trim()) return;
    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      isCompleted: false
    };
    const updatedDestinations = trip.destinations.map(d => {
      if (d.id !== destId) return d;
      return { ...d, activities: [...d.activities, newActivity] };
    });
    handleUpdateTrip({ ...trip, destinations: updatedDestinations });
    showToast('Task added!', 'success');
  };

  const handleAddDestination = async () => {
    if (!trip || !newDest.location) return;
    
    const destination: Destination = {
      id: Math.random().toString(36).substr(2, 9),
      location: newDest.location!,
      arrivalDate: newDest.arrivalDate || trip.startDate,
      departureDate: trip.endDate,
      notes: newDest.notes || '',
      imageUrl: `https://picsum.photos/seed/${newDest.location?.replace(/\s/g, '')}/800/400`,
      activities: []
    };

    await handleUpdateTrip({
      ...trip,
      destinations: [...trip.destinations, destination]
    });
    
    setShowAddDest(false);
    setNewDest({ location: '', arrivalDate: '', notes: '' });
    showToast('Destination added!', 'success');
  };

  const handleDeleteDestination = async (destId: string) => {
    if (!trip) return;
    if (!confirm("Delete this destination?")) return;
    await handleUpdateTrip({
      ...trip,
      destinations: trip.destinations.filter(d => d.id !== destId)
    });
    showToast('Destination deleted', 'info');
  };

  const handleExportPDF = () => {
    if (!trip) return;
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text(trip.title, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`${format(new Date(trip.startDate), 'MMM d')} - ${format(new Date(trip.endDate), 'MMM d, yyyy')}`, 20, 30);
    
    let yPos = 50;
    
    trip.destinations.forEach((dest, i) => {
      if (yPos > 250) { doc.addPage(); yPos = 20; }
      
      doc.setFontSize(16);
      doc.text(`${i + 1}. ${dest.location}`, 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(dest.notes, 25, yPos);
      yPos += 10;
      
      doc.setTextColor(0);
      dest.activities.forEach(act => {
        doc.text(`[${act.isCompleted ? 'x' : ' '}] ${act.name}`, 30, yPos);
        yPos += 7;
      });
      
      yPos += 10;
    });
    
    doc.save(`${trip.title.replace(/\s/g, '_')}_Itinerary.pdf`);
    showToast('PDF Exported!', 'success');
  };

  const handleCopyLink = () => {
      if(!trip) return;
      const url = `${window.location.origin}/#/shared/${trip.shareId}`;
      navigator.clipboard.writeText(url);
      showToast('Public link copied to clipboard!', 'success');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !uploadingDestId || !trip) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const updatedDestinations = trip.destinations.map(d => 
        d.id === uploadingDestId ? { ...d, imageUrl: base64 } : d
      );
      await handleUpdateTrip({ ...trip, destinations: updatedDestinations });
      setUploadingDestId(null);
      showToast('Photo uploaded!', 'success');
    };
    
    reader.readAsDataURL(file);
  };

  const triggerUpload = (destId: string) => {
    setUploadingDestId(destId);
    fileInputRef.current?.click();
  };

  if (loading) return <Layout><div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin text-indigo-600 w-10 h-10"/></div></Layout>;
  if (!trip) return <Layout><div className="p-10 text-center">Trip not found</div></Layout>;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hidden File Input */}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

        <Link to="/dashboard" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6">
            <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
        </Link>

        {/* Hero Section */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 shadow-md group">
          <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 p-8 text-white w-full">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-bold mb-2"
            >
              {trip.title}
            </motion.h1>
            <div className="flex items-center gap-4 text-sm font-medium opacity-90">
              <span className="flex items-center gap-1"><Calendar size={16}/> {format(new Date(trip.startDate), 'MMM d, yyyy')}</span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span>{trip.destinations.length} Stops</span>
            </div>
          </div>
          
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={handleExportPDF} className="p-2 bg-white/20 backdrop-blur hover:bg-white/30 text-white rounded-lg transition-colors" title="Export PDF">
              <Download size={20} />
            </button>
            <button onClick={handleCopyLink} className="p-2 bg-white/20 backdrop-blur hover:bg-white/30 text-white rounded-lg transition-colors" title="Share Public Link">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Col: Itinerary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-slate-900">Itinerary</h2>
              <button 
                onClick={() => setShowAddDest(!showAddDest)}
                className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                + Add Destination
              </button>
            </div>

            {showAddDest && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm mb-6 overflow-hidden">
                <h3 className="font-semibold mb-4 text-indigo-900">New Destination</h3>
                <div className="space-y-4">
                  <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">Location Name</label>
                      <input 
                      placeholder="Where to? (e.g. Paris, France)" 
                      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newDest.location}
                      onChange={e => setNewDest({...newDest, location: e.target.value})}
                      />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Date</label>
                          <input 
                              type="date"
                              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                              value={newDest.arrivalDate}
                              onChange={e => setNewDest({...newDest, arrivalDate: e.target.value})}
                          />
                    </div>
                    <div className="flex-[2]">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Notes</label>
                          <input 
                              placeholder="Brief description..." 
                              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                              value={newDest.notes}
                              onChange={e => setNewDest({...newDest, notes: e.target.value})}
                          />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setShowAddDest(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-md">Cancel</button>
                    <button onClick={handleAddDestination} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Destination</button>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-8 relative border-l-2 border-slate-200 ml-4 pl-8 pb-4">
              {trip.destinations.map((dest, index) => (
                <motion.div 
                  key={dest.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-white rounded-xl shadow-sm border border-slate-200 p-6 group hover:shadow-md transition-shadow"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[41px] top-6 w-5 h-5 rounded-full border-4 border-white bg-indigo-600 shadow-sm z-10"></div>

                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image Area */}
                    <div className="w-full md:w-48 h-32 md:h-48 flex-shrink-0 relative rounded-lg overflow-hidden bg-slate-100 group-hover:ring-2 ring-indigo-50 transition-all">
                      <img src={dest.imageUrl} alt={dest.location} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => triggerUpload(dest.id)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2"
                      >
                        <ImageIcon size={24} />
                        <span className="text-xs font-medium">Change Photo</span>
                      </button>
                    </div>

                    {/* Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{dest.location}</h3>
                          {dest.arrivalDate && (
                            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                              <Clock size={14} /> 
                              {format(new Date(dest.arrivalDate), 'EEE, MMM d')}
                            </p>
                          )}
                        </div>
                        <button 
                          onClick={() => handleDeleteDestination(dest.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                          title="Remove Destination"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <p className="text-slate-600 mt-3 text-sm italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                          {dest.notes || "No notes added."}
                      </p>

                      {/* Activities Checklist */}
                      <div className="mt-4 pt-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <CheckSquare size={14} /> Checklist & Activities
                        </h4>
                        <ul className="space-y-2 mb-3">
                          {dest.activities.map(activity => (
                            <li key={activity.id} className="flex items-center gap-2 group/act">
                              <button 
                                onClick={() => toggleActivity(dest.id, activity.id)}
                                className={`transition-colors ${activity.isCompleted ? 'text-green-500' : 'text-slate-300 hover:text-indigo-500'}`}
                              >
                                <CheckSquare size={18} />
                              </button>
                              <span className={`text-sm ${activity.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                {activity.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="+ Add task..." 
                            className="text-sm px-3 py-1.5 border border-slate-200 rounded-md focus:border-indigo-500 outline-none w-full bg-slate-50 focus:bg-white transition-colors"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                addActivity(dest.id, e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map Embed (Simple) */}
                  <div className="mt-6 h-48 rounded-lg overflow-hidden border border-slate-100 grayscale hover:grayscale-0 transition-all duration-500">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(dest.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                      aria-hidden="false"
                      title={`Map of ${dest.location}`}
                    />
                  </div>
                </motion.div>
              ))}
              
              {trip.destinations.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                      <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                      <p>No destinations yet. Add one to get started!</p>
                  </div>
              )}
            </div>
          </div>

          {/* Right Col: Trip Overview Stats */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg mb-4">Trip Stats</h3>
              
              <div className="space-y-5">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase font-bold">Duration</p>
                    <p className="font-medium text-lg">
                      {Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 3600 * 24))} Days
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase font-bold">Stops</p>
                    <p className="font-medium text-lg">{trip.destinations.length} Places</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <CheckSquare size={18} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-slate-500 text-xs uppercase font-bold">Checklist</p>
                    <div className="flex items-baseline gap-2">
                          <p className="font-medium text-lg">
                              {trip.destinations.reduce((acc, d) => acc + d.activities.filter(a => a.isCompleted).length, 0)} 
                              <span className="text-slate-400 text-sm"> / {trip.destinations.reduce((acc, d) => acc + d.activities.length, 0)}</span>
                          </p>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div 
                              className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${(trip.destinations.reduce((acc, d) => acc + d.activities.filter(a => a.isCompleted).length, 0) / Math.max(1, trip.destinations.reduce((acc, d) => acc + d.activities.length, 0))) * 100}%` }}
                          />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100">
                  <button 
                      onClick={handleCopyLink}
                      className="w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                  >
                      <Share2 size={16} /> Copy Public Link
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};