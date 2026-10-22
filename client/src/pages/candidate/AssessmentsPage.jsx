import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock3, ShieldCheck, Trophy, XCircle } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const [a, h] = await Promise.all([api.get('/assessments'), api.get('/assessments/attempts')]);
      setAssessments(a.data.data.assessments || []);
      setAttempts(h.data.data.attempts || []);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const start = async (id) => {
    try {
      setError(''); setResult(null); setAnswers({});
      const res = await api.get(`/assessments/${id}`);
      setSelected(res.data.data);
    } catch (err) { setError(err.message); }
  };

  const submit = async () => {
    if (!selected) return;
    setSubmitting(true); setError('');
    try {
      const payload = Object.entries(answers).map(([questionId, selectedAnswer]) => ({ questionId, selectedAnswer }));
      const res = await api.post(`/assessments/${selected._id}/attempts`, { answers: payload });
      setResult(res.data.data);
      await load();
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading skill assessments..." />;

  if (selected) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <button onClick={() => { setSelected(null); setResult(null); }} className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to assessments</button>
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-[10px] uppercase tracking-widest font-black text-indigo-600">Skill Assessment</p><h1 className="text-2xl font-black mt-1">{selected.skill}</h1><p className="text-xs text-slate-500 mt-2">{selected.description}</p></div>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">Pass: {selected.passPercent}%</span>
          </div>
        </div>

        {result ? (
          <div className={`p-8 rounded-3xl border ${result.attempt.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
            <div className="flex items-center gap-3">{result.attempt.passed ? <CheckCircle2 className="w-8 h-8 text-emerald-600" /> : <XCircle className="w-8 h-8 text-rose-600" />}<div><h2 className="text-xl font-black">{result.attempt.passed ? 'Assessment Passed' : 'Assessment Not Passed'}</h2><p className="text-xs text-slate-600 mt-1">{result.attempt.correctCount} / {result.attempt.totalQuestions} correct</p></div></div>
            <div className="mt-6 flex items-end gap-2"><span className="text-5xl font-black">{result.attempt.score}%</span><span className="text-xs font-bold text-slate-500 pb-2">score</span></div>
            {result.attempt.passed && <p className="mt-4 text-sm font-bold text-emerald-700 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> {selected.skill} is now a verified skill.</p>}
            {!result.attempt.passed && <button onClick={() => { setResult(null); setAnswers({}); }} className="mt-5 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold">Try Again</button>}
          </div>
        ) : (
          <div className="space-y-4">
            {selected.questions.map((q, index) => (
              <div key={q._id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-start justify-between gap-4"><p className="text-sm font-bold leading-6">{index + 1}. {q.question}</p><span className="text-[9px] font-bold uppercase text-slate-400">{q.difficulty}</span></div>
                <div className="grid sm:grid-cols-2 gap-2 mt-4">
                  {q.options.map((option, optionIndex) => <button key={optionIndex} onClick={() => setAnswers(prev => ({ ...prev, [q._id]: optionIndex }))} className={`text-left p-3 rounded-xl border text-xs font-semibold transition ${answers[q._id] === optionIndex ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}>{String.fromCharCode(65 + optionIndex)}. {option}</button>)}
                </div>
              </div>
            ))}
            <button disabled={submitting} onClick={submit} className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black disabled:opacity-50">{submitting ? 'Scoring on server...' : 'Submit Assessment'}</button>
          </div>
        )}
        {error && <p className="text-xs font-bold text-rose-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div><p className="text-[10px] uppercase tracking-widest font-black text-indigo-600">Learn → Verify</p><h1 className="text-2xl font-black mt-1">Skill Assessments</h1><p className="text-xs text-slate-500 mt-1">Pass an assessment to add a verified skill score to your profile.</p></div>
      {error && <p className="text-xs font-bold text-rose-600">{error}</p>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assessments.map(a => <div key={a._id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col"><div className="flex items-start justify-between"><div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Trophy className="w-5 h-5" /></div><span className="text-[10px] font-bold text-slate-400">{a.questionCount} questions</span></div><h2 className="font-black text-lg mt-4">{a.skill}</h2><p className="text-xs text-slate-500 mt-1 flex-1">{a.description}</p><div className="flex items-center gap-3 mt-5 text-[10px] font-bold text-slate-500"><span className="flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" /> {a.passPercent}% to pass</span>{a.latestAttempt && <span className={a.latestAttempt.passed ? 'text-emerald-600' : 'text-rose-500'}>{a.latestAttempt.score}% last</span>}</div><button onClick={() => start(a._id)} className="mt-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold">{a.latestAttempt ? 'Retake Assessment' : 'Start Assessment'}</button></div>)}
      </div>
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"><h2 className="text-sm font-black flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Assessment history</h2><div className="mt-4 space-y-2">{attempts.length === 0 ? <p className="text-xs text-slate-500">No attempts yet.</p> : attempts.slice(0, 8).map(a => <div key={a._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60"><span className="text-xs font-bold">{a.assessment?.skill || 'Assessment'}</span><span className="text-xs font-black">{a.score}% · <span className={a.passed ? 'text-emerald-600' : 'text-rose-500'}>{a.passed ? 'Passed' : 'Not passed'}</span></span></div>)}</div></div>
    </div>
  );
}
