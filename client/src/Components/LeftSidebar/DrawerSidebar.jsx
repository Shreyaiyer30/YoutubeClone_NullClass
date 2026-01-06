import React, { useState, useEffect } from "react";
import "./LeftSidebar.css";
import {
  AiFillPlaySquare,
  AiOutlineHome,
  AiFillLike,
  AiFillHome,
  AiFillFire
} from "react-icons/ai";
import {
  MdOutlineExplore,
  MdOutlineVideoLibrary,
  MdOutlineWatchLater,
  MdSubscriptions,
  MdExplore,
  MdVideoLibrary,
  MdWatchLater,
  MdSubscriptions as MdSubscriptionsFilled,
  MdLocalMovies,
  MdOndemandVideo,
  MdPlaylistAddCheck
} from "react-icons/md";

import {
  FaHistory,
  FaCrown,
  FaYoutube
} from "react-icons/fa";
import { BsCameraReels, BsCameraReelsFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

function DrawerSidebar({ toggleDrawer, toggleDrawerSidebar }) {
  const CurrentUser = useSelector((state) => state?.currentUserReducer);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const mockSubscriptions = [
      { _id: "1", name: "Tech Reviews", logo: "T" },
      { _id: "2", name: "Cooking Channel", logo: "C" },
      { _id: "3", name: "Gaming Hub", logo: "G" },
      { _id: "4", name: "Music World", logo: "M" },
      { _id: "5", name: "Science Daily", logo: "S" }
    ];
    setSubscriptions(mockSubscriptions);
  }, []);

  const mainLinks = [
    {
      name: "Home",
      icon: AiOutlineHome,
      activeIcon: AiFillHome,
      path: "/",
      exact: true
    },
    {
      name: "Explore",
      icon: MdOutlineExplore,
      activeIcon: MdExplore,
      path: "/explore"
    },
    {
      name: "Shorts",
      icon: BsCameraReels,
      activeIcon: BsCameraReelsFill,
      path: "/shorts"
    },
    {
      name: "Subscriptions",
      icon: MdSubscriptions,
      activeIcon: MdSubscriptionsFilled,
      path: "/subscriptions"
    }
  ];

  const libraryLinks = [
    {
      name: "Library",
      icon: MdOutlineVideoLibrary,
      activeIcon: MdVideoLibrary,
      path: "/library"
    },
    {
      name: "History",
      icon: FaHistory,
      activeIcon: FaHistory,
      path: "/history"
    },
    {
      name: "Your Videos",
      icon: AiFillPlaySquare,
      activeIcon: AiFillPlaySquare,
      path: "/yourvideos",
      requireAuth: true
    },
    {
      name: "Watch Later",
      icon: MdOutlineWatchLater,
      activeIcon: MdWatchLater,
      path: "/watchlater",
      requireAuth: true
    },
    {
      name: "Liked Videos",
      icon: AiFillLike,
      activeIcon: AiFillLike,
      path: "/likedvideo",
      requireAuth: true
    },
    {
      name: "Saved Videos",
      icon: MdPlaylistAddCheck,
      activeIcon: MdPlaylistAddCheck,
      path: "/savevideo",
      requireAuth: true
    }
  ];


  const premiumLinks = [
    {
      name: "Premium",
      icon: FaCrown,
      path: "/plans",
      isPremium: true
    }
  ];

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="container_DrawaerLeftSidebar" style={toggleDrawerSidebar}>
      <div className="container2_DrawaerLeftSidebar">
        {CurrentUser && (
          <div className="user_profile_section">
            <div className="user_profile_info">
              <div className="user_avatar_sidebar">
                {getInitial(CurrentUser?.result?.name || CurrentUser?.result?.email)}
              </div>
              <div className="user_details_sidebar">
                <div className="user_name_sidebar">
                  {CurrentUser?.result?.name || "User"}
                </div>
                <div className="user_email_sidebar">
                  {CurrentUser?.result?.email}
                </div>
              </div>
            </div>
            <div className="user_stats">
              <div className="stat_item">
                <span className="stat_number">
                  {CurrentUser?.result?.viewedVideos?.length || 0}
                </span>
                <span className="stat_label">Watched</span>
              </div>
              <div className="stat_item">
                <span className="stat_number">
                  {(CurrentUser?.result?.viewedVideos?.length || 0) * 5}
                </span>
                <span className="stat_label">Points</span>
              </div>
            </div>
          </div>
        )}

        <div className="section_header">
          <span>Menu</span>
        </div>
        <div className="Drawer_leftsidebar">
          {mainLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `icon_sidebar_div ${isActive ? 'active' : ''}`
              }
              end={link.exact}
              onClick={toggleDrawer}
            >
              {({ isActive }) => (
                <div className="sidebar_item_content">
                  <div className="sidebar_icon_wrapper">
                    {isActive ? (
                      <link.activeIcon size={22} className="icon_sidebar active" />
                    ) : (
                      <link.icon size={22} className="icon_sidebar" />
                    )}
                  </div>
                  <div className="text_sidebar_icon">{link.name}</div>
                </div>
              )}
            </NavLink>
          ))}
        </div>

        <div className="premium_section">
          {premiumLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `icon_sidebar_div premium ${isActive ? 'active' : ''}`
              }
              onClick={toggleDrawer}
            >
              <div className="sidebar_item_content premium_content">
                <div className="sidebar_icon_wrapper premium_icon">
                  <link.icon size={22} className="icon_sidebar" />
                </div>
                <div className="text_sidebar_icon">
                  {link.name}
                  <span className="premium_badge">UPGRADE</span>
                </div>
              </div>
            </NavLink>
          ))}
        </div>

        <div className="section_header">
          <span>Library</span>
        </div>
        <div className="libraryBtn_Drawerleftsidebar">
          {libraryLinks.map((link) => {
            if (link.requireAuth && !CurrentUser) return null;

            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `icon_sidebar_div ${isActive ? 'active' : ''}`
                }
                onClick={toggleDrawer}
              >
                {({ isActive }) => (
                  <div className="sidebar_item_content">
                    <div className="sidebar_icon_wrapper">
                      {isActive ? (
                        <link.activeIcon size={22} className="icon_sidebar active" />
                      ) : (
                        <link.icon size={22} className="icon_sidebar" />
                      )}
                    </div>
                    <div className="text_sidebar_icon">{link.name}</div>
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {CurrentUser && subscriptions.length > 0 && (
          <>
            <div className="section_header">
              <span>Subscriptions</span>
              <span className="subscription_count">{subscriptions.length}</span>
            </div>
            <div className="subScriptions_lsdbar">
              {subscriptions.slice(0, 5).map((channel) => (
                <NavLink
                  key={channel._id}
                  to={`/channel/${channel._id}`}
                  className="chanel_lsdbar"
                  onClick={toggleDrawer}
                >
                  <div className="channel_logo">
                    {channel.logo}
                  </div>
                  <div className="channel_name">{channel.name}</div>
                </NavLink>
              ))}

              {subscriptions.length > 5 && (
                <div className="show_more_channels">
                  <NavLink to="/subscriptions" onClick={toggleDrawer}>
                    Show {subscriptions.length - 5} more
                  </NavLink>
                </div>
              )}
            </div>
          </>
        )}

        <div className="section_header">
          <span>Trending</span>
        </div>
        <div className="trending_section">
          <div className="trending_item">
            <AiFillFire className="trending_icon" />
            <span>Music</span>
          </div>
          <div className="trending_item">
            <AiFillFire className="trending_icon" />
            <span>Gaming</span>
          </div>
          <div className="trending_item">
            <AiFillFire className="trending_icon" />
            <span>Movies</span>
          </div>
          <div className="trending_item">
            <AiFillFire className="trending_icon" />
            <span>News</span>
          </div>
        </div>

        <div className="section_header">
          <span>More from YouTube</span>
        </div>
        <div className="youtube_extra">
          <div className="youtube_extra_item">
            <FaYoutube className="youtube_icon" />
            <span>YouTube Premium</span>
          </div>
          <div className="youtube_extra_item">
            <MdLocalMovies className="youtube_icon" />
            <span>Movies & Shows</span>
          </div>
          <div className="youtube_extra_item">
            <MdOndemandVideo className="youtube_icon" />
            <span>Live</span>
          </div>
        </div>

        <div className="section_header">
          <span>Settings</span>
        </div>
        <div className="settings_section">
          <NavLink to="/settings" className="settings_item" onClick={toggleDrawer}>
            <div className="settings_content">
              <div className="settings_icon">⚙️</div>
              <div className="settings_text">Settings</div>
            </div>
          </NavLink>
          <NavLink to="/help" className="settings_item" onClick={toggleDrawer}>
            <div className="settings_content">
              <div className="settings_icon">❓</div>
              <div className="settings_text">Help</div>
            </div>
          </NavLink>
          <NavLink to="/feedback" className="settings_item" onClick={toggleDrawer}>
            <div className="settings_content">
              <div className="settings_icon">💬</div>
              <div className="settings_text">Send feedback</div>
            </div>
          </NavLink>
        </div>

        <div className="sidebar_footer">
          <div className="footer_links">
            <a href="/about">About</a>
            <a href="/press">Press</a>
            <a href="/copyright">Copyright</a>
            <a href="/contact">Contact us</a>
            <a href="/creators">Creators</a>
            <a href="/advertise">Advertise</a>
            <a href="/developers">Developers</a>
          </div>
          <div className="footer_links">
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
            <a href="/policy">Policy & Safety</a>
            <a href="/how">How YouTube works</a>
            <a href="/test">Test new features</a>
          </div>
          <div className="copyright">
            © {new Date().getFullYear()} YouTube Clone
          </div>
        </div>
      </div>

      <div
        className="container3_DrawaerLeftSidebar"
        onClick={toggleDrawer}
      ></div>
    </div>
  );
}

export default DrawerSidebar;