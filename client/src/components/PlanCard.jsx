import React, { useState } from 'react';
import { motion } from 'motion/react';

export default function PlanCard({ day, onGenerateImage }) {
  const [loadingImg, setLoadingImg] = useState(false);

  async function showImageFor(ex) {
    setLoadingImg(true);
    try {
      const url = await onGenerateImage(ex.name + ' exercise, realistic photograph');
      window.open(url, '_blank');
    } catch (e) {
      alert('Image failed: ' + e.message);
    } finally {
      setLoadingImg(false);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-2 p-2.5 border border-gray-300 rounded-lg"
    >
      <h4 className="font-bold">{day.day}</h4>

      <ul className="mt-1">
        {day.exercises.map((ex, i) => (
          <li
            key={i}
            className="flex justify-between items-center py-1.5"
          >
            <div>
              <div className="font-semibold">{ex.name}</div>
              <div className="text-sm text-gray-500">
                {ex.sets} x {ex.reps} • rest {ex.rest}
              </div>
            </div>

            <div>
              <button
                onClick={() => showImageFor(ex)}
                disabled={loadingImg}
                className="px-2 py-1.5 rounded-md border border-gray-300 disabled:opacity-60 text-sm"
              >
                {loadingImg ? '...' : 'Image'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
