import * as api from "../api";

export const addToSavedVideo = (savedVideoData) => async (dispatch) => {
    try {
        const { data } = await api.addToSavedVideo(savedVideoData);
        dispatch({ type: "POST_SAVEDVIDEO", payload: data });
        dispatch(getAllSavedVideo());
    } catch (error) {
        console.log(error);
    }
}

export const getAllSavedVideo = () => async (dispatch) => {
    try {
        const { data } = await api.getAllSavedVideo();
        dispatch({ type: 'FETCH_ALL_SAVED_VIDEOS', payload: data })
    } catch (error) {
        console.log(error)
    }
}

export const deleteSavedVideo = (savedVideoData) => async (dispatch) => {
    try {
        const { videoId, Viewer } = savedVideoData;
        await api.deleteSavedVideo(videoId, Viewer);
        dispatch(getAllSavedVideo());
    } catch (error) {
        console.log(error)
    }
}
