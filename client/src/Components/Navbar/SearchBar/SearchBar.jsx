import React, { useState } from "react";
import "./SearchBar.css";
import { BsMicFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import SearchList from "./SearchList";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { useSelector } from "react-redux";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [seachListA, setSeachList] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const TitleArray = useSelector(s => s?.videoReducer)
    ?.data?.filter(q => (q?.videoTitle || q?.title)?.toUpperCase().includes(searchQuery?.toUpperCase())).map(m => m?.videoTitle || m?.title);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
      setSeachList(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <div className="SearchBar_Container">
        <div className="SearchBar_Container2">
          <div className="search_div">
            <input type="text" className="iBox_SearchBar" placeholder="Search"
              onChange={e => setSearchQuery(e.target.value)}
              value={searchQuery}
              onClick={e => setSeachList(true)}
              onKeyDown={handleKeyDown} // Listen for Enter key
            />
            <Link to={`/search/${searchQuery}`} onClick={() => setSeachList(false)}>
              <FaSearch className="searchIcon_SearchBar" />
            </Link>
            <BsMicFill className="Mic_SearchBar" />
            {searchQuery && seachListA &&
              <SearchList
                setSearchQuery={setSearchQuery}
                TitleArray={TitleArray}
              />
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchBar;
