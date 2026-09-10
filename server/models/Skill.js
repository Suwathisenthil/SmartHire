const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Programming',
        'Frontend',
        'Backend',
        'Database',
        'Cloud / DevOps',
        'Data / AI',
        'Mobile',
        'Testing & Tools',
        'Other'
      ],
      default: 'Other',
    },
    aliases: [{
      type: String,
      trim: true,
    }],
    demandCount: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
