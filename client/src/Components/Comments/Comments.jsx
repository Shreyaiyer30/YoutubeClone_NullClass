import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postComment } from "../../actions/comments";
import "./comments.css";
import DisplayComments from "./DisplayComments";
function Comments({ videoId }) {
  const [commentText, setCommentText] = useState("");

  const CurrentUser = useSelector((state) => state?.currentUserReducer);
  const commentsList = useSelector((s) => s.commentReducer);

  // const commetsList = [
  //   {
  //     _id:"1",
  //     commentBody: "hello",
  //     userCommented: "abc",
  //   },
  //   {
  //     _id:"2",
  //     commentBody: "hiii",
  //     userCommented: "xyz",
  //   },
  // ];

  const dispatch = useDispatch();
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (CurrentUser) {
      if (!commentText) {
        alert("Plz Type your comment ! ");
      } else {
        // Special character validation
        const specialChars = /[^a-zA-Z0-9\s]/g;
        if (specialChars.test(commentText)) {
          alert("Comments cannot contain special characters.");
          return;
        }

        let city = "";
        try {
          const locationRes = await fetch("https://ipapi.co/json/");
          const locationData = await locationRes.json();
          city = locationData.city;
        } catch (error) {
          console.log("Could not fetch location", error);
        }

        dispatch(
          postComment({
            videoId: videoId,
            userId: CurrentUser?.result._id,
            commentBody: commentText,
            userCommented: CurrentUser?.result.name,
            city: city
          })
        );
        setCommentText("");
      }
    } else {
      alert("Plz login to post your commnet !")
    }
  };
  return (
    <>
      <form className="comments_sub_form_comments" onSubmit={handleOnSubmit}>
        <input
          type="text"
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="add comment..."
          value={commentText}
          className="comment_ibox"
        />
        <input type="submit" value="add" className="comment_add_btn_comments" />
      </form>
      <div className="display_comment_container">
        {commentsList?.data
          ?.filter((q) => videoId === q?.videoId)
          .reverse()
          .map((m) => {
            return (
              <DisplayComments
                key={m._id}
                cId={m._id}
                userId={m.userId}
                commentBody={m.commentBody}
                commentOn={m.commentOn}
                userCommented={m.userCommented}
                city={m.city}
                likes={m.likes}
                dislikes={m.dislikes}
              />
            );
          })}
      </div>
    </>
  );
}

export default Comments;
