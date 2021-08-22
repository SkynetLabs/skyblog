import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ButtonBase from "@material-ui/core/ButtonBase";
import { useHistory } from "react-router-dom";

export default function BlogPreviewProfile(props) {
  const { post, id } = props;
  const history = useHistory();

  const getDateDisplay = (ts) => {
    const d = new Date(ts);
    return d.toDateString();
  };
  const getPreviewText = () => {
    const text = JSON.parse(post.content.text);
    console.log("TEXT: ", text);
    return "Example body preview";
  };
  const postRoute = () => {
    const newRoute =
      "/" + id + "/feed-dac.hns/localhost/posts/page_0.json/" + post.id;
    console.log("NEW ROUTE", newRoute);
    history.push(newRoute);
  };

  return (
    <ButtonBase
      component={Container}
      onClick={postRoute}
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
