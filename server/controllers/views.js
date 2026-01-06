import Video from "../models/videoFiles.js";
import mongoose from "mongoose";

export const viewController = async (req, res) => {
  const { id: _id } = req.params;
  // console.log(_id)
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Video Unavailable..");
  }
  try {
    const file = await Video.findById(_id);
    const views = file.views;
    const updateview = await Video.findByIdAndUpdate(_id, {
      $set: { views: views + 1 },
    });
    res.status(200).json(updateview);
  } catch (error) {
    res.status(400).json("error : ", error);
  }
};