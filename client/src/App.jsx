import { useState, useEffect } from 'react';
import UserForm from './components/UserForm';
import PlanView from './components/PlanView';

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    document.documentElement.className = theme === 'dark' ? 'dark' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(()=> {
    const saved = localStorage.getItem('lastPlan');
    if (saved) setPlan(JSON.parse(saved));
  }, []);

  async function handleGenerate(userData) {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const j = await res.json();
      if (j.ok) {
        setPlan(j.plan);
        localStorage.setItem('lastPlan', JSON.stringify(j.plan));
      } else {
        alert('Error: ' + j.error);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <h1 style={{fontSize:22,fontWeight:700}}>AI Fitness Coach (React)</h1>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button onClick={()=>setTheme(t=>t==='dark'?'light':'dark')} style={{padding:'6px 10px',borderRadius:8}}>
            {theme==='dark' ? 'Light' : 'Dark'}
          </button>
          <a href="#" onClick={(e)=>e.preventDefault()}>GitHub</a>
        </div>
      </header>

      <main style={{display:'grid',gridTemplateColumns:'1fr 2fr', gap:16}}>
        <div className="card">
          <UserForm onGenerate={handleGenerate} loading={loading} />
        </div>
        <div>
          <PlanView plan={plan} setPlan={setPlan} />
        </div>
      </main>
    </div>
  );
}
