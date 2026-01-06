import * as api from '../api';
import { updateUser } from "./currentUser";

export const uploadVideo = (videoData) => async (dispatch) => {
  try {
    console.log("📤 Action: Starting video upload...");

    dispatch({ type: 'UPLOAD_VIDEO_REQUEST' });

    const { fileData, fileOptions } = videoData;

    if (!fileData || !(fileData instanceof FormData)) {
      throw new Error("Invalid file data");
    }

    console.log("Action: Sending FormData to backend...");

    // Call API
    const response = await api.uploadVideo(fileData, fileOptions);

    console.log("✅ Action: API Response:", response.data);

    if (response.data.success) {
      // Success - video saved to MongoDB
      const video = response.data.video;

      dispatch({
        type: 'UPLOAD_VIDEO_SUCCESS',
        payload: video
      });

      // Also add to videos list in state
      dispatch({
        type: 'ADD_VIDEO',
        payload: video
      });

      return { success: true, video: video };
    } else {
      throw new Error(response.data.message || "Upload failed");
    }

  } catch (error) {
    console.error("❌ Upload video action error:", error);

    let errorMessage = "Failed to upload video";

    if (error.response) {
      errorMessage = error.response.data?.message ||
        error.response.data?.error ||
        `Server error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = "No response from server. Check if backend is running.";
    } else {
      errorMessage = error.message;
    }

    dispatch({
      type: 'UPLOAD_VIDEO_FAILURE',
      payload: errorMessage
    });

    return { error: errorMessage };
  }
};

export const getAllVideo = () => async (dispatch) => {
  try {
    const { data } = await api.getVideos();
    dispatch({ type: 'FETCH_ALL_VIDEOS', payload: data })
  } catch (error) {
    console.log(error)
  }
}

export const likeVideo = (LikeDate) => async (dispatch) => {
  try {
    const { id, Like } = LikeDate;
    const { data } = await api.likeVideo(id, Like);
    dispatch({ type: "POST_LIKE", payload: data })
    dispatch(getAllVideo());
  } catch (error) {
    console.log(error)
  }
}

export const viewVideo = (ViewDate) => async (dispatch) => {
  try {
    const { id } = ViewDate;
    console.log(id)
    const { data } = await api.viewsVideo(id)
    dispatch({ type: 'POST_VIEWS', data })
    dispatch(getAllVideo())
  } catch (error) {
    console.log(error)
  }
}

export const addPoints = (ViewDate) => async (dispatch) => {
  try {
    const { id, Viewer } = ViewDate;
    console.log(id, Viewer)
    const { data } = await api.addPoints(id, Viewer)
    dispatch(updateUser(data))
    console.log('User Updated', data)
  } catch (error) {
    console.log(error)
  }
}