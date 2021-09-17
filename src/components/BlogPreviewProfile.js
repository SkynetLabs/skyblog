import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ButtonBase from "@material-ui/core/ButtonBase";
import { getDateDisplay } from "../data/dateDisplay";
import { postRoute } from "../data/pageRouting";
import { useHistory } from "react-router-dom";
import CardMedia from "@material-ui/core/CardMedia";
import PreviewMenu from "../components/PreviewMenu";

//BlogPreviewProfile component is a preview of blog posts for display in a feed
export default function BlogPreviewProfile(props) {
  /*
    post, feedDAC, isMine, handlePin, handleRemovePost -> post data, feedDAC instance, bool for is my post, function to pin post, function to remove post
    history -> react router hook
     */
  const { post, feedDAC, isMine, handlePin, handleRemovePost } = props;
  const history = useHistory();

  return (
    <ButtonBase
      component={Container}
      onClick={() => postRoute(post, history)}
      maxWidth={"sm"}
      style={{ padding: 0 }}
    >
      {isMine ? (
        <PreviewMenu
          post={post}
          feedDAC={feedDAC}
          history={history}
          handlePin={handlePin}
          handleRemovePost={handleRemovePost}
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
          >
            {post.content.ext.subtitle}
          </Typography>
        ) : null}
      </Container>
      <Divider />
    </ButtonBase>
  );
}
