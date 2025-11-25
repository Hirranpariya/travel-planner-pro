import React from 'react';
import { Layout } from '../components/Layout';
import { motion } from 'framer-motion';
import { Map, Users, Heart } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <Layout>
        <div className="max-w-4xl mx-auto py-12">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Reimagining Travel Planning</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Wanderlust AI Planner combines the power of artificial intelligence with intuitive design 
                    to help you create unforgettable journeys.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
                {[
                    { icon: Map, title: "Smart Planning", desc: "Our AI engine analyzes millions of destinations to find perfect matches for your style." },
                    { icon: Users, title: "Community Driven", desc: "Share your itineraries and discover hidden gems from fellow travelers." },
                    { icon: Heart, title: "Built with Passion", desc: "Created by travelers, for travelers. We understand what makes a trip special." }
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center"
                    >
                        <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
                            <item.icon size={28} />
                        </div>
                        <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                        <p className="text-slate-500">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
            
            <div className="bg-indigo-600 text-white rounded-2xl p-12 text-center relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-4">Ready to start your adventure?</h2>
                    <p className="mb-8 opacity-90">Join thousands of travelers planning their dream trips today.</p>
                    <a href="#/create" className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors inline-block">
                        Plan My Trip
                    </a>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>
        </div>
    </Layout>
  );
};