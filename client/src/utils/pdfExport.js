import jsPDF from 'jspdf';

export function exportPlanToPdf(plan, filename='ai-fitness-plan.pdf') {
  const doc = new jsPDF();
  let y = 12;
  doc.setFontSize(16);
  doc.text('AI Fitness Plan', 14, y);
  y += 8;
  doc.setFontSize(11);

  doc.text('Workout Plan:', 14, y); y += 6;
  (plan.workoutPlan || []).forEach(day=>{
    doc.text(day.day, 16, y); y += 6;
    (day.exercises || []).forEach(ex=>{
      doc.text(`- ${ex.name} (${ex.sets}x${ex.reps}, rest ${ex.rest})`, 18, y); y+=6;
      if (y > 270) { doc.addPage(); y = 12; }
    });
  });

  y += 6;
  doc.text('Diet Plan:', 14, y); y+=6;
  ['breakfast','lunch','dinner','snacks'].forEach(s=>{
    doc.text(s.toUpperCase()+':', 16, y); y += 6;
    (plan.dietPlan?.[s] || []).forEach(it=>{
      doc.text(`- ${it}`, 18, y); y+=6;
      if (y > 270) { doc.addPage(); y = 12; }
    });
  });

  doc.save(filename);
}
