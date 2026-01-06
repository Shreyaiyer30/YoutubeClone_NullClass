import "./App.css";
import React, { useEffect } from "react";
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./Pages/Home/Home";
import VideoPage from "./Pages/VideoPage/VideoPage";
import Search from "./Pages/Search/Search";
import Chanel from "./Pages/Chanel/Chanel";
import Auth from "./Pages/Auth/Auth";
// import Payment from "./Pages/Payment/Payment";
import LeftSidebar from "./Components/LeftSidebar/LeftSidebar";
import Subscriptions from "./Pages/Subscriptions/Subscriptions";
import WatchLater from "./Pages/WatchLater/WatchLater";
import LikedVideo from "./Pages/LikedVideo/LikedVideo";
import WatchHistory from "./Pages/WatchHistory/WatchHistory";
import Library from "./Pages/Library/Library";
import YourVideo from "./Pages/YourVideo/YourVideo";
import SavedVideo from "./Pages/SavedVideo/SavedVideo";
import DrawerSidebar from "./Components/LeftSidebar/DrawerSidebar";

import CreateEditChanel from "./Pages/Chanel/CreateEditChanel";
import { useDispatch } from "react-redux";
import { fetchAllChanel } from "./actions/chanelUser";
import VideoUpload from "./Pages/VideoUpload/VideoUpload";
import { getAllVideo } from "./actions/video";
import { getAlllikedVideo } from "./actions/likedVideo";
import { getAllwatchLater } from "./actions/watchLater";
import { getAllHistory } from "./actions/History";
import { getAllSavedVideo } from "./actions/savedVideo";

import { ThemeProvider } from "./Context/ThemeContext";
import { setCurrentUser } from "./actions/currentUser";
import Settings from "./Pages/Settings/Settings";
import Trending from "./Pages/Trending/Trending";
import Help from "./Pages/Help/Help";
import Feedback from "./Pages/Feedback/Feedback";
import Plans from "./Pages/Plans/Plans";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Restore user session from localStorage
    const profile = JSON.parse(localStorage.getItem('Profile'));
    if (profile) {
      dispatch(setCurrentUser(profile));
    }

    dispatch(fetchAllChanel());
    dispatch(getAllVideo());
    dispatch(getAlllikedVideo());
    dispatch(getAllwatchLater());
    dispatch(getAllHistory());
    dispatch(getAllSavedVideo());
  }, [dispatch]);


  const [toggleDrawerSidebar, setToggleDrawerSidebar] = useState({
    display: "none",
  });

  const toggleDrawer = () => {
    if (toggleDrawerSidebar.display === "none") {
      setToggleDrawerSidebar({
        display: "flex",
      });
    } else {
      setToggleDrawerSidebar({
        display: "none",
      });
    }
  };

  const [vidUploadPage, setVidUploadPage] = useState(false);
  const [EditCreateChanelBtn, setEditCreateChanelBtn] = useState(false);

  return (
    <ThemeProvider>
      <Router>
        {vidUploadPage && <VideoUpload setVidUploadPage={setVidUploadPage} />}
        {EditCreateChanelBtn && (
          <CreateEditChanel setEditCreateChanelBtn={setEditCreateChanelBtn} />
        )}

        <Navbar
          setEditCreateChanelBtn={setEditCreateChanelBtn}
          toggleDrawer={toggleDrawer}
        />

        <DrawerSidebar
          toggleDrawer={toggleDrawer}
          toggleDrawerSidebar={toggleDrawerSidebar}
        />

        <div className="app_main_container">
          <div className="left_sidebar_container">
            <LeftSidebar />
          </div>

          <div className="main_content_container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search/:searchQuery" element={<Search />} />
              <Route path="/videopage/:vid" element={<VideoPage />} />
              <Route path="/chanel/:id" element={<Chanel setVidUploadPage={setVidUploadPage} setEditCreateChanelBtn={setEditCreateChanelBtn} />} />
              <Route
                path="/auth"
                element={
                  <Auth
                    setEditCreateChanelBtn={setEditCreateChanelBtn}
                  />
                }
              />
              {/* <Route path="/payment" element={<Payment />} /> */}
              <Route path="/plans" element={<Plans />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/watchlater" element={<WatchLater />} />
              <Route path="/likedvideo" element={<LikedVideo />} />
              <Route path="/history" element={<WatchHistory />} />
              <Route path="/library" element={<Library />} />
              <Route path="/yourvideos" element={<YourVideo />} />
              <Route path="/savevideo" element={<SavedVideo />} />
              <Route path="/settings" element={<Settings />} />

              <Route path="/trending" element={<Trending />} />
              <Route path="/help" element={<Help />} />
              <Route path="/feedback" element={<Feedback />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;