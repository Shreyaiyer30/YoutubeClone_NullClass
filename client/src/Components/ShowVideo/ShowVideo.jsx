import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import './ShowVideo.css'
function ShowVideo({ vid, isList }) {
  return (
    <div className={`video_container_ShowVideo ${isList ? 'horizontal' : ''}`}>
      <Link to={`/videopage/${vid?._id}`} className='video_link'>
        <video
          src={`http://localhost:5000/${vid?.filePath?.replace(/\\/g, '/').split('uploads/')[1] ? 'uploads/' + vid?.filePath?.replace(/\\/g, '/').split('uploads/')[1] : vid?.filePath?.replace(/\\/g, '/')}`}
          className={`video_ShowVideo ${isList ? 'horizontal_video_ShowVideo' : ''}`}
        />
      </Link>
      <div className={`video_description ${isList ? 'horizontal_description' : ''}`}>
        {!isList && (
          <div className='Chanel_logo_App'>
            <div className='fstChar_logo_App'>
              <>{vid?.uploader?.charAt(0).toUpperCase()}</>
            </div>
          </div>
        )}
        <div className={`video_details ${isList ? 'horizontal_details' : ''}`}>
          <p className={`title_vid_ShowVideo ${isList ? 'horizontal_title' : ''}`}>{vid?.title}</p>
          <pre className='vid_views_UploadTime'>{vid?.uploader}</pre>
          <pre className='vid_views_UploadTime'>
            {vid?.views} views <div className="dot"></div> {moment(vid?.uploadDate).fromNow()}
          </pre>
        </div>
      </div>
    </div>
  )
}


export default ShowVideo