import React, { useState, useEffect, useContext } from "react";
import { SkynetContext } from "../state/SkynetContext";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import Divider from "@material-ui/core/Divider";

export default function BlogPreviewProfile(props) {
  const { post } = props;

  const getDateDisplay = (ts) => {
    const d = new Date(ts);
    return d.toDateString();
  };
  const getPreviewText = () => {
    const text = JSON.parse(post.content.text);
    console.log("TEXT: ", text);
    return "Example body preview";
  };

  return (
    <Container maxWidth={"sm"} style={{ marginTop: 30 }}>
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
    </Container>
  );
}
