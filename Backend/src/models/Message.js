import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email',
      ],
    },

    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      minlength: [5, 'Subject must be at least 5 characters'],
      maxlength: [100, 'Subject cannot exceed 100 characters'],
    },

    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },

    status: {
      type: String,
      enum: ['unread', 'read', 'archived', 'replied'],
      default: 'unread',
    },

    reply: {
      type: String,
      default: null,
      maxlength: [5000, 'Reply cannot exceed 5000 characters'],
    },

    isSpam: {
      type: Boolean,
      default: false,
    },

    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    readAt: {
      type: Date,
      default: null,
    },

    repliedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
messageSchema.index({ email: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ status: 1 });
messageSchema.index({ isSpam: 1 });

// Middleware pré-save
messageSchema.pre('save', async function (next) {
  // Mettre à jour readAt si status passe à 'read'
  if (this.isModified('status') && this.status === 'read' && !this.readAt) {
    this.readAt = new Date();
  }

  // Mettre à jour repliedAt si une réponse est ajoutée
  if (this.isModified('reply') && this.reply && !this.repliedAt) {
    this.repliedAt = new Date();
    this.status = 'replied';
  }

  next();
});

export default mongoose.model('Message', messageSchema);
