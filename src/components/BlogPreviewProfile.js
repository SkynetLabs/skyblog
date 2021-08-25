import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ButtonBase from "@material-ui/core/ButtonBase";
import { getDateDisplay } from "../data/dateDisplay";
import { postRoute } from "../data/pageRouting";
import { useHistory } from "react-router-dom";

//BlogPreviewProfile component is a preview of blog posts for display in a feed
export default function BlogPreviewProfile(props) {
  const { post, id } = props; //post data and post id
  const history = useHistory();

  return (
    <ButtonBase
      component={Container}
      onClick={() => postRoute(id, post, history)}
      maxWidth={"sm"}
      style={{ marginTop: 30 }}
    >
      <Typography variant={"caption"} color={"primary"}>
        Published on {getDateDisplay(post.ts)}
      </Typography>
      <Typography variant={"h3"}>{post.content.title}</Typography>
      {post.content.ext != null ? (
        <Typography variant={"h5"} color={"textSecondary"} gutterBottom={true}>
          {post.content.ext.subtitle}
        </Typography>
      ) : null}
      <Divider />
    </ButtonBase>
  );
}
