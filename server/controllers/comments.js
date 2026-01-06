import comment from "../models/comments.js";
import mongoose from "mongoose";

//   ;

export const postComment = async (req, res) => {
  const commentData = req.body;
  const postcomment = new comment(commentData);
  try {
    await postcomment.save();
    res.status(200).json("posted the comment");
    //   console.log("DOne");
  } catch (error) {
    res.status(400).json(error);
  }
};



export const getComment = async (req, res) => {
  try {
    const commentList = await comment.find();
    res.status(200).send(commentList);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

export const deleteComment = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Comments Unavailable..");
  }
  try {
    await comment.findByIdAndRemove(_id);
    res.status(200).json({ message: "deleted comment" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editComment = async (req, res) => {
  const { id: _id } = req.params;
  const { commentBody } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("comment Unavailable..");
  }
  try {
    const updateComment = await comment.findByIdAndUpdate(
      _id,
      {
        $set: { "commentBody": commentBody }
      }
    )
    res.status(200).json(updateComment)
  } catch (error) {
    res.status(400).json(error)

  }
}

export const likeComment = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No comment with that id`);
  try {
    const commentData = await comment.findById(id);
    const likeIndex = commentData.likes.findIndex((id) => id === String(userId));
    const dislikeIndex = commentData.dislikes.findIndex((id) => id === String(userId));

    if (likeIndex === -1) {
      commentData.likes.push(userId);
      if (dislikeIndex !== -1) {
        commentData.dislikes = commentData.dislikes.filter((id) => id !== String(userId));
      }
    } else {
      commentData.likes = commentData.likes.filter((id) => id !== String(userId));
    }
    const updatedComment = await comment.findByIdAndUpdate(id, commentData, { new: true });
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const dislikeComment = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No comment with that id`);
  try {
    const commentData = await comment.findById(id);
    const likeIndex = commentData.likes.findIndex((id) => id === String(userId));
    const dislikeIndex = commentData.dislikes.findIndex((id) => id === String(userId));

    if (dislikeIndex === -1) {
      commentData.dislikes.push(userId);
      if (likeIndex !== -1) {
        commentData.likes = commentData.likes.filter((id) => id !== String(userId));
      }
    } else {
      commentData.dislikes = commentData.dislikes.filter((id) => id !== String(userId));
    }

    // Check for 2 dislikes
    if (commentData.dislikes.length >= 2) {
      await comment.findByIdAndRemove(id);
      return res.status(200).json({ message: "Comment deleted due to excessive dislikes" });
    }

    const updatedComment = await comment.findByIdAndUpdate(id, commentData, { new: true });
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
