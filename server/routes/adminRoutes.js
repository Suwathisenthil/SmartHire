const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllCompanies,
  updateCompanyStatus,
  getAllJobs,
  updateJobStatus,
  getAllApplications
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

router.get('/companies', getAllCompanies);
router.put('/companies/:id/status', updateCompanyStatus);

router.get('/jobs', getAllJobs);
router.put('/jobs/:id/status', updateJobStatus);

router.get('/applications', getAllApplications);

module.exports = router;
