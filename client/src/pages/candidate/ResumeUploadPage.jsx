import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trash2,
  Plus,
  Layers,
  Eye,
  FileCheck
} from 'lucide-react';
import SkillChip from '../../components/common/SkillChip';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ResumeUploadPage() {
  const { user, refreshUser } = useAuth();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Editing skills extracted from resume
  const [skillsList, setSkillsList] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [showRawText, setShowRawText] = useState(false);

  useEffect(() => {
    fetchCurrentResume();
  }, []);

  const fetchCurrentResume = async () => {
    try {
      setLoading(true);
      const res = await api.get('/resumes/my');
      if (res.data.success && res.data.data.resume) {
        const resObj = res.data.data.resume;
        setResumeData(resObj);
        setSkillsList(resObj.extractedSkills || []);
      }
    } catch (err) {
      console.error('Failed to load current resume:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File exceeds the 5MB size limit.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setResumeData(res.data.data.resume);
        setSkillsList(res.data.data.extractedSkills || []);
        setSuccessMsg('Resume parsed and skills detected successfully!');
        await refreshUser();
      }
    } catch (err) {
      setError(err.message || 'Failed to upload and parse resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    const updated = Array.from(new Set([...skillsList, newSkill.trim()]));
    setSkillsList(updated);
    setNewSkill('');

    try {
      await api.put('/resumes/skills', { skills: updated });
      await refreshUser();
    } catch (err) {
      console.error('Error saving skills:', err);
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const updated = skillsList.filter(s => s !== skillToRemove);
    setSkillsList(updated);

    try {
      await api.put('/resumes/skills', { skills: updated });
      await refreshUser();
    } catch (err) {
      console.error('Error removing skill:', err);
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to remove your uploaded resume?')) return;
    try {
      await api.delete('/resumes/my');
      setResumeData(null);
      setSkillsList([]);
      setSuccessMsg('Resume deleted');
      await refreshUser();
    } catch (err) {
      setError(err.message || 'Failed to delete resume');
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Checking resume status..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Resume Upload & Skill Extraction Engine
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Our local deterministic parser inspects PDF/DOCX text, normalizes skills, and powers your job match scores.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Dropzone Box */}
      <div className="p-8 rounded-3xl bg-white border-2 border-dashed border-slate-200 hover:border-indigo-400 transition text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">
            {resumeData ? 'Upload New Resume to Re-parse' : 'Upload your Resume'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Supports PDF and DOCX files up to 5MB. Parsed locally on your machine with zero external AI APIs.
          </p>
        </div>

        <div className="pt-2">
          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer">
            <FileText className="w-4 h-4" />
            <span>{uploading ? 'Parsing Resume Locally...' : 'Choose PDF / DOCX File'}</span>
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Current Resume Card */}
      {resumeData && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{resumeData.originalFilename}</h4>
                <p className="text-xs text-slate-400">
                  Uploaded on {new Date(resumeData.uploadDate).toLocaleDateString()} • {(resumeData.fileSize / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowRawText(!showRawText)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showRawText ? 'Hide Text' : 'Preview Extracted Text'}</span>
              </button>
              <button
                type="button"
                onClick={handleDeleteResume}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Parsed Metadata Hints */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50">
              <span className="text-slate-400 block mb-0.5">Detected Experience</span>
              <span className="font-bold text-slate-800">
                {resumeData.parsedDetails?.experienceYears > 0
                  ? `${resumeData.parsedDetails.experienceYears} Years`
                  : 'Fresher / Not specified'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50">
              <span className="text-slate-400 block mb-0.5">Degree Mentions</span>
              <span className="font-bold text-slate-800 truncate block">
                {resumeData.parsedDetails?.degreeHints?.join(', ') || 'Degree listed'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50">
              <span className="text-slate-400 block mb-0.5">Extracted Skills</span>
              <span className="font-bold text-indigo-600">{skillsList.length} skills identified</span>
            </div>
          </div>

          {/* Extracted Skills Management */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Extracted & Verified Skills ({skillsList.length})
                </h4>
                <p className="text-xs text-slate-500">
                  Review and refine your skills below. You can delete incorrect tags or add missing skills.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                placeholder="Add missing skill (e.g. React, Express.js, Docker)..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
              {skillsList.map((skill, idx) => (
                <SkillChip
                  key={idx}
                  skill={skill}
                  variant="matched"
                  onRemove={handleRemoveSkill}
                />
              ))}
            </div>
          </div>

          {/* Raw Text Preview Accordion */}
          {showRawText && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h5 className="text-xs font-bold text-slate-700 uppercase">Raw Extracted Document Text</h5>
              <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono max-h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {resumeData.extractedText || 'No text extracted.'}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
