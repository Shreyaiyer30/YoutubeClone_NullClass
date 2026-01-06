import React from "react";
import { useSelector } from "react-redux";
import LeftSidebar from "../../Components/LeftSidebar/LeftSidebar";
import ShowVideoGrid from "../../Components/ShowVideoGrid/ShowVideoGrid";
import "./Home.css";

function Home() {
  const vids = useSelector(state => state.videoReducer)?.data?.filter(q => q);

  const NavList = [
    "All",
    "Movies",
    "Science",
    "Animation",
    "Gaming",
    "Comedy",
    "Entertainment",
    "Music",
    "Technology",
    "News",
    "Health",
    "Sports",
    "Travel",
    "Food",
    "Education",
    "Business",

  ];

  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filterVideos = (videos) => {
    if (selectedCategory === "All") return videos;
    return videos.filter(video => {
      const categoryMatch = video.category?.toLowerCase() === selectedCategory.toLowerCase();
      const titleMatch = video.title?.toLowerCase().includes(selectedCategory.toLowerCase());
      const tagMatch = video.tags?.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase());
      return categoryMatch || titleMatch || tagMatch;
    });
  };

  const filteredVids = filterVideos(vids || []);

  return (
    <div className="container_Pages_App">
      <div className="container2_Pages_App">
        <div className="navigation_Home">
          {NavList.map((m) => (
            <p
              key={m}
              className={`btn_nav_home ${selectedCategory === m ? "selected" : ""}`}
              onClick={() => setSelectedCategory(m)}
              style={{ backgroundColor: selectedCategory === m ? "white" : "", color: selectedCategory === m ? "black" : "" }}
            >
              {m}
            </p>
          ))}
        </div>
        <ShowVideoGrid vids={filteredVids} />
      </div>
    </div>
  );
}

export default Home;
