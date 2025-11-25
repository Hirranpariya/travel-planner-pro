import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Calendar, Share2, Wand2, ArrowRight } from 'lucide-react';
import { Layout } from '../components/Layout';

export const Landing: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200 via-slate-50 to-white opacity-50"></div>
        
        <div className="text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-6 border border-indigo-100">
              ✨ AI-Powered Travel Planning
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
              Plan your next trip <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                in seconds, not hours.
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the future of travel. Let our AI build your perfect itinerary, manage destinations, and share your journey with the world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth" className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                Get Started Free <ArrowRight size={20} />
              </Link>
              <Link to="/shared/demo" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center">
                View Demo Trip
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Wand2, title: "AI Generation", desc: "Input your dream, get a full itinerary instantly." },
              { icon: Map, title: "Smart Maps", desc: "Visualize your route with integrated mapping." },
              { icon: Calendar, title: "Daily Plans", desc: "Organize activities and checklists day by day." },
              { icon: Share2, title: "Public Sharing", desc: "Share your trip with a unique public link." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-4">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof / Dashboard Preview */}
      <div className="py-20 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
             <h2 className="text-3xl md:text-4xl font-bold mb-6">Manage all your adventures in one place</h2>
             <p className="text-slate-400 text-lg mb-8">
               From weekend getaways to month-long expeditions, our dashboard keeps your plans organized, accessible, and beautiful.
             </p>
             <ul className="space-y-4 mb-8">
               {['Visual trip cards with countdowns', 'Drag-and-drop itinerary management', 'PDF Export for offline access'].map((item, i) => (
                 <li key={i} className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs">✓</div>
                   {item}
                 </li>
               ))}
             </ul>
          </div>
          <div className="md:w-1/2 relative">
             <div className="bg-slate-800 rounded-lg p-4 shadow-2xl border border-slate-700 transform rotate-2 hover:rotate-0 transition-all duration-500">
                {/* Abstract representation of dashboard */}
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-4">
                    <div className="h-32 bg-indigo-600 rounded-lg opacity-80"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 bg-slate-700 rounded-lg"></div>
                        <div className="h-24 bg-slate-700 rounded-lg"></div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};