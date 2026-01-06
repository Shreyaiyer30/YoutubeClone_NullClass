import React, { useState, useEffect, useCallback } from "react";
import "./Navbar.css";
import logo from "./logo.ico";
import SearchBar from "./SearchBar/SearchBar";
import { RiVideoAddLine } from "react-icons/ri";
import { BiUserCircle } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import Auth from "../../Pages/Auth/Auth";
import ThemeToggle from "../../Context/ThemeToggle";

// Time constants for better maintainability
const VIDEO_CALL_HOURS = {
  START: 18, // 6 PM in 24-hour format
  END: 24,   // 12 AM (midnight)
};

function Navbar({ toggleDrawer, setEditCreateChanelBtn }) {
  const [AuthBtn, setAuthBtn] = useState(false);
  const [isVideoCallAvailable, setIsVideoCallAvailable] = useState(false);
  const CurrentUser = useSelector((state) => state?.currentUserReducer);
  const navigate = useNavigate();
  // const dispatch = useDispatch(); // Removing unused dispatch

  // Safe user data extraction
  const user = CurrentUser?.result || {};
  const userName = user.name || '';
  const userEmail = user.email || '';
  const userInitial = userName.charAt(0) || userEmail.charAt(0) || '?';

  // Check if current time is within video call hours
  const checkVideoCallAvailability = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();

    const isAvailable = currentHour >= VIDEO_CALL_HOURS.START &&
      currentHour < VIDEO_CALL_HOURS.END;

    setIsVideoCallAvailable(isAvailable);
    return isAvailable;
  }, []);

  // Handle video call button click
  const handleVideoCallClick = useCallback((e) => {
    e.preventDefault();

    if (!checkVideoCallAvailability()) {
      const now = new Date();
      const nextAvailableTime = new Date(now);

      if (now.getHours() < VIDEO_CALL_HOURS.START) {
        // If before 6 PM, set to 6 PM today
        nextAvailableTime.setHours(VIDEO_CALL_HOURS.START, 0, 0, 0);
      } else {
        // If after midnight, set to 6 PM tomorrow
        nextAvailableTime.setDate(nextAvailableTime.getDate() + 1);
        nextAvailableTime.setHours(VIDEO_CALL_HOURS.START, 0, 0, 0);
      }

      const formattedTime = nextAvailableTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });

      alert(`Video calls are only available from 6 PM to 12 AM.\nNext available at ${formattedTime}`);
      return;
    }

    // Navigate to video call page if available
    navigate('/videocall');
  }, [checkVideoCallAvailability, navigate]);

  // Format time remaining for next available slot
  const getTimeRemainingMessage = () => {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour < VIDEO_CALL_HOURS.START) {
      const hoursLeft = VIDEO_CALL_HOURS.START - currentHour;
      return `${hoursLeft} hour${hoursLeft > 1 ? 's' : ''} remaining`;
    } else {
      return "Available until 12 AM";
    }
  };

  useEffect(() => {
    // Initial check
    checkVideoCallAvailability();

    // Set up interval to check every minute
    const interval = setInterval(checkVideoCallAvailability, 60000);

    return () => clearInterval(interval);
  }, [checkVideoCallAvailability]);

  return (
    <>
      <div className="Container_Navbar">
        <div className="Burger_Logo_Navbar">
          <div
            className="burger"
            onClick={toggleDrawer}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && toggleDrawer()}
            aria-label="Toggle navigation menu"
          >
            <p></p>
            <p></p>
            <p></p>
          </div>

          <Link to="/" className="logo_div_Navbar" aria-label="YouTube homepage">
            <img src={logo} alt="YouTube Logo" />
            <p className="logo_title_navbar">YouTube</p>
          </Link>
        </div>

        <SearchBar />

        <button
          id="videoCallBtn"
          className={`Video_Btn ${!isVideoCallAvailable ? 'disabled' : ''}`}
          onClick={handleVideoCallClick}
          disabled={!isVideoCallAvailable}
          aria-label={isVideoCallAvailable ? "Start video call" : "Video call unavailable"}
          title={isVideoCallAvailable ? getTimeRemainingMessage() : "Available 6 PM to 12 AM"}
        >
          <RiVideoAddLine
            size={22}
            className={`vid_bell_Navbar ${!isVideoCallAvailable ? 'icon-disabled' : ''}`}
          />
          {!isVideoCallAvailable && (
            <span className="video-call-indicator" aria-hidden="true"></span>
          )}
        </button>

        <div className="premium-theme-container">
          <Link to="/plans" className="premium_btn">
            Premium
          </Link>
          <div className="theme-toggle-wrapper">
            <ThemeToggle />
          </div>
        </div>

        <button
          className="notifications-btn"
          aria-label="Notifications"
        >
          <IoMdNotificationsOutline size={22} className="vid_bell_Navbar" />
        </button>

        <div className="Auth_cont_Navbar">
          {CurrentUser?.result ? (
            <button
              className="Chanel_logo_App"
              onClick={() => setAuthBtn(true)}
              aria-label="User profile"
              aria-expanded={AuthBtn}
            >
              <p className="fstChar_logo_App">
                {userInitial}
              </p>
            </button>
          ) : (
            <button
              onClick={() => setAuthBtn(true)}
              className="Auth_Btn"
              aria-label="Sign in"
            >
              <BiUserCircle size={22} />
              <b>Sign in</b>
            </button>
          )}
        </div>
      </div>

      {AuthBtn && (
        <Auth
          setEditCreateChanelBtn={setEditCreateChanelBtn}
          setAuthBtn={setAuthBtn}
          User={CurrentUser}
        />
      )}
    </>
  );
}

export default Navbar;