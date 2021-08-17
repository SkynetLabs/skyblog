import React, { useState, useRef, useContext } from "react";
import { SkynetContext } from "../state/SkynetContext";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import MarkdownEditor from "../components/MarkdownEditor";
import Button from "@material-ui/core/Button";
import { createBlogPost, loadBlogPost } from "../data/feedLibrary";
import { Link, useHistory } from "react-router-dom";

//Create page component, used to create MD blog posts, returns JSX layout
export default function Create(props) {
  //states to track store the blog text
  const [title, setTitle] = useState(); //blog title
  const [subtitle, setSubtitle] = useState(); //blog subtitle
  const [blogMD, setBlogMD] = useState(null);
  const mdEditor = useRef();
  const { feedDAC } = useContext(SkynetContext);
  let history = useHistory();
  const [ref, setRef] = useState(
    "ed25519-f5cdd930247372dca7b757ee63c9702f8a2eeaf4c519eb75551dadd129424e8e/feed-dac.hns/localhost/posts/page_0.json/5"
  );

  //handle the title input change
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  //handle the subtitle input change
  const handleSubtitleChange = (event) => {
    setSubtitle(event.target.value);
  };

  const handlePublish = async () => {
    console.log("TITLE: ", title);
    console.log("Subtitle: ", subtitle);
    console.log("Body: \n", blogMD);
    const res = await createBlogPost(title, subtitle, blogMD, feedDAC);
    if (res.success) {
      const newRoute = `${res.ref.substring(6)}`;
      console.log("NEW ROUTE", newRoute.replace("#", "/"));
      history.push(newRoute.replace("#", "/"));
    }
  };

  const handleLoad = async () => {
    const ref =
      "sky://ed25519-f5cdd930247372dca7b757ee63c9702f8a2eeaf4c519eb75551dadd129424e8e/feed-dac.hns/localhost/posts/page_0.json#4";
    const res = await loadBlogPost(ref, feedDAC);
  };
  const handleRoute = () => {
    const newRoute =
      "ed25519-f5cdd930247372dca7b757ee63c9702f8a2eeaf4c519eb75551dadd129424e8e/feed-dac.hns/localhost/posts/page_0.json/5";
    console.log("NEW ROUTE", newRoute);
    history.push(newRoute);
  };

  //return JSX for create page
  //Title Input, Subtitle Input

  return (
    <Container
      id={"create-container"}
      maxWidth={"md"}
      style={{ marginTop: 14 }}
    >
      <Grid container direction={"row"} alignItems={"center"}>
        <TextField
          label={"Title"}
          fullWidth={true}
          autoFocus={true}
          multiline={true}
          rowsMax={3}
          onChange={handleTitleChange}
          InputProps={{ style: { fontSize: 40, marginBottom: 12 } }}
        />
      </Grid>
      <Grid container direction={"row"} alignItems={"center"}>
        <TextField
          label={"Subtitle"}
          fullWidth={true}
          multiline={true}
          rowsMax={4}
          onChange={handleSubtitleChange}
          InputProps={{ style: { fontSize: 30, marginBottom: 12 } }}
        />
      </Grid>
      <MarkdownEditor mdEditor={mdEditor} setBlogMD={setBlogMD} />
      {title != null && title != "" && blogMD != null && blogMD != "" ? (
        <Button
          onClick={handlePublish}
          fullWidth={true}
          variant="contained"
          color="primary"
        >
          Publish
        </Button>
      ) : null}
      <Button
        onClick={handleRoute}
        fullWidth={true}
        variant="contained"
        color="primary"
      >
        Redirect
      </Button>
    </Container>
  );
}
