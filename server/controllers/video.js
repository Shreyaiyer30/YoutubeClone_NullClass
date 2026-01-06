import videoFiles from "../models/videoFiles.js";
export const uploadVideo = async (req, res, next) => {
  if (req.file === undefined) {
    res.status(404).json({ message: "plz Upload a '.mp4' video file only " });
  } else {
    try {
      const file = new videoFiles({
        videoTitle: req.body.title,
        fileName: req.file.originalname,
        filePath: req.file.path.replace(/\\/g, '/').split('server/')[1] || req.file.path.replace(/\\/g, '/').split('server\\')[1] || req.file.path.replace(/\\/g, '/'),
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        videoChanel: req.body.chanel,
        Uploder: req.body.Uploder,
        videoDescription: req.body.description,
      });
      //   console.log(file);
      const savedFile = await file.save();
      res.status(200).json({ success: true, message: "File uploaded successfully", video: savedFile });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
};
import User from '../models/auth.js';

export const getAllvideos = async (req, res) => {
  try {
    const files = await videoFiles.find();
    res.status(200).send(files)
  } catch (error) {
    res.status(404).send(error.message)
  }
}

export const downloadVideo = async (req, res) => {
  const { videoId } = req.params;
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.plan === 'Free') {
      if (user.lastDownloadDate && new Date(user.lastDownloadDate).setHours(0, 0, 0, 0) === today.getTime()) {
        if (user.downloadCount >= 1) {
          return res.status(403).json({ message: "Daily download limit reached. Upgrade to Premium for unlimited downloads." });
        }
      } else {
        user.downloadCount = 0; // Reset for new day
      }
    }

    user.downloadCount += 1;
    user.lastDownloadDate = new Date();
    await user.save();

    res.status(200).json({ message: "Download permitted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}