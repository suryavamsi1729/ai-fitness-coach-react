import React, { useState } from "react";

export default function UserForm({ onGenerate, loading }) {
  const [form, setForm] = useState({
    name: "",
    age: 25,
    gender: "male",
    height_cm: 170,
    weight_kg: 70,
    goal: "weight_loss",
    level: "beginner",
    location: "home",
    diet: "veg",
    medical: "",
  });

  function setField(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  return (
    <div>
      <h2 className="text-[16px] font-bold mb-2">Tell me about you</h2>

      <div className="flex flex-col gap-2">
        {/* Name */}
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          className="p-2 rounded-lg border border-gray-300 flex-1 outline-none focus:ring-2 focus:ring-sky-400"
        />

        {/* Age + Gender */}
        <div className="flex gap-2">
          <input
            type="number"
            value={form.age}
            onChange={(e) => setField("age", e.target.value)}
            className="p-2 rounded-lg border border-gray-300 flex-1 outline-none focus:ring-2 focus:ring-sky-400"
          />
          <select
            value={form.gender}
            onChange={(e) => setField("gender", e.target.value)}
            className="p-2 rounded-lg border border-gray-300 flex-1 outline-none focus:ring-2 focus:ring-sky-400"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Height + Weight */}
        <div className="flex gap-2">
          <input
            type="number"
            value={form.height_cm}
            onChange={(e) => setField("height_cm", e.target.value)}
            className="p-2 rounded-lg border border-gray-300 flex-1 outline-none focus:ring-2 focus:ring-sky-400"
          />
          <input
            type="number"
            value={form.weight_kg}
            onChange={(e) => setField("weight_kg", e.target.value)}
            className="p-2 rounded-lg border border-gray-300 flex-1 outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        {/* Goal */}
        <select
          value={form.goal}
          onChange={(e) => setField("goal", e.target.value)}
          className="p-2 rounded-lg border border-gray-300 flex-1 outline-none focus:ring-2 focus:ring-sky-400"
        >
          <option value="weight_loss">Weight Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="maintain">Maintain Weight</option>
          <option value="toning">Toning</option>
        </select>

        {/* Level */}
        <select
          value={form.level}
          onChange={(e) => setField("level", e.target.value)}
          className="p-2 rounded-lg border border-gray-300 flex-1 outline-none focus:ring-2 focus:ring-sky-400"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        {/* Location */}
        <select
          value={form.location}
          onChange={(e) => setField("location", e.target.value)}
          className="p-2 rounded-lg border border-gray-300 flex-1 outline-none focus:ring-2 focus:ring-sky-400"
        >
          <option value="home">Home</option>
          <option value="gym">Gym</option>
          <option value="outdoor">Outdoor</option>
        </select>

        {/* Diet */}
        <select
          value={form.diet}
          onChange={(e) => setField("diet", e.target.value)}
          className="p-2 rounded-lg border border-gray-300 flex-1 outline-none focus:ring-2 focus:ring-sky-400"
        >
          <option value="veg">Vegetarian</option>
          <option value="non-veg">Non-Veg</option>
          <option value="vegan">Vegan</option>
          <option value="keto">Keto</option>
        </select>

        {/* Medical Notes */}
        <textarea
          placeholder="Medical history / notes (optional)"
          value={form.medical}
          onChange={(e) => setField("medical", e.target.value)}
          rows={3}
          className="p-2 rounded-lg border border-gray-300 flex-1 outline-none focus:ring-2 focus:ring-sky-400 h-20 resize-none"
        />

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onGenerate(form)}
            disabled={loading}
            className="flex-1 py-2 rounded-lg bg-sky-700 text-white disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Plan"}
          </button>

          <button
            onClick={() =>
              setForm({
                name: "",
                age: 25,
                gender: "male",
                height_cm: 170,
                weight_kg: 70,
                goal: "weight_loss",
                level: "beginner",
                location: "home",
                diet: "veg",
                medical: "",
              })
            }
            className="py-2 px-4 rounded-lg border"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

  