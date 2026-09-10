import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import SkillChip from '../../components/common/SkillChip';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { WORK_MODES, JOB_TYPES } from '../../utils/constants';

export default function EditJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    workMode: 'Hybrid',
    jobType: 'Full Time',
    requiredExperience: 0,
    education: '',
    salaryMin: 0,
    salaryMax: 0,
    salaryPeriod: 'per year',
    deadline: '',
    status: 'Active'
  });

  const [requiredSkills, setRequiredSkills] = useState([]);
  const [preferredSkills, setPreferredSkills] = useState([]);
  const [reqInput, setReqInput] = useState('');
  const [prefInput, setPrefInput] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/jobs/${id}`);
      if (res.data.success) {
        const j = res.data.data.job;
        setForm({
          title: j.title || '',
          description: j.description || '',
          location: j.location || '',
          workMode: j.workMode || 'Hybrid',
          jobType: j.jobType || 'Full Time',
          requiredExperience: j.requiredExperience || 0,
          education: j.education || '',
          salaryMin: j.salary?.min || 0,
          salaryMax: j.salary?.max || 0,
          salaryPeriod: j.salary?.period || 'per year',
          deadline: j.deadline ? new Date(j.deadline).toISOString().split('T')[0] : '',
          status: j.status || 'Active'
        });
        setRequiredSkills(j.requiredSkills || []);
        setPreferredSkills(j.preferredSkills || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch job');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReq = (e) => {
    e.preventDefault();
    if (!reqInput.trim()) return;
    if (!requiredSkills.includes(reqInput.trim())) {
      setRequiredSkills([...requiredSkills, reqInput.trim()]);
    }
    setReqInput('');
  };

  const handleAddPref = (e) => {
    e.preventDefault();
    if (!prefInput.trim()) return;
    if (!preferredSkills.includes(prefInput.trim())) {
      setPreferredSkills([...preferredSkills, prefInput.trim()]);
    }
    setPrefInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await api.put(`/jobs/${id}`, {
        ...form,
        requiredSkills,
        preferredSkills,
        salary: {
          min: Number(form.salaryMin),
          max: Number(form.salaryMax),
          currency: 'INR',
          period: form.salaryPeriod
        }
      });

      if (res.data.success) {
        navigate('/employer/jobs');
      }
    } catch (err) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading job posting..." />;

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
            Edit Job Opening
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Update role specifications, skill requirements, or status.
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Job Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Description</label>
            <textarea
              rows="5"
              required
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <label className="font-semibold text-slate-700 block mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Required Skills */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="font-bold text-slate-900 text-xs uppercase block">Required Core Skills</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={reqInput}
              onChange={e => setReqInput(e.target.value)}
              placeholder="Add required skill..."
              className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs"
            />
            <button
              type="button"
              onClick={handleAddReq}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {requiredSkills.map((s, idx) => (
              <SkillChip
                key={idx}
                skill={s}
                variant="neutral"
                onRemove={item => setRequiredSkills(requiredSkills.filter(x => x !== item))}
              />
            ))}
          </div>
        </div>

        {/* Preferred Skills */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="font-bold text-slate-900 text-xs uppercase block">Preferred Bonus Skills</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={prefInput}
              onChange={e => setPrefInput(e.target.value)}
              placeholder="Add preferred skill..."
              className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs"
            />
            <button
              type="button"
              onClick={handleAddPref}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferredSkills.map((s, idx) => (
              <SkillChip
                key={idx}
                skill={s}
                variant="preferred"
                onRemove={item => setPreferredSkills(preferredSkills.filter(x => x !== item))}
              />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/employer/jobs')}
            className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Update Job Posting'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
