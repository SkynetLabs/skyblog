import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import { getDateDisplay } from "../data/dateDisplay";
import { postRoute } from "../data/pageRouting";
import { useHistory } from "react-router-dom";
import CardMedia from "@material-ui/core/CardMedia";
import PreviewMenu from "../components/PreviewMenu";
import { makeStyles } from "@material-ui/core/styles";

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

//PinnedBlogPreview component is a preview of blog posts for display in a feed
export default function PinnedBlogPreview(props) {
  /*
    post, feedDAC, isMine, handlePin, handleRemovePost -> post data, feedDAC instance, bool for is my post, function to pin post, function to remove post
    history -> react router hook
    classes -> styling for subtitle
     */
  const { post, feedDAC, isMine, handlePin, handleRemovePost } = props;
  const history = useHistory();
  const classes = useStyles();
  return (
    <ButtonBase
      component={Container}
      onClick={() => postRoute(post, history)}
      maxWidth={"xs"}
      style={{ padding: 0, minWidth: 400 }}
    >
      {isMine ? (
        <PreviewMenu
          post={post}
          feedDAC={feedDAC}
          history={history}
          handleRemovePost={handleRemovePost}
          handlePin={handlePin}
        />
      ) : null}
      <Container style={{ paddingTop: 30 }}>
        {post.content.previewImage ? (
          <CardMedia
            component={"img"}
            image={post.content.previewImage}
            style={{ marginBottom: 14, zIndex: 1 }}
          />
        ) : null}
        <Typography variant={"caption"} color={"primary"}>
          Published on {getDateDisplay(post.ts)}
        </Typography>
        <Typography noWrap variant={"h3"}>
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
      </Container>
    </ButtonBase>
  );
}
