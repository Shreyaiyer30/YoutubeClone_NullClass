import moment from "moment";
import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { likeComment, dislikeComment, editComment, deleteComment } from "../../actions/comments";
import { AiOutlineLike, AiTwotoneLike, AiOutlineDislike, AiTwotoneDislike } from "react-icons/ai";

function DisplayComments({
  cId,
  commentBody,
  userId,
  commentOn,
  userCommented,
  city,
  likes = [],
  dislikes = []
}) {
  const [Edit, setEdit] = useState(false);
  const [cmtBdy, setcmtBdy] = useState("");
  const [cmtId, setcmtId] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const CurrentUser = useSelector((state) => state?.currentUserReducer);
  const dispatch = useDispatch();

  const handleEdit = (ctId, ctBdy) => {
    setEdit(true);
    setcmtId(ctId);
    setcmtBdy(ctBdy);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!cmtBdy) {
      alert("Type Your comments");
    } else {
      dispatch(
        editComment({
          id: cmtId,
          commentBody: cmtBdy,
        })
      );
      setcmtBdy("");
    }
    setEdit(false);
  };

  const handleDel = (id) => {
    dispatch(deleteComment(id))
  }

  const handleLike = () => {
    if (CurrentUser) {
      dispatch(likeComment(cId, CurrentUser.result._id));
    } else {
      alert("Please login to like");
    }
  }

  const handleDislike = () => {
    if (CurrentUser) {
      dispatch(dislikeComment(cId, CurrentUser.result._id));
    } else {
      alert("Please login to dislike");
    }
  }

  const handleTranslate = async () => {
    try {
      // Using MyMemory Translation API (Free tier)
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${commentBody}&langpair=en|hi`); // Defaulting to Hindi for now as an example, user asked for "desired language" but UI for language selection is complex for now. I'll strictly stick to requirements: "translate to their desired language".
      // To make it simple I'll prompt user or just toggle. Let's start with a prompt.
      const lang = prompt("Enter language code (e.g., 'es', 'fr', 'hi', 'de'):", "hi");
      if (!lang) return;

      const res = await fetch(`https://api.mymemory.translated.net/get?q=${commentBody}&langpair=autodetect|${lang}`);
      const data = await res.json();
      setTranslatedText(data.responseData.translatedText);
    } catch (error) {
      console.error(error);
      alert("Translation failed");
    }
  }

  return (
    <>
      {Edit ? (
        <>
          <form
            className="comments_sub_form_comments"
            onSubmit={handleOnSubmit}
          >
            <input
              type="text"
              onChange={(e) => setcmtBdy(e.target.value)}
              placeholder="Edit comment..."
              value={cmtBdy}
              className="comment_ibox"
            />
            <input
              type="submit"
              value="Change"
              className="comment_add_btn_comments"
            />
          </form>
        </>
      ) : (
        <div className="comment_body_container">
          <p className="comment_body">{commentBody}</p>
          {translatedText && <p className="comment_translated">Translated: {translatedText}</p>}
        </div>
      )}
      <p className="usercommented">
        {" "}
        - {userCommented} {city && `(${city})`} commented {moment(commentOn).fromNow()}
      </p>

      <div className="comment_actions">
        <div className="like_dislike_comment">
          <span onClick={handleLike} className="like_btn_comment">
            {likes.includes(CurrentUser?.result._id) ? <AiTwotoneLike /> : <AiOutlineLike />}
            {likes.length > 0 && <span>{likes.length}</span>}
          </span>
          <span onClick={handleDislike} className="dislike_btn_comment">
            {dislikes.includes(CurrentUser?.result._id) ? <AiTwotoneDislike /> : <AiOutlineDislike />}
          </span>
        </div>
        <button className="translate_btn" onClick={handleTranslate}>Translate</button>
      </div>

      {CurrentUser?.result._id === userId && (
        <p className="EditDel_DisplayCommendt">
          <i onClick={() => handleEdit(cId, commentBody)}>Edit</i>
          <i onClick={() => handleDel(cId)} >Delete</i>
        </p>
      )}
    </>
  );
}

export default DisplayComments;
