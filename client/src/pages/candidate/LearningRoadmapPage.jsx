import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, ExternalLink, GraduationCap, ShieldCheck, Target } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function LearningRoadmapPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try { setLoading(true); const res = await api.get('/learning/roadmap'); if (res.data.success) setData(res.data.data); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const update = async (id, value) => {
    try { setUpdating(id); const res = await api.patch(`/learning/roadmap/${id}`, { progressPercent: value }); if (res.data.success) setData(prev => ({ ...prev, roadmap: prev.roadmap.map(x => x._id === id ? res.data.data.progress : x) })); }
    catch (err) { setError(err.message); } finally { setUpdating(null); }
  };

  if (loading) return <LoadingSpinner fullScreen text="Building your learning roadmap from current job demand..." />;
  const roadmap = data?.roadmap || [];

  return <div className="max-w-6xl mx-auto space-y-8 pb-12">
    <div><p className="text-[10px] uppercase tracking-widest font-black text-indigo-600">Skill Gap → Learning</p><h1 className="text-2xl font-black mt-1">Learning Roadmap</h1><p className="text-xs text-slate-500 mt-1">Priorities are generated from missing skills across {data?.totalJobsAnalyzed || 0} active jobs. Your progress is saved.</p></div>
    {error && <p className="text-xs font-bold text-rose-600">{error}</p>}
    {roadmap.length === 0 ? <div className="p-10 text-center rounded-3xl bg-white border border-slate-200"><Target className="w-8 h-8 mx-auto text-emerald-600" /><h2 className="font-black mt-3">No current skill gaps</h2><p className="text-xs text-slate-500 mt-1">Your current skills cover the required skills in the active job set.</p></div> : <div className="space-y-4">{roadmap.map((item, index) => <div key={item._id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"><div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5"><div className="flex gap-4"><div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">{item.priority || index + 1}</div><div><div className="flex items-center gap-2"><h2 className="text-base font-black">{item.skill}</h2>{item.status === 'Verified' && <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-black flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</span>}</div><p className="text-xs text-slate-500 mt-1">Required by <b>{item.demandPercentage}%</b> of analyzed jobs · estimated {item.estimatedHours} hours</p></div></div><div className="w-full lg:w-72"><div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1"><span>{item.status}</span><span>{item.progressPercent}%</span></div><div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-indigo-600 rounded-full" style={{ width: `${item.progressPercent}%` }} /></div><input aria-label={`Progress for ${item.skill}`} type="range" min="0" max="100" step="10" value={item.progressPercent} disabled={updating === item._id || item.status === 'Verified'} onChange={e => update(item._id, Number(e.target.value))} className="w-full mt-3 accent-indigo-600" /></div></div><div className="grid md:grid-cols-2 gap-3 mt-5">{(item.resources || []).map(resource => <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 flex items-center justify-between"><span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-indigo-600" /><span><span className="block text-xs font-bold">{resource.title}</span><span className="block text-[10px] text-slate-400 mt-0.5">{resource.type}</span></span></span><ExternalLink className="w-3.5 h-3.5 text-slate-400" /></a>)}</div>{item.status !== 'Verified' && <div className="mt-4 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-indigo-600" /><span className="text-[10px] font-bold text-slate-500">Complete the roadmap, then take the matching assessment to verify this skill.</span><ArrowRight className="w-3.5 h-3.5 text-slate-400" /></div>}{item.status === 'Verified' && <div className="mt-4 text-[10px] font-bold text-emerald-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Learning milestone verified through assessment.</div>}</div>)}</div>}
  </div>;
}
