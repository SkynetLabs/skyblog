import React, { useState, useRef, useContext } from "react";
import { SkynetContext } from "../state/SkynetContext";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import MarkdownEditor from "../components/MarkdownEditor";
import Button from "@material-ui/core/Button";
import { createBlogPost, loadBlogPost } from "../data/feedLibrary";
import { useHistory } from "react-router-dom";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

//Create page component, used to create MD blog posts, returns JSX layout
export default function Create(props) {
  //states to track store the blog text
  const [title, setTitle] = useState(); //blog title
  const [subtitle, setSubtitle] = useState(); //blog subtitle
  const [blogMD, setBlogMD] = useState(null);
  const [isPublishLoading, setPublishLoading] = useState(false);
  const mdEditor = useRef();
  const { feedDAC, userID, isMySkyLoading } = useContext(SkynetContext);
  let history = useHistory();

  //handle the title input change
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  //handle the subtitle input change
  const handleSubtitleChange = (event) => {
    setSubtitle(event.target.value);
  };

  const handlePublish = async () => {
    setPublishLoading(true);
    console.log("TITLE: ", title);
    console.log("Subtitle: ", subtitle);
    console.log("Body: \n", blogMD);
    const res = await createBlogPost(title, subtitle, blogMD, feedDAC);
    if (res.success) {
      const newRoute = `${res.ref.substring(6)}`;
      console.log("NEW ROUTE", newRoute.replace("#", "/"));
      setPublishLoading(false);
      history.push(newRoute.replace("#", "/"));
    }
  };

  //return JSX for create page
  //Title Input, Subtitle Input

  return (
    <Container
      id={"create-container"}
      maxWidth={"md"}
      style={{ marginTop: 14 }}
    >
      {isMySkyLoading ? (
        <Backdrop style={{ zIndex: 10 }} open={true}>
          <CircularProgress color={"inherit"} />
        </Backdrop>
      ) : userID == null || userID == "" ? (
        <Container maxWidth={"sm"}>
          <Paper
            elevation={2}
            style={{
              padding: 20,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography align={"center"} variant={"h4"} gutterBottom={true}>
              Login using MySky to tell your story on SkyBlog.
            </Typography>
            <Button variant={"contained"} color={"primary"}>
              Login with MySky
            </Button>
          </Paper>
        </Container>
      ) : (
        <>
          <Grid container direction={"row"} alignItems={"center"}>
            <TextField
              label={"Title"}
              fullWidth={true}
              autoFocus={true}
              multiline={true}
              maxRows={3}
              onChange={handleTitleChange}
              InputProps={{ style: { fontSize: 40, marginBottom: 12 } }}
            />
          </Grid>
          <Grid container direction={"row"} alignItems={"center"}>
            <TextField
              label={"Subtitle"}
              fullWidth={true}
              multiline={true}
              maxRows={4}
              onChange={handleSubtitleChange}
              InputProps={{ style: { fontSize: 30, marginBottom: 12 } }}
            />
          </Grid>
          <MarkdownEditor mdEditor={mdEditor} setBlogMD={setBlogMD} />
          {title != null && title != "" && blogMD != null && blogMD != "" ? (
            <Button
              onClick={handlePublish}
              disabled={isPublishLoading}
              fullWidth={true}
              variant="contained"
              color="primary"
            >
              Publish
            </Button>
          ) : null}
        </>
      )}
      <Backdrop style={{ zIndex: 10 }} open={isPublishLoading}>
        <CircularProgress color={"inherit"} />
      </Backdrop>
    </Container>
  );
}
