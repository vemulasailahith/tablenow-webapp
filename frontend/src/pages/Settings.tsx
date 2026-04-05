import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { User, Mail, Shield, Bell, Save, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

const Settings: React.FC = () => {
  const { profile } = useAuth();
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    }, 1000);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface mb-2">
            Settings
          </h1>
          <p className="text-on-surface-variant text-lg">Manage your account preferences and profile details.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Sidebar */}
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-6 py-4 bg-primary/10 text-primary rounded-2xl font-bold transition-all duration-300">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
            <button className="w-full flex items-center gap-3 px-6 py-4 text-on-surface-variant hover:bg-surface-container rounded-2xl font-bold transition-all duration-300">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </button>
            <button className="w-full flex items-center gap-3 px-6 py-4 text-on-surface-variant hover:bg-surface-container rounded-2xl font-bold transition-all duration-300">
              <Shield className="w-5 h-5" />
              <span>Security</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-container-low p-8 rounded-[2rem] border border-surface-container"
            >
              <form onSubmit={handleSave} className="space-y-8">
                <section>
                  <h2 className="text-xl font-headline font-bold mb-6">Personal Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-12 pr-6 py-4 bg-surface-container-lowest border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="w-full pl-12 pr-6 py-4 bg-surface-container-lowest border-none rounded-2xl opacity-60 cursor-not-allowed outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-headline font-bold mb-6">Preferences</h2>
                  <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-bold text-on-surface">Email Notifications</p>
                        <p className="text-xs text-on-surface-variant">Receive updates about your bookings.</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setNotifications(!notifications)}
                      className={`w-12 h-6 rounded-full transition-all duration-300 relative ${notifications ? 'bg-primary' : 'bg-surface-container-high'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${notifications ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </section>

                {message && (
                  <div className={`p-4 rounded-2xl text-sm font-bold text-center ${
                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-5 rounded-full bg-primary text-white font-headline font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? 'Saving...' : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
