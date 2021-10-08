import React, { useState } from "react";
import { getDateDisplay } from "../data/dateDisplay";
import { useHistory } from "react-router-dom";
import PreviewMenu from "../components/PreviewMenu";

//BlogPreviewProfile component is a preview of blog posts for display in a feed
export default function BlogPreviewProfile(props) {
  /*
    post, feedDAC, isMine, handlePin, handleRemovePost -> post data, feedDAC instance, bool for is my post, function to pin post, function to remove post
    deletingPost -> status of post deletion
    history -> react router hook
     */
  const { post, feedDAC, isMine, handlePin, handleRemovePost } = props;
  const [deletingPost, setDeletingPost] = useState(false);
  const history = useHistory();

  return (
    <a
      href={
        deletingPost ? false : "/#" + post.ref.replace("#", "/").substring(5)
      }
      className={deletingPost ? "space-y-4 cursor-default" : "space-y-4"}
    >
      <div className="aspect-w-3 aspect-h-2 bg-palette-100 rounded-lg">
        {post.content.previewImage ? (
          <img
            className="object-cover shadow-lg rounded-lg hover:opacity-90 transition-opacity bg-palette-600"
            src={post.content.previewImage}
            alt="Post preview"
          />
        ) : null}
        {isMine ? (
          <PreviewMenu
            post={post}
            feedDAC={feedDAC}
            history={history}
            handlePin={handlePin}
            handleRemovePost={handleRemovePost}
            deletingPost={deletingPost}
            setDeletingPost={setDeletingPost}
          />
        ) : null}
      </div>

      <div className="space-y-1">
        <p className={"text-primary text-xs sm:text-xs"}>
          Published on {getDateDisplay(post.ts)}
        </p>
        <p className="font-semibold text-xl sm:text-xl line-clamp-2">
          {post.content.title}
        </p>
        <p className="text-base sm:text-base font-content text-palette-400 line-clamp-3">
          {post.content.ext.subtitle}
        </p>
      </div>
    </a>
  );
}
