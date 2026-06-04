import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
      unique: true,
    },

    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },

    image: {
      type: String,
      default: null,
      // Format: 'projects/filename.ext' ou URL complète
    },

    link: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Link must be a valid URL'],
    },

    repositoryLink: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Repository link must be a valid URL'],
    },

    skillIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],

    position: {
      type: Number,
      default: 0,
      min: 0,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    category: {
      type: String,
      enum: ['web', 'mobile', 'desktop', 'other'],
      default: 'web',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
projectSchema.index({ title: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ isPublished: 1, position: 1 });

// Virtual pour l'URL complète de l'image
projectSchema.virtual('imageUrl').get(function () {
  if (!this.image) return null;
  if (this.image.startsWith('http')) return this.image;
  return `/uploads/${this.image}`;
});

// Middleware pré-save pour validation
projectSchema.pre('save', async function (next) {
  // Vérifier l'unicité du titre (sauf lors de la mise à jour du même document)
  if (this.isModified('title')) {
    const existing = await mongoose.model('Project').findOne({
      title: this.title,
      _id: { $ne: this._id },
    });
    if (existing) {
      throw new Error('A project with this title already exists');
    }
  }
  next();
});

export default mongoose.model('Project', projectSchema);
