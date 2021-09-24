import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import { getDateDisplay } from "../data/dateDisplay";
import { postRoute } from "../data/pageRouting";
import { useHistory } from "react-router-dom";
import CardMedia from "@material-ui/core/CardMedia";
import PreviewMenu from "../components/PreviewMenu";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import { useWindowSize } from "../data/useWindowSize";

//number of lines to show for subtitle
const LINES_TO_SHOW = 2;
//styling to truncate subtitle at two lines
const useStyles = makeStyles({
  multiLineEllipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    height: 65,
    "-webkit-line-clamp": LINES_TO_SHOW,
    "-webkit-box-orient": "vertical",
  },
});

//BlogPreviewProfile component is a preview of blog posts for display in a feed
export default function BlogPreviewProfile(props) {
  /*
    post, feedDAC, isMine, handlePin, handleRemovePost -> post data, feedDAC instance, bool for is my post, function to pin post, function to remove post
    windowSize -> size of the current window, array [width, height]
    deletingPost -> status of post deletion
    history -> react router hook
    classes -> styles for subtitle text
     */
  const { post, feedDAC, isMine, handlePin, handleRemovePost } = props;
  const windowSize = useWindowSize();
  const [deletingPost, setDeletingPost] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  return (
    <Card
      style={{
        width:
          (!post.isPinned && windowSize[0] < 600) ||
          (post.isPinned && windowSize[0] < 450)
            ? windowSize[0] * 0.9
            : post.isPinned
            ? 450
            : 600,
        boxShadow: "none",
      }}
    >
      <CardActionArea
        onClick={() => postRoute(post, history)}
        disabled={deletingPost}
      >
        {post.content.previewImage ? (
          <CardMedia
            component={"img"}
            image={post.content.previewImage}
            style={{
              marginBottom: 14,
              zIndex: 1,
              height: post.isPinned ? 250 : 350,
            }}
          />
        ) : null}
        <CardContent>
          <Typography variant={"caption"} color={"primary"}>
            Published on {getDateDisplay(post.ts)}
          </Typography>
          <Typography noWrap variant={"h4"}>
            {post.content.title}
          </Typography>
          {post.content.ext != null ? (
            <Typography
              variant={"h5"}
              color={"textSecondary"}
              gutterBottom={true}
              className={classes.multiLineEllipsis}
            >
              {post.content.ext.subtitle}
            </Typography>
          ) : null}
        </CardContent>
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
      </CardActionArea>
    </Card>
  );
}
