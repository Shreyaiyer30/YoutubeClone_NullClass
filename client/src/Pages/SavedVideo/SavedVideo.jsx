import React from 'react'
import { useSelector } from 'react-redux';
import WHL from '../../Components/WHL/WHL';

function SavedVideo() {
    const savedVideoList = useSelector(state => state.savedVideoReducer)

    return (
        <WHL page={"Saved Video"} videoList={savedVideoList} />
    )
}

export default SavedVideo
