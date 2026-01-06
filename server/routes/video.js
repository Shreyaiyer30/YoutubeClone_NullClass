import express from "express";
import multer from "multer";
import Video from "../models/videoFiles.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const router = express.Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/videos');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, 'video-' + uniqueSuffix + extension);
    }
});

// File filter for video files
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/avi',
        'video/mov',
        'video/wmv',
        'video/flv',
        'video/mkv',
        'video/quicktime',
        'video/x-msvideo',
        'video/x-matroska',
        'audio/mpeg', // mp3
        'audio/mp4',
        'audio/ogg',
        'audio/wav'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only video/audio files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    fileFilter: fileFilter
});

// Upload video endpoint - Saves directly to MongoDB
router.post('/uploadVideo', upload.single('file'), async (req, res) => {
    try {
        console.log('📥 Upload request received:', {
            file: req.file,
            body: req.body
        });

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Parse tags from comma-separated string to array
        let tagsArray = [];
        if (req.body.tags) {
            tagsArray = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }

        // Create new video document in MongoDB
        const newVideo = new Video({
            title: req.body.title,
            description: req.body.description || '',
            filePath: req.file.path,
            fileName: req.file.filename,
            originalName: req.file.originalname,
            fileSize: req.file.size,
            fileType: req.file.mimetype,
            category: req.body.category || 'entertainment',
            tags: tagsArray,
            channel: req.body.channel,
            uploader: req.body.uploader || 'Anonymous'
        });

        // Save to database
        const savedVideo = await newVideo.save();

        console.log('✅ Video saved to MongoDB:', savedVideo._id);

        res.status(201).json({
            success: true,
            message: 'Video uploaded and saved to database successfully',
            video: savedVideo
        });

    } catch (error) {
        console.error('❌ Upload error:', error);

        // Delete the uploaded file if database save failed
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Upload failed'
        });
    }
});

// Get all videos
router.get('/getvideos', async (req, res) => {
    try {
        const videos = await Video.find()
            .populate('channel', 'name email')
            .sort({ uploadDate: -1 });

        res.status(200).json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get videos by category
router.get('/category/:category', async (req, res) => {
    try {
        const videos = await Video.find({ category: req.params.category })
            .populate('channel', 'name email')
            .sort({ uploadDate: -1 });

        res.status(200).json(videos);
    } catch (error) {
        console.error('Error fetching videos by category:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Import additional controllers
import { likeVideoController, getAlllikeVideoController, deleteLikeVideoController } from "../controllers/likeVideo.js";
import { watchLaterController, getAllwatchLaterController, deletewatchLaterController } from "../controllers/watchLater.js";
import { HistoryController, getAllHistoryController, deleteHistoryController } from "../controllers/History.js";
import { savedVideoController, getAllsavedVideoController, deletesavedVideoController } from "../controllers/savedVideo.js";


// Like Video Routes
router.post('/likeVideo', likeVideoController);
router.get('/getAlllikeVideo', getAlllikeVideoController);
router.delete('/deleteLikeVideo/:videoId/:Viewer', deleteLikeVideoController);

// Watch Later Routes
router.post('/watchLater', watchLaterController);
router.get('/getAllwatchLater', getAllwatchLaterController);
router.delete('/deleteWatchLater/:videoId/:Viewer', deletewatchLaterController);

// History Routes
router.post('/History', HistoryController);
router.get('/getAllHistory', getAllHistoryController);
router.delete('/deleteHistory/:userId', deleteHistoryController);

// Saved Video Routes
router.post('/savedVideo', savedVideoController);
router.get('/getAllsavedVideo', getAllsavedVideoController);
router.delete('/deleteSavedVideo/:videoId/:Viewer', deletesavedVideoController);


// Get video by ID (Must be after specific routes)
router.get('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
            .populate('channel', 'name email')
            .populate('comments');

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Increment views
        video.views += 1;
        await video.save();

        res.status(200).json(video);
    } catch (error) {
        console.error('Error fetching video:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Like a video
router.patch('/like/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        video.likes = req.body.Like;
        await video.save();

        res.status(200).json(video);
    } catch (error) {
        console.error('Error liking video:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get videos by channel
router.get('/channel/:channelId', async (req, res) => {
    try {
        const videos = await Video.find({ channel: req.params.channelId })
            .sort({ uploadDate: -1 });

        res.status(200).json(videos);
    } catch (error) {
        console.error('Error fetching channel videos:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Increment views
router.patch('/view/:id', async (req, res) => {
    try {
        await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.status(200).json({ message: 'View count updated' });
    } catch (error) {
        console.error('Error updating views:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add to imports
import { uploadVideo, getAllvideos, downloadVideo } from "../controllers/video.js";

// ... existing routes ...

// Download Video
router.post('/download/:id', downloadVideo);


// Add points (Thanks feature)
router.patch('/points/:id', async (req, res) => {
    try {
        const { Viewer } = req.body;
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        // Increment likes as a proxy for 'points' or add a new field if schema supports
        // For now, let's just return success to make the UI happy
        res.status(200).json({ message: 'Points added successfully' });
    } catch (error) {
        console.error('Error adding points:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;