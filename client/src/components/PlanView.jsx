import React, { useState } from 'react';
import PlanCard from './PlanCard';
import { exportPlanToPdf } from '../utils/pdfExport';

const PlanView = ({ plan, setPlan }) =>{
  const [playing, setPlaying] = useState(false);

  async function handleListen(section = 'workout') {
    if (!plan) return alert('Generate a plan first.');
    const text =
      section === 'workout'
        ? JSON.stringify(plan.workoutPlan, null, 2)
        : JSON.stringify(plan.dietPlan, null, 2);
    setPlaying(true);
    try {
      const res = await fetch('http://localhost:5000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'alloy' }),
      });
      const j = await res.json();
      if (j.ok) {
        const audio = new Audio(j.audio);
        audio.play();
        audio.onended = () => setPlaying(false);
      } else {
        alert(j.error);
        setPlaying(false);
      }
    } catch (e) {
      alert(e.message);
      setPlaying(false);
    }
  }

  async function handleGenerateImage(prompt) {
    const res = await fetch('http://localhost:5000/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const j = await res.json();
    if (j.ok) return j.image;
    throw new Error(j.error || 'image error');
  }

  if (!plan) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <p>No plan yet — generate one to get started.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => exportPlanToPdf(plan)}
          className="px-3 py-2 rounded-lg bg-emerald-600 text-white border-none hover:bg-emerald-700 disabled:opacity-60"
        >
          Export PDF
        </button>

        <button
          onClick={() => handleListen('workout')}
          disabled={playing}
          className="px-3 py-2 rounded-lg bg-emerald-600 text-white border-none hover:bg-emerald-700 disabled:opacity-60"
        >
          {playing ? 'Playing...' : 'Read Workout'}
        </button>

        <button
          onClick={() => handleListen('diet')}
          disabled={playing}
          className="px-3 py-2 rounded-lg bg-emerald-600 text-white border-none hover:bg-emerald-700 disabled:opacity-60"
        >
          {playing ? 'Playing...' : 'Read Diet'}
        </button>

        <button
          onClick={() => {
            localStorage.removeItem('lastPlan');
            setPlan(null);
          }}
          className="px-3 py-2 rounded-lg border bg-white text-gray-800 hover:bg-gray-50"
        >
          Clear Saved
        </button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-bold">Workout Plan</h3>
          <div className="mt-2 space-y-3">
            {plan.workoutPlan?.map((day, i) => (
              <PlanCard key={i} day={day} onGenerateImage={handleGenerateImage} />
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-bold">Diet Plan</h3>
          <div className="mt-2">
            {Object.entries(plan.dietPlan || {}).map(([meal, arr]) => (
              <div key={meal} className="mb-3">
                <h4 className="font-semibold">{meal.toUpperCase()}</h4>
                <ul className="mt-1 space-y-1">
                  {arr.map((it, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center"
                    >
                      <span>{it}</span>
                      <button
                        onClick={async () => {
                          const url = await handleGenerateImage(it);
                          window.open(url, '_blank');
                        }}
                        className="text-xs underline"
                      >
                        Show
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="mt-2">
              <h4 className="font-bold">Tips</h4>
              <ul className="list-disc list-inside mt-1">
                {(plan.tips || []).map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
              <p className="italic mt-2">Motivation: {plan.motivation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PlanView;

