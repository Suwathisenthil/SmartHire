const express = require('express');
const router = express.Router();
const {
  createCompany,
  getMyCompany,
  updateCompany,
  getAllCompanies,
  getCompanyById
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllCompanies);
router.get('/my', protect, authorize('employer'), getMyCompany);
router.get('/:id', getCompanyById);
router.post('/', protect, authorize('employer'), createCompany);
router.put('/:id', protect, authorize('employer', 'admin'), updateCompany);

module.exports = router;
