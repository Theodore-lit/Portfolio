import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
      unique: true,
      lowercase: true,
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['frontend', 'backend', 'database', 'devops', 'mobile', 'other'],
    },

    icon: {
      type: String,
      default: null,
      // Format: 'skills/filename.ext' ou URL CDN (ex: Font Awesome, Simple Icons)
    },

    iconUrl: {
      type: String,
      default: null,
      // URL externe pour les icons (ex: https://cdn.simpleicons.org/react)
      match: [/^https?:\/\/.+/, 'Icon URL must be a valid URL'],
    },

    proficiency: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 3,
      // 1: Novice, 2: Beginner, 3: Intermediate, 4: Advanced, 5: Expert
    },

    position: {
      type: Number,
      default: 0,
      min: 0,
    },

    yearsOfExperience: {
      type: Number,
      default: 0,
      min: 0,
    },

    isHidden: {
      type: Boolean,
      default: false,
    },

    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
skillSchema.index({ category: 1, position: 1 });
skillSchema.index({ name: 1 });
skillSchema.index({ createdAt: -1 });

// Virtual pour le chemin complet de l'icon
skillSchema.virtual('imageUrl').get(function () {
  if (this.iconUrl) return this.iconUrl;
  if (!this.icon) return null;
  if (this.icon.startsWith('http')) return this.icon;
  return `/uploads/${this.icon}`;
});

// Virtual pour le label de proficiency
skillSchema.virtual('proficiencyLabel').get(function () {
  const labels = {
    1: 'Novice',
    2: 'Beginner',
    3: 'Intermediate',
    4: 'Advanced',
    5: 'Expert',
  };
  return labels[this.proficiency];
});

// Middleware pré-save
skillSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    const existing = await mongoose.model('Skill').findOne({
      name: this.name.toLowerCase(),
      _id: { $ne: this._id },
    });
    if (existing) {
      throw new Error('A skill with this name already exists');
    }
  }
  next();
});

export default mongoose.model('Skill', skillSchema);
