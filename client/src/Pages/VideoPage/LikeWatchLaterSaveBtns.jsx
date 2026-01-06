import React, { useState, useEffect, useCallback, useMemo } from "react";
import { BsThreeDots } from "react-icons/bs";
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineDislike,
  AiOutlineLike,
} from "react-icons/ai";
import { MdPlaylistAddCheck, MdOutlineFileDownload } from "react-icons/md";
import { downloadVideo } from "../../api";
import {
  RiHeartAddFill,
  RiPlayListAddFill,
  RiShareForwardLine,
} from "react-icons/ri";
import "./LikeWatchLaterSaveBtns.css";
import { useDispatch, useSelector } from "react-redux";
import { likeVideo, addPoints } from "../../actions/video";

import { addTolikedVideo, deletelikedVideo } from "../../actions/likedVideo";
import { addTowatchLater, deleteWatchLater } from "../../actions/watchLater";

import { addToSavedVideo, deleteSavedVideo } from "../../actions/savedVideo";

function LikeWatchLaterSaveBtns({ vv, vid }) {
  const CurrentUser = useSelector((state) => state?.currentUserReducer);
  const dispatch = useDispatch();

  const [watchLater, setWatchLater] = useState(false);
  const [savedVideo, setSavedVideo] = useState(false);
  const [dislikeBtn, setDislikeBtn] = useState(false);
  const [likeBtn, setLikeBtn] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const likedVideoList = useSelector((state) => state.likedVideoReducer);
  const watchLaterList = useSelector(state => state.watchLaterReducer);
  const savedVideoList = useSelector(state => state.savedVideoReducer);

  // Fix: Use useMemo for video object
  const video = useMemo(() => vv || {}, [vv]);

  // Check initial state for like, watch later and save buttons
  useEffect(() => {
    if (CurrentUser) {
      // Check if video is liked
      const isLiked = likedVideoList?.data?.some(
        (item) => item?.videoId === vid && item?.Viewer === CurrentUser?.result._id
      );
      setLikeBtn(isLiked);

      // Check if video is in watch later
      const isWL = watchLaterList?.data?.some(
        (item) => item?.videoId === vid && item?.Viewer === CurrentUser?.result._id
      );
      setWatchLater(isWL);

      // Check if video is saved
      const isSaved = savedVideoList?.data?.some(
        (item) => item?.videoId === vid && item?.Viewer === CurrentUser?.result?._id
      );
      setSavedVideo(isSaved);
    }
  }, [CurrentUser, likedVideoList, watchLaterList, savedVideoList, vid]);

  const toggleWatchLater = useCallback(() => {
    if (!CurrentUser) {
      alert("Please login to save to Watch Later");
      return;
    }

    if (watchLater) {
      setWatchLater(false);
      dispatch(
        deleteWatchLater({
          videoId: vid,
          Viewer: CurrentUser?.result._id,
        })
      );
    } else {
      setWatchLater(true);
      dispatch(
        addTowatchLater({
          videoId: vid,
          Viewer: CurrentUser?.result._id,
        })
      );
    }
  }, [CurrentUser, watchLater, dispatch, vid]);

  const toggleSavedVideo = useCallback(() => {
    if (!CurrentUser) {
      alert("Please login to save videos");
      return;
    }

    if (savedVideo) {
      setSavedVideo(false);
      dispatch(
        deleteSavedVideo({
          videoId: vid,
          Viewer: CurrentUser?.result?._id,
        })
      );
    } else {
      setSavedVideo(true);
      dispatch(
        addToSavedVideo({
          videoId: vid,
          Viewer: CurrentUser?.result?._id,
        })
      );
    }
  }, [CurrentUser, savedVideo, dispatch, vid]);

  const toggleLikeBtn = useCallback((e) => {
    e.stopPropagation();

    if (!CurrentUser) {
      alert("Please login to like videos");
      return;
    }

    const currentLikes = video?.Like || 0;

    if (likeBtn) {
      setLikeBtn(false);
      if (dislikeBtn) setDislikeBtn(false);
      dispatch(
        likeVideo({
          id: vid,
          Like: currentLikes - 1,
        })
      );
      dispatch(deletelikedVideo({
        videoId: vid,
        Viewer: CurrentUser?.result._id,
      }));
    } else {
      setLikeBtn(true);
      if (dislikeBtn) setDislikeBtn(false);
      dispatch(
        likeVideo({
          id: vid,
          Like: currentLikes + 1,
        })
      );
      dispatch(
        addTolikedVideo({
          videoId: vid,
          Viewer: CurrentUser?.result._id,
        })
      );
    }
  }, [CurrentUser, likeBtn, dislikeBtn, video?.Like, dispatch, vid]);

  const toggleDislikeBtn = useCallback((e) => {
    e.stopPropagation();

    if (!CurrentUser) {
      alert("Please login to dislike videos");
      return;
    }

    const currentLikes = video?.Like || 0;

    if (dislikeBtn) {
      setDislikeBtn(false);
    } else {
      setDislikeBtn(true);
      if (likeBtn) {
        setLikeBtn(false);
        dispatch(
          likeVideo({
            id: vid,
            Like: currentLikes - 1,
          })
        );
        dispatch(deletelikedVideo({
          videoId: vid,
          Viewer: CurrentUser?.result._id,
        }));
      }
    }
  }, [CurrentUser, dislikeBtn, likeBtn, video?.Like, dispatch, vid]);

  const handleDownload = useCallback(async () => {
    if (!CurrentUser) {
      alert("Please login to download videos");
      return;
    }

    if (!video?.filePath || !video?.fileName) {
      alert("Download link not available");
      return;
    }

    setIsDownloading(true);
    try {
      const { data } = await downloadVideo(vid, CurrentUser.result._id);

      if (data.message === "Download permitted") {
        // Create a temporary link for download
        const link = document.createElement('a');
        link.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${video.filePath}`;
        link.setAttribute('download', video.fileName || `video_${vid}.mp4`);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(data.message || "Download not permitted");
      }
    } catch (error) {
      console.error("Download error:", error);
      if (error.response) {
        switch (error.response.status) {
          case 403:
            alert(error.response.data.message || "Download limit reached");
            break;
          case 401:
            alert("Please login to download");
            break;
          case 404:
            alert("Video file not found");
            break;
          default:
            alert("Download failed. Please try again.");
        }
      } else {
        alert("Network error. Please check your connection.");
      }
    } finally {
      setIsDownloading(false);
    }
  }, [CurrentUser, video, vid]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: video?.title || 'YouTube Video',
        text: `Check out this video: ${video?.title || ''}`,
        url: window.location.href,
      })
        .catch((error) => {
          console.log("Share failed:", error);
        });
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch(() => {
          const textArea = document.createElement('textarea');
          textArea.value = window.location.href;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert("Link copied to clipboard!");
        });
    }
  }, [video]);

  const handleThanks = () => {
    if (!CurrentUser) {
      alert("Please login to send thanks");
      return;
    }
    dispatch(addPoints({
      id: vid,
      Viewer: CurrentUser?.result?._id
    }));
    alert("Thanks sent to the creator! Points added.");
  };

  const handleMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };

  // Close more options when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showMoreOptions) {
        setShowMoreOptions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMoreOptions]);

  if (!vid) {
    return null;
  }

  return (
    <div className="btns_cont_videoPage">
      <div className="btn_VideoPage">
        <button
          className="more-options-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleMoreOptions();
          }}
          aria-label="More options"
          aria-expanded={showMoreOptions}
        >
          <BsThreeDots />
        </button>
      </div>

      <div className="btn_VideoPage">
        <div className="action-buttons">
          <button
            className={`like-btn ${likeBtn ? 'active' : ''}`}
            onClick={toggleLikeBtn}
            aria-label={likeBtn ? "Remove like" : "Like video"}
          >
            {likeBtn ? (
              <AiFillLike size={22} />
            ) : (
              <AiOutlineLike size={22} />
            )}
            <span className="btn-count">{video?.Like || 0}</span>
          </button>

          <button
            className={`dislike-btn ${dislikeBtn ? 'active' : ''}`}
            onClick={toggleDislikeBtn}
            aria-label={dislikeBtn ? "Remove dislike" : "Dislike video"}
          >
            {dislikeBtn ? (
              <AiFillDislike size={22} />
            ) : (
              <AiOutlineDislike size={22} />
            )}
            <span className="btn-label">Dislike</span>
          </button>

          <button
            className={`watch-later-btn ${watchLater ? 'active' : ''}`}
            onClick={toggleWatchLater}
            aria-label={watchLater ? "Remove from Watch Later" : "Save to Watch Later"}
          >
            {watchLater ? (
              <MdPlaylistAddCheck size={22} />
            ) : (
              <MdPlaylistAddCheck size={22} style={{ opacity: 0.6 }} />
            )}
            <span className="btn-label">{watchLater ? 'In Watch Later' : 'Watch Later'}</span>
          </button>

          <button
            className={`save-btn ${savedVideo ? 'active' : ''}`}
            onClick={toggleSavedVideo}
            aria-label={savedVideo ? "Remove from Saved Videos" : "Save to Saved Videos"}
          >
            {savedVideo ? (
              <RiHeartAddFill size={22} />
            ) : (
              <RiPlayListAddFill size={22} />
            )}
            <span className="btn-label">{savedVideo ? 'Saved' : 'Save'}</span>
          </button>

          <button
            className="share-btn"
            onClick={handleShare}
            aria-label="Share video"
          >
            <RiShareForwardLine size={22} />
            <span className="btn-label">Share</span>
          </button>

          <button
            className="thanks-btn"
            onClick={handleThanks}
            aria-label="Send thanks to creator"
          >
            <RiHeartAddFill size={22} style={{ color: 'gold' }} />
            <span className="btn-label">Thanks</span>
          </button>

          <button
            className={`download-btn ${isDownloading ? 'downloading' : ''}`}
            onClick={handleDownload}
            disabled={isDownloading}
            aria-label="Download video"
          >
            <MdOutlineFileDownload size={22} />
            <span className="btn-label">
              {isDownloading ? 'Downloading...' : 'Download'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}


export default LikeWatchLaterSaveBtns;