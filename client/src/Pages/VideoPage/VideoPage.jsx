import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Comments from "../../Components/Comments/Comments";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import LikeWatchLaterSaveBtns from "./LikeWatchLaterSaveBtns";
import "./VideoPage.css";
import { addToHistory } from "../../actions/History";
import { viewVideo, addPoints } from "../../actions/video";
import { subscribe, unsubscribe, checkSubscriptionStatus } from "../../actions/subscription";

function VideoPage() {
  const { vid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State
  const [showDescription, setShowDescription] = useState(false);
  const [, setLeftTapCount] = useState(0);
  const [, setRightTapCount] = useState(0);
  const [, setMiddleTapCount] = useState(0);
  const [locationAndTemp, setLocationAndTemp] = useState(null);
  const [pagination, setPagination] = useState({ start: 0, end: 2 });
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  // Refs
  const videoRef = useRef(null);
  const commentsRef = useRef(null);
  const holdTimeoutRef = useRef(null);
  const leftTapTimeoutRef = useRef(null);
  const rightTapTimeoutRef = useRef(null);
  const middleTapTimeoutRef = useRef(null);

  // Selectors
  const CurrentUser = useSelector((state) => state?.currentUserReducer);
  const videosList = useSelector((state) => state.videoReducer);
  const subscriptionState = useSelector((state) => state.subscriptionReducer);

  // Find current video
  const vv = videosList?.data?.find((q) => q._id === vid);

  // Check subscription status
  useEffect(() => {
    if (CurrentUser && vv?.channel) {
      dispatch(checkSubscriptionStatus(vv.channel._id || vv.channel));
    }
  }, [CurrentUser, dispatch, vv?.channel]);

  // Get subscription status
  const channelId = vv?.channel?._id || vv?.channel;
  const isSubscribed = channelId ? subscriptionState.subscriptionStatus[channelId] : false;

  // Handle video loading
  useEffect(() => {
    if (!vv) {
      console.log("No video data found for vid:", vid);
    }
  }, [vv, vid]);

  // Memoized handler functions
  const handleHistory = useCallback(() => {
    if (CurrentUser) {
      dispatch(
        addToHistory({
          videoId: vid,
          Viewer: CurrentUser?.result?._id,
        })
      );
    }
  }, [CurrentUser, dispatch, vid]);

  const handleViews = useCallback(() => {
    dispatch(viewVideo({ id: vid }));
  }, [dispatch, vid]);

  const handlePoints = useCallback(() => {
    if (CurrentUser) {
      dispatch(addPoints({
        id: vid,
        Viewer: CurrentUser?.result?._id,
      }));
    }
  }, [CurrentUser, dispatch, vid]);

  // Track views, history, and points
  useEffect(() => {
    if (vid && CurrentUser) {
      handleHistory();
    }
    handleViews();

    const video = videoRef.current;
    if (video) {
      video.addEventListener('ended', handlePoints);
    }

    return () => {
      if (video) {
        video.removeEventListener('ended', handlePoints);
      }
    };
  }, [vid, CurrentUser, handleHistory, handleViews, handlePoints]);

  // Handle subscribe/unsubscribe
  const handleSubscribe = async () => {
    if (!CurrentUser) {
      alert("Please login to subscribe to channels");
      return;
    }

    const channelId = vv?.channel?._id || vv?.channel;
    if (!channelId) {
      alert("Channel information not available");
      return;
    }

    setSubscriptionLoading(true);

    try {
      if (isSubscribed) {
        // Unsubscribe
        const result = await dispatch(unsubscribe(channelId));
        if (!result.error) {
          // Subscription status will be updated via Redux
        }
      } else {
        // Subscribe
        const result = await dispatch(subscribe(channelId));
        if (!result.error) {
          // Subscription status will be updated via Redux
        }
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to update subscription");
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Video controls handlers
  const handleDoubleClick = (e) => {
    const video = videoRef.current;
    if (video) {
      const boundingRect = video.getBoundingClientRect();
      const clickPositionX = e.clientX - boundingRect.left;

      if (clickPositionX > boundingRect.width / 2) {
        video.currentTime += 10; // Right side double-tap
      } else {
        video.currentTime -= 10; // Left side double-tap
      }
    }
  };

  const handleMouseDown = (e) => {
    const video = videoRef.current;
    if (video) {
      const boundingRect = video.getBoundingClientRect();
      const clickPositionX = e.clientX - boundingRect.left;

      holdTimeoutRef.current = setTimeout(() => {
        if (clickPositionX > boundingRect.width / 2) {
          video.playbackRate = 2; // Right side hold
        } else {
          video.playbackRate = 0.5; // Left side hold
        }
      }, 500);
    }
  };

  const handleMouseUp = () => {
    const video = videoRef.current;
    if (video) {
      clearTimeout(holdTimeoutRef.current);
      video.playbackRate = 1; // Reset speed
    }
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (video) {
      clearTimeout(holdTimeoutRef.current);
      video.playbackRate = 1; // Reset speed
    }
  };

  const handleTripleTap = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const boundingRect = video.getBoundingClientRect();
    const clickPositionX = e.clientX - boundingRect.left;

    if (clickPositionX <= boundingRect.width / 3) {
      // Left side - scroll to comments
      setLeftTapCount(prev => {
        const newCount = prev + 1;

        if (leftTapTimeoutRef.current) {
          clearTimeout(leftTapTimeoutRef.current);
        }

        leftTapTimeoutRef.current = setTimeout(() => {
          setLeftTapCount(0);
        }, 500);

        if (newCount === 3) {
          commentsRef.current?.scrollIntoView({ behavior: "smooth" });
          return 0;
        }
        return newCount;
      });
    } else if (clickPositionX >= (2 * boundingRect.width) / 3) {
      // Right side - close window
      setRightTapCount(prev => {
        const newCount = prev + 1;

        if (rightTapTimeoutRef.current) {
          clearTimeout(rightTapTimeoutRef.current);
        }

        rightTapTimeoutRef.current = setTimeout(() => {
          setRightTapCount(0);
        }, 500);

        if (newCount === 3) {
          window.close();
          return 0;
        }
        return newCount;
      });
    } else {
      // Middle - navigate to next video
      setMiddleTapCount(prev => {
        const newCount = prev + 1;

        if (middleTapTimeoutRef.current) {
          clearTimeout(middleTapTimeoutRef.current);
        }

        middleTapTimeoutRef.current = setTimeout(() => {
          setMiddleTapCount(0);
        }, 500);

        if (newCount === 3) {
          const nextVideoId = getNextVideoId();
          if (nextVideoId) {
            navigate(`/videopage/${nextVideoId}`);
          }
          return 0;
        }
        return newCount;
      });
    }
  };

  // Get next video ID
  const getNextVideoId = () => {
    if (!videosList?.data) return null;

    const currentIndex = videosList.data.findIndex((video) => video._id === vid);
    if (currentIndex !== -1 && currentIndex + 1 < videosList.data.length) {
      return videosList.data[currentIndex + 1]._id;
    }
    return null;
  };

  // Weather and location function
  const handleSingleTapTopRight = async (e) => {
    const video = videoRef.current;
    if (!video) return;

    const boundingRect = video.getBoundingClientRect();
    const clickPositionX = e.clientX - boundingRect.left;
    const clickPositionY = e.clientY - boundingRect.top;

    if (
      clickPositionX > boundingRect.width * 0.9 &&
      clickPositionY < boundingRect.height * 0.1
    ) {
      // Top right corner tap
      try {
        const position = await getCurrentPosition();
        if (position) {
          const weather = await getWeather(
            position.coords.latitude,
            position.coords.longitude
          );
          if (weather) {
            setLocationAndTemp(
              `Location: ${weather.location.name}, Temperature: ${weather.current.temp_c}°C`
            );
            setTimeout(() => {
              setLocationAndTemp(null);
            }, 5000);
          }
        }
      } catch (error) {
        console.error("Error getting location/weather:", error);
      }
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error("Geolocation not supported"));
      }
    });
  };

  const getWeather = async (lat, lon) => {
    const apiKey = "a379da1c007f4b0798972427243006"; // Replace with your WeatherAPI key
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`
      );
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Weather API error:", error);
      return null;
    }
  };

  // Watch time limit based on user plan
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    const userPlan = CurrentUser?.result?.plan || "Free";

    let limit = 300; // Free: 5 mins (300 seconds)
    if (userPlan === "Bronze") limit = 420; // 7 mins
    if (userPlan === "Silver") limit = 600; // 10 mins
    if (userPlan === "Gold") limit = Infinity;

    if (currentTime >= limit) {
      video.pause();
      alert(`You have reached the watch limit for your ${userPlan} plan. Please upgrade to continue watching.`);
    }
  };

  // Pagination handler
  const handlePagination = () => {
    setPagination(prev => ({
      ...prev,
      start: prev.start + 2,
      end: prev.end + 2
    }));
  };

  if (!vv) {
    return <div className="loading-container">Loading video...</div>;
  }

  return (
    <div className="container_videoPage">
      <div className="container2_videoPage">
        <div
          className="video_display_screen_videoPage"
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => {
            handleTripleTap(e);
            handleSingleTapTopRight(e);
          }}
        >
          <video
            ref={videoRef}
            src={`http://localhost:5000/${vv?.filePath?.replace(/\\/g, '/').split('uploads/')[1] ? 'uploads/' + vv?.filePath?.replace(/\\/g, '/').split('uploads/')[1] : vv?.filePath?.replace(/\\/g, '/')}`}
            className="video_ShowVideo_videoPage"
            controls
            onTimeUpdate={handleTimeUpdate}
          ></video>

          {locationAndTemp && (
            <div className="location-temp-popup">
              {locationAndTemp}
            </div>
          )}

          <div className="video_details_videoPage">
            <div className="video_btns_title_VideoPage_cont">
              <p className="video_title_VideoPage">{vv?.title}</p>
              <div className="views_date_btns_VideoPage">
                <div className="views_videoPage">
                  {vv?.views || 0} views <div className="dot"></div>{" "}
                  {moment(vv?.uploadDate).fromNow()}
                </div>
                <LikeWatchLaterSaveBtns vv={vv} vid={vid} />
              </div>
            </div>

            <div className="channel_subscribe_container">
              <Link
                to={`/chanel/${vv?.channel?._id || vv?.channel}`}
                className="chanel_details_videoPage"
              >
                <b className="chanel_logo_videoPage">
                  <p>{vv?.uploader?.charAt(0).toUpperCase()}</p>
                </b>
                <div className="channel_info">
                  <p className="chanel_name_videoPage">{vv?.uploader}</p>
                  <span className="subscriber_count">
                    {vv?.subscriberCount || 0} subscribers
                  </span>
                </div>
              </Link>

              <div className="subscribe_btn_container">
                <button
                  className={`subscribe_btn ${isSubscribed ? 'subscribed' : ''}`}
                  onClick={handleSubscribe}
                  disabled={subscriptionLoading || !CurrentUser}
                >
                  {subscriptionLoading ? (
                    <span className="loading-spinner"></span>
                  ) : isSubscribed ? (
                    <>
                      <span className="subscribed-icon">✓</span>
                      Subscribed
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </button>

                {isSubscribed && (
                  <button className="notification_bell" title="Notification settings">
                    🔔
                  </button>
                )}
              </div>
            </div>

            {vv?.description && (
              <div
                className="description_videoPage"
                onClick={() => setShowDescription(!showDescription)}
              >
                <pre className="description_text">
                  {showDescription
                    ? vv.description
                    : (vv.description?.slice(0, 200) || "")}
                  {vv.description?.length > 200 && (
                    <b>{showDescription ? " Show Less" : "... Show More"}</b>
                  )}
                </pre>
              </div>
            )}
          </div>

          <div className="comments_VideoPage" ref={commentsRef}>
            <h2><u>Comments</u></h2>
            <Comments videoId={vv._id} />

            {/* Display existing comments with pagination */}
            {vv.comments?.slice(pagination.start, pagination.end).map((comment) => (
              <div key={comment._id} className="comment_videoPage">
                <b>{comment.commentBody}</b>
                <p>{comment.commentUser}</p>
              </div>
            ))}

            {vv.comments?.length > pagination.end && (
              <div className="pagination_comment">
                <button onClick={handlePagination}>Load More Comments</button>
              </div>
            )}
          </div>
        </div>

        <div className="moreVideoBar">
          <h3>More Videos</h3>
          {/* You can add more videos list here */}
        </div>
      </div>
    </div>
  );
}

export default VideoPage;