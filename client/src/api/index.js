// import axios from "axios";

// //const API = axios.create({ baseURL: `http://localhost:5000/` });
// const API = axios.create({ baseURL: `http://localhost:5000/` });

// API.interceptors.request.use((req) => {
//   if (localStorage.getItem("Profile")) {
//     req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem("Profile")).token
//       }`;
//   }
//   return req;
// });

// export const login = (authData) => API.post("/user/login", authData);
// export const updateChanelData = (id, updateData) =>
//   API.patch(`/user/update/${id}`, updateData);
// export const fetchAllChanel = () => API.get("/user/getAllChanels");

// export const uploadVideo = (fileData, fileOptions) =>
//   API.post("/video/uploadVideo", fileData, fileOptions);
// export const getVideos = () => API.get("/video/getvideos");
// export const likeVideo = (id, Like) => API.patch(`/video/like/${id}`, { Like });
// export const viewsVideo = (id) => API.patch(`/video/view/${id}`);
// export const addPoints = (id, Viewer) => API.patch(`/video/points/${id}`, { Viewer });

// export const addToLikedVideo = (likedVideoData) =>
//   API.post("/video/likeVideo", likedVideoData);
// export const getAlllikedVideo = () => API.get("/video/getAlllikeVideo");
// export const deletelikedVideo = (videoId, Viewer) =>
//   API.delete(`/video/deleteLikedVideo/${videoId}/${Viewer}`);

// export const addTowatchLater = (watchLaterData) =>
//   API.post("/video/watchLater", watchLaterData);
// export const getAllwatchLater = () => API.get("/video/getAllwatchLater");
// export const deleteWatchLater = (videoId, Viewer) =>
//   API.delete(`/video/deleteWatchlater/${videoId}/${Viewer}`);

// export const addToHistory = (HistoryData) =>
//   API.post("/video/History", HistoryData);
// export const getAllHistory = () => API.get("/video/getAllHistory");
// export const deleteHistory = (userId) =>
//   API.delete(`/video/deleteHistory/${userId}`);

// export const postComment = (CommentData) => API.post('/comment/post', CommentData)
// export const deleteComment = (id) => API.delete(`/comment/delete/${id}`)
// export const editComment = (id, commentBody) => API.patch(`/comment/edit/${id}`, { commentBody })
// export const getAllComment = () => API.get('/comment/get')
// export const likeComment = (id, userId) => API.patch(`/comment/like/${id}`, { userId })
// export const dislikeComment = (id, userId) => API.patch(`/comment/dislike/${id}`, { userId })

// export const downloadVideo = (videoId, userId) => API.post(`/video/download/${videoId}`, { userId });
// export const createOrder = (amount, plan) => API.post('/payment/orders', { amount, plan });
// export const verifyOrder = (data) => API.post('/payment/verify', data);

// export const verifyOTP = (data) => API.post('/user/verify-otp', data);
import axios from "axios";

const API = axios.create({ baseURL: `http://localhost:5000/` });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("Profile")) {
    req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem("Profile")).token
      }`;
  }
  return req;
});

export const login = (authData) => API.post("/user/login", authData);
export const updateChanelData = (id, updateData) =>
  API.patch(`/user/update/${id}`, updateData);
export const fetchAllChanel = () => API.get("/user/getAllChanels");

// FIXED: uploadVideo function
export const uploadVideo = (fileData, fileOptions = {}) =>
  API.post("/video/uploadVideo", fileData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: fileOptions.onUploadProgress,
  });

export const getVideos = () => API.get("/video/getvideos");
export const likeVideo = (id, Like) => API.patch(`/video/like/${id}`, { Like });
export const viewsVideo = (id) => API.patch(`/video/view/${id}`);
export const addPoints = (id, Viewer) => API.patch(`/video/points/${id}`, { Viewer });

export const addToLikedVideo = (likedVideoData) =>
  API.post("/video/likeVideo", likedVideoData);
export const getAlllikedVideo = () => API.get("/video/getAlllikeVideo");
export const deletelikedVideo = (videoId, Viewer) =>
  API.delete(`/video/deleteLikeVideo/${videoId}/${Viewer}`);

export const addTowatchLater = (watchLaterData) =>
  API.post("/video/watchLater", watchLaterData);
export const getAllwatchLater = () => API.get("/video/getAllwatchLater");
export const deleteWatchLater = (videoId, Viewer) =>
  API.delete(`/video/deleteWatchLater/${videoId}/${Viewer}`);

export const addToHistory = (HistoryData) =>
  API.post("/video/History", HistoryData);
export const getAllHistory = () => API.get("/video/getAllHistory");
export const deleteHistory = (userId) =>
  API.delete(`/video/deleteHistory/${userId}`);

export const addToSavedVideo = (savedVideoData) =>
  API.post("/video/savedVideo", savedVideoData);
export const getAllSavedVideo = () =>
  API.get("/video/getAllsavedVideo");
export const deleteSavedVideo = (videoId, Viewer) =>
  API.delete(`/video/deleteSavedVideo/${videoId}/${Viewer}`);


export const postComment = (CommentData) => API.post('/comment/post', CommentData)
export const deleteComment = (id) => API.delete(`/comment/delete/${id}`)
export const editComment = (id, commentBody) => API.patch(`/comment/edit/${id}`, { commentBody })
export const getAllComment = () => API.get('/comment/get')
export const likeComment = (id, userId) => API.patch(`/comment/like/${id}`, { userId })
export const dislikeComment = (id, userId) => API.patch(`/comment/dislike/${id}`, { userId })

export const downloadVideo = (videoId, userId) => API.post(`/video/download/${videoId}`, { userId });
export const createOrder = (amount, plan) => API.post('/payment/orders', { amount, plan });
export const verifyOrder = (data) => API.post('/payment/verify', data);

export const verifyOTP = (data) => API.post('/user/verify-otp', data);

// Add to your api/index.js
export const subscribeToChannel = (channelId) => API.post('/subscription/subscribe', { channelId });
export const unsubscribeFromChannel = (channelId) => API.post('/subscription/unsubscribe', { channelId });
export const checkSubscription = (channelId) => API.get(`/subscription/check/${channelId}`);
export const getMySubscriptions = () => API.get('/subscription/my-subscriptions');
export const getChannelSubscribers = (channelId) => API.get(`/subscription/channel-subscribers/${channelId}`);