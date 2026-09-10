const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true }, // e.g., 'B.Tech', 'M.Tech', 'B.Sc', 'MCA'
  fieldOfStudy: { type: String, default: '' }, // e.g., 'Computer Science & Engineering'
  institution: { type: String, required: true },
  startYear: { type: Number },
  endYear: { type: Number },
  grade: { type: String, default: '' }
}, { _id: true });

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: '' },
  startDate: { type: Date },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String, default: '' },
  years: { type: Number, default: 0 }
}, { _id: true });

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuingOrganization: { type: String, default: '' },
  issueDate: { type: Date },
  credentialUrl: { type: String, default: '' }
}, { _id: true });

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password by default
    },
    role: {
      type: String,
      enum: ['candidate', 'employer', 'admin'],
      default: 'candidate',
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    headline: {
      type: String,
      default: '',
      maxlength: [150, 'Headline cannot exceed 150 characters'],
    },
    bio: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    // For Candidates
    skills: [{
      type: String,
      trim: true,
    }],
    experience: [experienceSchema],
    totalExperienceYears: {
      type: Number,
      default: 0,
      min: 0,
    },
    education: [educationSchema],
    certifications: [certificationSchema],
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
    // For Employers
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    // Moderation & Status
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove sensitive info on JSON transform
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
