// import mongoose from 'mongoose';

// const videoFiles = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 100
//   },
//   description: {
//     type: String,
//     trim: true,
//     maxlength: 500
//   },
//   filePath: {
//     type: String,
//     required: true
//   },
//   fileName: {
//     type: String,
//     required: true
//   },
//   originalName: {
//     type: String,
//     required: true
//   },
//   fileSize: {
//     type: Number,
//     required: true
//   },
//   fileType: {
//     type: String,
//     required: true
//   },
//   category: {
//     type: String,
//     required: true,
//     enum: [
//       'entertainment',
//       'education',
//       'music',
//       'gaming',
//       'sports',
//       'technology',
//       'comedy',
//       'lifestyle',
//       'news',
//       'howto',
//       'other'
//     ],
//     default: 'entertainment'
//   },
//   tags: [{
//     type: String,
//     trim: true
//   }],
//   channel: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   uploader: {
//     type: String,
//     required: true
//   },
//   views: {
//     type: Number,
//     default: 0
//   },
//   likes: {
//     type: Number,
//     default: 0
//   },
//   dislikes: {
//     type: Number,
//     default: 0
//   },
//   comments: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Comment'
//   }],
//   uploadDate: {
//     type: Date,
//     default: Date.now
//   },
//   duration: {
//     type: Number, // Duration in seconds
//     default: 0
//   },
//   thumbnail: {
//     type: String,
//     default: ''
//   },
//   isPublic: {
//     type: Boolean,
//     default: true
//   }
// });

// export default mongoose.model('Video', videoFiles);
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  filePath: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'entertainment',
      'education',
      'music',
      'gaming',
      'sports',
      'technology',
      'comedy',
      'lifestyle',
      'news',
      'howto',
      'other'
    ],
    default: 'entertainment'
  },
  tags: [{
    type: String,
    trim: true
  }],
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploader: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  uploadDate: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // Duration in seconds
    default: 0
  },
  thumbnail: {
    type: String,
    default: ''
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  // For download tracking
  downloads: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

export default Video;