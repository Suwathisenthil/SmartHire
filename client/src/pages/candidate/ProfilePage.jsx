import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  Check,
  Save,
  AlertCircle
} from 'lucide-react';
import SkillChip from '../../components/common/SkillChip';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ProfilePage() {
  const { user, updateUser, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Skill input
  const [newSkill, setNewSkill] = useState('');

  // Modals for adding experience/education/certifications
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);

  // Form states for modals
  const [expForm, setExpForm] = useState({ title: '', company: '', location: '', years: 1, description: '' });
  const [eduForm, setEduForm] = useState({ degree: '', fieldOfStudy: '', institution: '', startYear: 2020, endYear: 2024, grade: '' });
  const [certForm, setCertForm] = useState({ name: '', issuingOrganization: '', credentialUrl: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/profile');
      if (res.data.success) {
        setProfile(res.data.data.user);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBasicChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveBasicProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await api.put('/users/profile', {
        name: profile.name,
        headline: profile.headline,
        bio: profile.bio,
        location: profile.location,
        phone: profile.phone,
        totalExperienceYears: profile.totalExperienceYears
      });

      if (res.data.success) {
        setMessage('Profile updated successfully');
        updateUser(res.data.data.user);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  // Add Skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    const trimmed = newSkill.trim();
    if (profile.skills?.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setNewSkill('');
      return;
    }

    const updatedSkills = [...(profile.skills || []), trimmed];
    try {
      const res = await api.put('/users/profile', { skills: updatedSkills });
      if (res.data.success) {
        setProfile(res.data.data.user);
        updateUser({ skills: res.data.data.user.skills });
        setNewSkill('');
      }
    } catch (err) {
      console.error('Error adding skill:', err);
    }
  };

  // Remove Skill
  const handleRemoveSkill = async (skillToRemove) => {
    const updatedSkills = profile.skills.filter(s => s !== skillToRemove);
    try {
      const res = await api.put('/users/profile', { skills: updatedSkills });
      if (res.data.success) {
        setProfile(res.data.data.user);
        updateUser({ skills: res.data.data.user.skills });
      }
    } catch (err) {
      console.error('Error removing skill:', err);
    }
  };

  // Experience Handlers
  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/experience', expForm);
      if (res.data.success) {
        setProfile(prev => ({
          ...prev,
          experience: res.data.data.experience,
          totalExperienceYears: res.data.data.totalExperienceYears
        }));
        setExpModalOpen(false);
        setExpForm({ title: '', company: '', location: '', years: 1, description: '' });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteExperience = async (expId) => {
    try {
      const res = await api.delete(`/users/experience/${expId}`);
      if (res.data.success) {
        setProfile(prev => ({
          ...prev,
          experience: res.data.data.experience,
          totalExperienceYears: res.data.data.totalExperienceYears
        }));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Education Handlers
  const handleAddEducation = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/education', eduForm);
      if (res.data.success) {
        setProfile(prev => ({ ...prev, education: res.data.data.education }));
        setEduModalOpen(false);
        setEduForm({ degree: '', fieldOfStudy: '', institution: '', startYear: 2020, endYear: 2024, grade: '' });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteEducation = async (eduId) => {
    try {
      const res = await api.delete(`/users/education/${eduId}`);
      if (res.data.success) {
        setProfile(prev => ({ ...prev, education: res.data.data.education }));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Certification Handlers
  const handleAddCert = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/certifications', certForm);
      if (res.data.success) {
        setProfile(prev => ({ ...prev, certifications: res.data.data.certifications }));
        setCertModalOpen(false);
        setCertForm({ name: '', issuingOrganization: '', credentialUrl: '' });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCert = async (certId) => {
    try {
      const res = await api.delete(`/users/certifications/${certId}`);
      if (res.data.success) {
        setProfile(prev => ({ ...prev, certifications: res.data.data.certifications }));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading || !profile) return <LoadingSpinner fullScreen text="Loading profile details..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Candidate Profile & Credentials
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Your profile data directly influences the deterministic matching engine.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Basic Info Form */}
      <form onSubmit={saveBasicProfile} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Personal & Professional Overview</span>
          </h3>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name || ''}
              onChange={handleBasicChange}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Professional Headline</label>
            <input
              type="text"
              name="headline"
              value={profile.headline || ''}
              onChange={handleBasicChange}
              placeholder="e.g. Senior MERN Developer | React Specialist"
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={profile.location || ''}
              onChange={handleBasicChange}
              placeholder="e.g. Bangalore, Karnataka"
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={profile.phone || ''}
              onChange={handleBasicChange}
              placeholder="+91 9876543210"
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Total Experience (Years)</label>
            <input
              type="number"
              step="0.5"
              name="totalExperienceYears"
              value={profile.totalExperienceYears || 0}
              onChange={handleBasicChange}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-semibold text-slate-700 block mb-1">Bio / Executive Summary</label>
            <textarea
              rows="3"
              name="bio"
              value={profile.bio || ''}
              onChange={handleBasicChange}
              placeholder="Brief summary of your skills, achievements, and career focus..."
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </form>

      {/* Skills Manager Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Verified Skills ({profile.skills?.length || 0})</h3>
            <p className="text-xs text-slate-400">Skills are automatically canonicalized before matching</p>
          </div>
        </div>

        {/* Add Skill Input */}
        <form onSubmit={handleAddSkill} className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add skill (e.g. React, Docker, Python, AWS)..."
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        {/* Skill Chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {profile.skills?.map((skill, idx) => (
            <SkillChip
              key={idx}
              skill={skill}
              variant="neutral"
              onRemove={handleRemoveSkill}
            />
          ))}
        </div>
      </div>

      {/* Experience History Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>Work Experience ({profile.experience?.length || 0})</span>
          </h3>
          <button
            onClick={() => setExpModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Experience</span>
          </button>
        </div>

        <div className="space-y-3">
          {profile.experience?.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">No work experience listed yet.</p>
          ) : (
            profile.experience?.map((exp) => (
              <div key={exp._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm">{exp.title}</h4>
                  <p className="font-medium text-slate-600">{exp.company} • {exp.location || 'India'}</p>
                  <p className="text-[11px] text-slate-400">{exp.years} years duration</p>
                  {exp.description && <p className="text-slate-600 text-[11px] pt-1">{exp.description}</p>}
                </div>
                <button
                  onClick={() => handleDeleteExperience(exp._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Education History Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Education Degrees ({profile.education?.length || 0})</span>
          </h3>
          <button
            onClick={() => setEduModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Education</span>
          </button>
        </div>

        <div className="space-y-3">
          {profile.education?.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">No education records added yet.</p>
          ) : (
            profile.education?.map((edu) => (
              <div key={edu._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm">{edu.degree}</h4>
                  <p className="font-medium text-slate-600">{edu.institution} {edu.fieldOfStudy ? `(${edu.fieldOfStudy})` : ''}</p>
                  <p className="text-[11px] text-slate-400">Class of {edu.endYear || 'N/A'} {edu.grade ? `• Grade: ${edu.grade}` : ''}</p>
                </div>
                <button
                  onClick={() => handleDeleteEducation(edu._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Certifications Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Certifications ({profile.certifications?.length || 0})</span>
          </h3>
          <button
            onClick={() => setCertModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Certification</span>
          </button>
        </div>

        <div className="space-y-3">
          {profile.certifications?.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">No certifications added yet.</p>
          ) : (
            profile.certifications?.map((c) => (
              <div key={c._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4">
                <div className="space-y-0.5 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                  <p className="font-medium text-slate-600">{c.issuingOrganization}</p>
                </div>
                <button
                  onClick={() => handleDeleteCert(c._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Experience Modal */}
      <Modal isOpen={expModalOpen} onClose={() => setExpModalOpen(false)} title="Add Work Experience">
        <form onSubmit={handleAddExperience} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Job Title</label>
            <input
              type="text"
              required
              value={expForm.title}
              onChange={e => setExpForm({ ...expForm, title: e.target.value })}
              placeholder="e.g. Software Engineer"
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Company</label>
              <input
                type="text"
                required
                value={expForm.company}
                onChange={e => setExpForm({ ...expForm, company: e.target.value })}
                placeholder="Company name"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Duration (Years)</label>
              <input
                type="number"
                step="0.5"
                required
                value={expForm.years}
                onChange={e => setExpForm({ ...expForm, years: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Key Responsibilities / Tech Stack</label>
            <textarea
              rows="3"
              value={expForm.description}
              onChange={e => setExpForm({ ...expForm, description: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold">
            Add Experience Record
          </button>
        </form>
      </Modal>

      {/* Add Education Modal */}
      <Modal isOpen={eduModalOpen} onClose={() => setEduModalOpen(false)} title="Add Education Degree">
        <form onSubmit={handleAddEducation} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Degree Title</label>
            <input
              type="text"
              required
              value={eduForm.degree}
              onChange={e => setEduForm({ ...eduForm, degree: e.target.value })}
              placeholder="e.g. B.Tech in Computer Science, MCA, B.Sc"
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Institution / University</label>
            <input
              type="text"
              required
              value={eduForm.institution}
              onChange={e => setEduForm({ ...eduForm, institution: e.target.value })}
              placeholder="University or College name"
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Passout Year</label>
              <input
                type="number"
                value={eduForm.endYear}
                onChange={e => setEduForm({ ...eduForm, endYear: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Grade / CGPA</label>
              <input
                type="text"
                value={eduForm.grade}
                onChange={e => setEduForm({ ...eduForm, grade: e.target.value })}
                placeholder="e.g. 8.5 CGPA"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold">
            Add Education Record
          </button>
        </form>
      </Modal>

      {/* Add Certification Modal */}
      <Modal isOpen={certModalOpen} onClose={() => setCertModalOpen(false)} title="Add Certification">
        <form onSubmit={handleAddCert} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Certification Name</label>
            <input
              type="text"
              required
              value={certForm.name}
              onChange={e => setCertForm({ ...certForm, name: e.target.value })}
              placeholder="e.g. AWS Certified Solutions Architect"
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Issuing Body</label>
            <input
              type="text"
              value={certForm.issuingOrganization}
              onChange={e => setCertForm({ ...certForm, issuingOrganization: e.target.value })}
              placeholder="e.g. Amazon Web Services, Oracle, Google"
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold">
            Add Certification
          </button>
        </form>
      </Modal>
    </div>
  );
}
