import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { GeminiService } from '../services/gemini';
import { Loader2, Wand2, ArrowLeft, Calendar as CalIcon } from 'lucide-react';
import { Trip } from '../types';

export const TripForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const newTrip = StorageService.createEmptyTrip();
    newTrip.title = formData.title;
    newTrip.startDate = new Date(formData.startDate).toISOString();
    newTrip.endDate = new Date(formData.endDate).toISOString();

    await StorageService.saveTrip(newTrip);
    setIsLoading(false);
    navigate(`/trip/${newTrip.id}`);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    
    try {
      const generatedData = await GeminiService.generateTripPlan(aiPrompt, formData.startDate);
      
      const newTrip = StorageService.createEmptyTrip();
      newTrip.title = generatedData.title || newTrip.title;
      newTrip.startDate = formData.startDate; // Keep user start date
      newTrip.endDate = generatedData.endDate || newTrip.endDate;
      newTrip.destinations = generatedData.destinations || [];

      await StorageService.saveTrip(newTrip);
      navigate(`/trip/${newTrip.id}`);
    } catch (error) {
      alert("Failed to generate trip. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Plan a New Trip</h1>

            {/* AI Section */}
            <div className="mb-8 p-6 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-2 mb-3 text-indigo-800 font-semibold">
                <Wand2 size={18} />
                <h3>AI Magic Planner</h3>
              </div>
              <p className="text-sm text-indigo-600/80 mb-4">
                Describe your dream trip, and let AI build the itinerary for you.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., A 10-day foodie tour across Japan starting in Tokyo..."
                  className="flex-grow px-4 py-2 text-sm border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleAiGenerate}
                  disabled={isAiLoading || !aiPrompt}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium text-sm transition-all"
                >
                  {isAiLoading ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                  Generate
                </button>
              </div>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">OR MANUALLY</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Manual Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trip Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Summer Vacation 2024"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <div className="relative">
                    <CalIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <div className="relative">
                    <CalIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all flex justify-center items-center"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Create Empty Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};