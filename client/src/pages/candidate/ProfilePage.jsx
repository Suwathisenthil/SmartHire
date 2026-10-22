import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  AlertCircle,
  FileText,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Camera
} from 'lucide-react';
import SkillChip from '../../components/common/SkillChip';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verifiedSkills, setVerifiedSkills] = useState([]);
  const [photoUploading, setPhotoUploading] = useState(false);

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
    loadVerifiedSkills();
  }, []);

  const loadVerifiedSkills = async () => {
    try {
      const res = await api.get('/assessments/verified-skills');
      if (res.data.success) setVerifiedSkills(res.data.data.skills || []);
    } catch (err) {
      console.error('Error loading verified skills:', err);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const res = await api.post('/users/profile/photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.success) {
        setProfile(prev => ({ ...prev, profileImage: res.data.data.profileImage }));
        updateUser({ profileImage: res.data.data.profileImage });
        setMessage('Profile photo updated successfully');
      }
    } catch (err) {
      setError(err.message || 'Failed to upload profile photo.');
    } finally {
      setPhotoUploading(false);
      e.target.value = '';
    }
  };

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
        setMessage('Profile overview updated successfully');
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

  if (loading || !profile) {
    return <LoadingSpinner text="Loading candidate intelligence profile..." fullScreen />;
  }

  // Calculate Profile Completeness Score
  let score = 20; // default for having created account
  if (profile.name && profile.email) score += 10;
  if (profile.headline) score += 10;
  if (profile.bio) score += 10;
  if (profile.location) score += 5;
  if (profile.phone) score += 5;
  if (profile.skills && profile.skills.length >= 3) score += 15;
  if (profile.experience && profile.experience.length >= 1) score += 10;
  if (profile.education && profile.education.length >= 1) score += 5;
  if (profile.resume) score += 10;
  const completeness = Math.min(100, score);

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* 1. Header with Visual Profile Completeness Indicator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt={`${profile.name} profile`} className="w-full h-full object-cover" />
              ) : (
                profile.name?.charAt(0).toUpperCase()
              )}
            </div>
            <label className="absolute -right-2 -bottom-2 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center cursor-pointer hover:text-indigo-600" title="Change profile photo">
              <Camera className="w-3.5 h-3.5" />
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoUpload} disabled={photoUploading} className="hidden" />
            </label>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{profile.name}</h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                Candidate DNA
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {profile.headline || 'Software Developer & Engineering Candidate'}
            </p>
          </div>
        </div>

        {/* PROFILE COMPLETENESS Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 w-full md:w-64 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300">Profile Completeness</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{completeness}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${completeness}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            {completeness >= 85 ? 'Profile fully ready for recruiter discovery' : 'Add remaining sections to reach 100%'}
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {verifiedSkills.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Skill Scores</h2>
              <p className="text-xs text-slate-500 mt-1">Scores are recorded only after a backend-scored assessment is passed.</p>
            </div>
            <Link to="/candidate/assessments" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Take another assessment →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {verifiedSkills.map(skill => (
              <div key={skill._id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{skill.skill}</p>
                <p className="text-lg font-black text-emerald-600 mt-1">{skill.score}%</p>
                <p className="text-[10px] text-slate-400">{skill.level} · Verified</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. SKILL DNA SECTION (Prominent Visual Focus) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white">SKILL DNA</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                {profile.skills?.length || 0} Verified Skills
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Deterministic matching analyzes these skills against open job taxonomies
            </p>
          </div>

          {/* Quick Add Skill Input */}
          <form onSubmit={handleAddSkill} className="flex items-center gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g. Docker, TypeScript"
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Skill Chips Grid */}
        <div className="flex flex-wrap gap-2.5 pt-2">
          {profile.skills && profile.skills.length > 0 ? (
            profile.skills.map((skill, index) => (
              <SkillChip
                key={index}
                skill={skill}
                variant="neutral"
                onRemove={handleRemoveSkill}
                size="md"
              />
            ))
          ) : (
            <div className="py-6 text-slate-400 dark:text-slate-500 text-xs italic">
              No skills registered yet. Add your technical proficiencies above or upload a resume to automatically extract them.
            </div>
          )}
        </div>
      </div>

      {/* 3. PROFILE OVERVIEW Form */}
      <form onSubmit={saveBasicProfile} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">PROFILE OVERVIEW</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Personal contact and professional identity
            </p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Overview'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name || ''}
              onChange={handleBasicChange}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Professional Headline</label>
            <input
              type="text"
              name="headline"
              value={profile.headline || ''}
              onChange={handleBasicChange}
              placeholder="e.g. Full-Stack MERN Specialist"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              disabled
              value={profile.email || ''}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={profile.phone || ''}
              onChange={handleBasicChange}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
            <input
              type="text"
              name="location"
              value={profile.location || ''}
              onChange={handleBasicChange}
              placeholder="Bangalore, India"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Total Experience (Years)</label>
            <input
              type="number"
              name="totalExperienceYears"
              min="0"
              max="50"
              value={profile.totalExperienceYears || 0}
              onChange={handleBasicChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Professional Bio</label>
            <textarea
              name="bio"
              rows="3"
              value={profile.bio || ''}
              onChange={handleBasicChange}
              placeholder="Brief summary of your career focus, technical background, and passion..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </form>

      {/* 4. EXPERIENCE SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>EXPERIENCE</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified work history evaluated for experience scoring (20% weight)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setExpModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Experience</span>
          </button>
        </div>

        <div className="space-y-3">
          {profile.experience && profile.experience.length > 0 ? (
            profile.experience.map((exp) => (
              <div
                key={exp._id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{exp.title}</h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    {exp.company} • {exp.location || 'India'}
                  </p>
                  <p className="text-[11px] text-slate-400">Duration: {exp.years || 1} years</p>
                  {exp.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteExperience(exp._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic py-4">No work experience logged yet.</p>
          )}
        </div>
      </div>

      {/* 5. EDUCATION SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>EDUCATION</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Degree qualification & academic tier evaluated for education matching (10% weight)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEduModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Education</span>
          </button>
        </div>

        <div className="space-y-3">
          {profile.education && profile.education.length > 0 ? (
            profile.education.map((edu) => (
              <div
                key={edu._id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{edu.degree}</h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{edu.institution}</p>
                  <p className="text-[11px] text-slate-400">
                    {edu.fieldOfStudy ? `${edu.fieldOfStudy} • ` : ''}
                    {edu.startYear} - {edu.endYear} {edu.grade ? `(${edu.grade})` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteEducation(edu._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic py-4">No education records added yet.</p>
          )}
        </div>
      </div>

      {/* 6. CERTIFICATIONS SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>CERTIFICATIONS</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified industry credentials (10% weight)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCertModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Certification</span>
          </button>
        </div>

        <div className="space-y-3">
          {profile.certifications && profile.certifications.length > 0 ? (
            profile.certifications.map((cert) => (
              <div
                key={cert._id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{cert.name}</h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{cert.issuingOrganization}</p>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-slate-500 hover:underline flex items-center gap-1 mt-1"
                    >
                      <span>View Credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteCert(cert._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic py-4">No certifications added yet.</p>
          )}
        </div>
      </div>

      {/* 7. RESUME SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>RESUME ATTACHMENT</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Primary resume document parsed for skill extraction and verification
            </p>
          </div>
          <Link
            to="/candidate/resume"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
          >
            Manage Resume Document
          </Link>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {profile.resume?.originalFilename || 'Uploaded Resume'}
              </p>
              <p className="text-[11px] text-slate-400">
                PDF/DOCX format • Local text extraction engine
              </p>
            </div>
          </div>
          <Link
            to="/candidate/resume"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Re-upload →
          </Link>
        </div>
      </div>

      {/* MODALS */}
      {/* Experience Modal */}
      <Modal isOpen={expModalOpen} onClose={() => setExpModalOpen(false)} title="Add Work Experience">
        <form onSubmit={handleAddExperience} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
            <input
              type="text"
              required
              value={expForm.title}
              onChange={e => setExpForm({ ...expForm, title: e.target.value })}
              placeholder="e.g. Frontend Engineer"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company</label>
            <input
              type="text"
              required
              value={expForm.company}
              onChange={e => setExpForm({ ...expForm, company: e.target.value })}
              placeholder="e.g. Acme Tech"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={expForm.location}
                onChange={e => setExpForm({ ...expForm, location: e.target.value })}
                placeholder="Bangalore, India"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Years at Role</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={expForm.years}
                onChange={e => setExpForm({ ...expForm, years: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              rows="3"
              value={expForm.description}
              onChange={e => setExpForm({ ...expForm, description: e.target.value })}
              placeholder="Key responsibilities and achievements..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setExpModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            >
              Save Experience
            </button>
          </div>
        </form>
      </Modal>

      {/* Education Modal */}
      <Modal isOpen={eduModalOpen} onClose={() => setEduModalOpen(false)} title="Add Education">
        <form onSubmit={handleAddEducation} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Degree</label>
            <input
              type="text"
              required
              value={eduForm.degree}
              onChange={e => setEduForm({ ...eduForm, degree: e.target.value })}
              placeholder="e.g. B.Tech Computer Science"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Institution</label>
            <input
              type="text"
              required
              value={eduForm.institution}
              onChange={e => setEduForm({ ...eduForm, institution: e.target.value })}
              placeholder="e.g. University / College Name"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Field of Study</label>
              <input
                type="text"
                value={eduForm.fieldOfStudy}
                onChange={e => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })}
                placeholder="Computer Science & Eng"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Grade / CGPA</label>
              <input
                type="text"
                value={eduForm.grade}
                onChange={e => setEduForm({ ...eduForm, grade: e.target.value })}
                placeholder="e.g. 8.5 CGPA"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEduModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            >
              Save Education
            </button>
          </div>
        </form>
      </Modal>

      {/* Certification Modal */}
      <Modal isOpen={certModalOpen} onClose={() => setCertModalOpen(false)} title="Add Certification">
        <form onSubmit={handleAddCert} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Certificate Name</label>
            <input
              type="text"
              required
              value={certForm.name}
              onChange={e => setCertForm({ ...certForm, name: e.target.value })}
              placeholder="e.g. AWS Certified Solutions Architect"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Issuing Organization</label>
            <input
              type="text"
              required
              value={certForm.issuingOrganization}
              onChange={e => setCertForm({ ...certForm, issuingOrganization: e.target.value })}
              placeholder="e.g. Amazon Web Services"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Credential URL</label>
            <input
              type="url"
              value={certForm.credentialUrl}
              onChange={e => setCertForm({ ...certForm, credentialUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCertModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            >
              Save Certification
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
