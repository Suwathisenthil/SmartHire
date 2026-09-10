import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Briefcase, Plus, X, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import SkillChip from '../../components/common/SkillChip';
import { WORK_MODES, JOB_TYPES } from '../../utils/constants';

export default function CreateJobPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: 'Bangalore, Karnataka',
    workMode: 'Hybrid',
    jobType: 'Full Time',
    requiredExperience: 2,
    education: "Bachelor's Degree in CS, IT or equivalent",
    salaryMin: 800000,
    salaryMax: 1500000,
    salaryPeriod: 'per year',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const [requiredSkills, setRequiredSkills] = useState(['React', 'Node.js', 'MongoDB']);
  const [preferredSkills, setPreferredSkills] = useState(['Docker', 'AWS']);
  const [reqInput, setReqInput] = useState('');
  const [prefInput, setPrefInput] = useState('');

  const handleAddReqSkill = (e) => {
    e.preventDefault();
    if (!reqInput.trim()) return;
    if (!requiredSkills.includes(reqInput.trim())) {
      setRequiredSkills([...requiredSkills, reqInput.trim()]);
    }
    setReqInput('');
  };

  const handleAddPrefSkill = (e) => {
    e.preventDefault();
    if (!prefInput.trim()) return;
    if (!preferredSkills.includes(prefInput.trim())) {
      setPreferredSkills([...preferredSkills, prefInput.trim()]);
    }
    setPrefInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (requiredSkills.length === 0) {
      setError('Please provide at least one required skill.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/jobs', {
        title: form.title,
        description: form.description,
        location: form.location,
        workMode: form.workMode,
        jobType: form.jobType,
        requiredExperience: Number(form.requiredExperience),
        education: form.education,
        requiredSkills,
        preferredSkills,
        salary: {
          min: Number(form.salaryMin),
          max: Number(form.salaryMax),
          currency: 'INR',
          period: form.salaryPeriod
        },
        deadline: new Date(form.deadline)
      });

      if (res.data.success) {
        navigate('/employer/jobs');
      }
    } catch (err) {
      setError(err.message || 'Failed to create job posting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/employer/jobs')}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Post a New Job Opportunity
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure role requirements, skill weights, and compensation specifications.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Job Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Senior MERN Stack Developer"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Job Description</label>
            <textarea
              rows="5"
              required
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Detail key responsibilities, deliverables, team structure, and technical environment..."
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Job Type</label>
              <select
                value={form.jobType}
                onChange={e => setForm({ ...form, jobType: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Work Mode</label>
              <select
                value={form.workMode}
                onChange={e => setForm({ ...form, workMode: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                {WORK_MODES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Location</label>
              <input
                type="text"
                required
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Minimum Experience (Years)</label>
              <input
                type="number"
                min="0"
                required
                value={form.requiredExperience}
                onChange={e => setForm({ ...form, requiredExperience: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Educational Qualification</label>
              <input
                type="text"
                value={form.education}
                onChange={e => setForm({ ...form, education: e.target.value })}
                placeholder="e.g. B.Tech / BE in CSE or equivalent"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Salary Min (INR)</label>
              <input
                type="number"
                value={form.salaryMin}
                onChange={e => setForm({ ...form, salaryMin: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Salary Max (INR)</label>
              <input
                type="number"
                value={form.salaryMax}
                onChange={e => setForm({ ...form, salaryMax: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Application Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Required Skills Tag Input */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div>
            <label className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
              Required Core Skills (Used for 60% Match Weight)
            </label>
            <p className="text-[11px] text-slate-400">Candidates lacking these skills will lose proportional match points.</p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={reqInput}
              onChange={e => setReqInput(e.target.value)}
              placeholder="Type required skill (e.g. React, Node.js, MongoDB) and press Add..."
              className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs"
            />
            <button
              type="button"
              onClick={handleAddReqSkill}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
            >
              Add Skill
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {requiredSkills.map((s, idx) => (
              <SkillChip
                key={idx}
                skill={s}
                variant="neutral"
                onRemove={(skill) => setRequiredSkills(requiredSkills.filter(item => item !== skill))}
              />
            ))}
          </div>
        </div>

        {/* Preferred Skills Tag Input */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div>
            <label className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
              Preferred Bonus Skills (Optional)
            </label>
            <p className="text-[11px] text-slate-400">Provides additional match bonus score (up to 10 bonus points).</p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={prefInput}
              onChange={e => setPrefInput(e.target.value)}
              placeholder="Type preferred skill (e.g. Docker, AWS, Redux)..."
              className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs"
            />
            <button
              type="button"
              onClick={handleAddPrefSkill}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Add Bonus Skill
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {preferredSkills.map((s, idx) => (
              <SkillChip
                key={idx}
                skill={s}
                variant="preferred"
                onRemove={(skill) => setPreferredSkills(preferredSkills.filter(item => item !== skill))}
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/employer/jobs')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Publishing...' : 'Publish Job Opening'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
