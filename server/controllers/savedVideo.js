import savedVideo from "../models/savedVideo.js";

export const savedVideoController = async (req, res) => {
    const savedVideoData = req.body;
    const addSavedVideo = new savedVideo(savedVideoData);

    try {
        const saved = await addSavedVideo.save();
        res.status(200).json(saved);
    } catch (error) {
        res.status(400).json(error);
    }
};

export const getAllsavedVideoController = async (req, res) => {
    try {
        const files = await savedVideo.find();
        res.status(200).send(files);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const deletesavedVideoController = async (req, res) => {
    const { videoId, Viewer } = req.params;
    try {
        await savedVideo.findOneAndDelete({
            videoId: videoId,
            Viewer: Viewer,
        });
        res.status(200).json({ message: "Removed from your saved videos" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
