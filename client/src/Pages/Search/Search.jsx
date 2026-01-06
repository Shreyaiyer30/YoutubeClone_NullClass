import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ShowVideoGrid from "../../Components/ShowVideoGrid/ShowVideoGrid";
// import "./Search.css";

function Search() {
  const { searchQuery } = useParams();
  const videosList = useSelector((state) => state.videoReducer?.data);

  const searchResults = videosList?.filter((video) =>
    (video?.title || video?.videoTitle)?.toUpperCase().includes(searchQuery?.toUpperCase())
  );

  return (
    <div className="container_Pages_App">
      <div className="container2_Pages_App">
        <h2 style={{ color: "white" }}>Search Results for "{searchQuery}"</h2>
        <ShowVideoGrid vids={searchResults} />
      </div>
    </div>
  );
}

export default Search;