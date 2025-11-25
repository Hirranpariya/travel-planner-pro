import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '../components/Toast';

export const Contact: React.FC = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate send
    showToast('Message sent successfully!', 'success');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <Layout>
        <div className="max-w-6xl mx-auto py-12">
            <div className="grid md:grid-cols-2 gap-12">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Get in touch</h1>
                    <p className="text-slate-600 mb-8">
                        Have questions about the platform or need support? We're here to help you plan the perfect trip.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Email</h3>
                                <p className="text-slate-500">support@wanderlust.ai</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                             <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Phone</h3>
                                <p className="text-slate-500">+1 (555) 123-4567</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                             <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Office</h3>
                                <p className="text-slate-500">123 Innovation Dr,<br/>Tech City, TC 94000</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input 
                                required
                                type="text" 
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={form.name}
                                onChange={e => setForm({...form, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input 
                                required
                                type="email" 
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={form.email}
                                onChange={e => setForm({...form, email: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                            <textarea 
                                required
                                rows={4}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                value={form.message}
                                onChange={e => setForm({...form, message: e.target.value})}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                            <Send size={18} /> Send Message
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    </Layout>
  );
};