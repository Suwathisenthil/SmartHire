import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import AboutPage from './pages/public/AboutPage';
import PublicJobsPage from './pages/public/PublicJobsPage';
import JobDetailsPage from './pages/public/JobDetailsPage';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import ProfilePage from './pages/candidate/ProfilePage';
import ResumeUploadPage from './pages/candidate/ResumeUploadPage';
import RecommendedJobsPage from './pages/candidate/RecommendedJobsPage';
import MyApplicationsPage from './pages/candidate/MyApplicationsPage';
import SkillGapPage from './pages/candidate/SkillGapPage';
import CandidateInterviewsPage from './pages/candidate/CandidateInterviewsPage';
import AssessmentsPage from './pages/candidate/AssessmentsPage';
import LearningRoadmapPage from './pages/candidate/LearningRoadmapPage';

// Employer Pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import CompanyProfilePage from './pages/employer/CompanyProfilePage';
import ManageJobsPage from './pages/employer/ManageJobsPage';
import CreateJobPage from './pages/employer/CreateJobPage';
import EditJobPage from './pages/employer/EditJobPage';
import JobApplicantsPage from './pages/employer/JobApplicantsPage';
import EmployerInterviewsPage from './pages/employer/EmployerInterviewsPage';
import EmployerAnalyticsPage from './pages/employer/EmployerAnalyticsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCompaniesPage from './pages/admin/AdminCompaniesPage';
import AdminJobsPage from './pages/admin/AdminJobsPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';

// Common Pages
import NotificationsPage from './pages/common/NotificationsPage';
import SettingsPage from './pages/common/SettingsPage';
import NotFoundPage from './pages/common/NotFoundPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              {/* Public Routes with MainLayout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/jobs" element={<PublicJobsPage />} />
                <Route path="/jobs/:id" element={<JobDetailsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Candidate Portal Routes */}
              <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
                  <Route path="/candidate/profile" element={<ProfilePage />} />
                  <Route path="/candidate/resume" element={<ResumeUploadPage />} />
                  <Route path="/candidate/recommendations" element={<RecommendedJobsPage />} />
                  <Route path="/candidate/applications" element={<MyApplicationsPage />} />
                  <Route path="/candidate/skill-gap" element={<SkillGapPage />} />
                  <Route path="/candidate/learning" element={<LearningRoadmapPage />} />
                  <Route path="/candidate/assessments" element={<AssessmentsPage />} />
                  <Route path="/candidate/interviews" element={<CandidateInterviewsPage />} />
                </Route>
              </Route>

              {/* Employer Portal Routes */}
              <Route element={<ProtectedRoute allowedRoles={['employer', 'admin']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/employer/dashboard" element={<EmployerDashboard />} />
                  <Route path="/employer/company" element={<CompanyProfilePage />} />
                  <Route path="/employer/jobs" element={<ManageJobsPage />} />
                  <Route path="/employer/jobs/create" element={<CreateJobPage />} />
                  <Route path="/employer/jobs/:id/edit" element={<EditJobPage />} />
                  <Route path="/employer/jobs/:id/applicants" element={<JobApplicantsPage />} />
                  <Route path="/employer/interviews" element={<EmployerInterviewsPage />} />
                  <Route path="/employer/analytics" element={<EmployerAnalyticsPage />} />
                </Route>
              </Route>

              {/* Admin Portal Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                  <Route path="/admin/companies" element={<AdminCompaniesPage />} />
                  <Route path="/admin/jobs" element={<AdminJobsPage />} />
                  <Route path="/admin/applications" element={<AdminApplicationsPage />} />
                  <Route path="/admin/reports" element={<AdminDashboard />} />
                </Route>
              </Route>

              {/* Common Authenticated Routes */}
              <Route element={<ProtectedRoute allowedRoles={['candidate', 'employer', 'admin']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>

              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
