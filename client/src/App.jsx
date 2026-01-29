import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import UserForm from './components/UserForm';
import PlanView from './components/PlanView';

export default function App() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentRequestController = useRef(null);
  const saveTimer = useRef(null);


  // Load saved plan
  useEffect(() => {
    const saved = localStorage.getItem('lastPlan');
    if (saved) {
      try {
        setPlan(JSON.parse(saved));
      } catch {
        console.warn("Invalid saved plan.");
      }
    }
  }, []);

  // Debounced plan save
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);

    if (!plan) {
      saveTimer.current = setTimeout(() => localStorage.removeItem('lastPlan'), 200);
      return;
    }

    saveTimer.current = setTimeout(() => {
      localStorage.setItem('lastPlan', JSON.stringify(plan));
    }, 300);

    return () => clearTimeout(saveTimer.current);
  }, [plan]);

  // Generate plan
  const handleGenerate = useCallback(async (userData) => {
    if (currentRequestController.current) currentRequestController.current.abort();
    const controller = new AbortController();
    currentRequestController.current = controller;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        signal: controller.signal,
      });

      const j = await res.json();
      if (j.ok) setPlan(j.plan);
      else alert("Error: " + j.error);
    } catch (err) {
      if (err.name !== 'AbortError') alert(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (currentRequestController.current) currentRequestController.current.abort();
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  return (
    <div className="
      min-h-screen 
      bg-linear-to-bl from-violet-500 to-fuchsia-500
      transition-all duration-700
    ">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <h1 className="text-3xl font-extrabold text-white ">
            AI Fitness Coach
          </h1>

          <div className="flex gap-3 items-center">
            <a
              href="#"
              className="text-sm text-white  hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              GitHub
            </a>
          </div>
        </motion.header>

        {/* Main Grid */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-1">
            <div className="bg-white/30  shadow-lg backdrop-blur-sm rounded-xl p-4">
              <UserForm onGenerate={handleGenerate} loading={loading} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white/70 dark:bg-gray-800/70 shadow-lg backdrop-blur-sm rounded-xl p-4">
              <PlanView plan={plan} setPlan={setPlan} />
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
