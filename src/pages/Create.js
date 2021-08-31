import React, { useState, useRef, useContext, useEffect } from "react";
import { SkynetContext } from "../state/SkynetContext";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import MarkdownEditor from "../components/MarkdownEditor";
import Button from "@material-ui/core/Button";
import { createBlogPost, editBlogPost } from "../data/feedLibrary";
import { useHistory, useLocation } from "react-router-dom";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

//Create page component, used to create MD blog posts, returns JSX layout
export default function Create(props) {
  /*
  title -> blog title
  subtitle -> blog subtitle
  blogMD -> blog markdown state
  isEditing -> state to determine whether user is editing or creating a post
  isPublishLoading -> state to handle publish loading feedback
  mdEditor -> markdown editor reference
  feedDAC, userID, isMySkyLoading, initiateLogin, mySky -> value to use from SkynetContext
  history -> react router hook
  location -> react router hook
   */
  const [title, setTitle] = useState();
  const [subtitle, setSubtitle] = useState();
  const [blogMD, setBlogMD] = useState("");
  const [isEditing, setEditing] = useState(false);
  const [isPublishLoading, setPublishLoading] = useState(false);
  const mdEditor = useRef();
  const { feedDAC, userID, isMySkyLoading, initiateLogin, mySky } =
    useContext(SkynetContext);
  let history = useHistory();
  let location = useLocation();

  useEffect(() => {
    if (location.state) {
      setEditing(true);
      setTitle(location.state.title);
      setSubtitle(location.state.subtitle);
      setBlogMD(location.state.blogBody);
    }
  }, [location]);

  //handle the title input change
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  //handle the subtitle input change
  const handleSubtitleChange = (event) => {
    setSubtitle(event.target.value);
  };

  //handle the publishing of a blog and re-route to blog viewing page on success
  const handlePublish = async () => {
    setPublishLoading(true);
    let res;
    if (isEditing) {
      res = await editBlogPost(
        title,
        subtitle,
        blogMD,
        location.state.postPath,
        location.state.postRef,
        mySky
      );
    } else {
      res = await createBlogPost(title, subtitle, blogMD, feedDAC, mySky);
    }
    if (res.success) {
      const newRoute = `${res.ref.substring(6)}`;
      setPublishLoading(false);
      history.push(newRoute.replace("#", "/"));
    }
  };

  //return JSX for create page
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
      ) : !userID ? (
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
            <Button
              variant={"contained"}
              color={"primary"}
              onClick={initiateLogin}
            >
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
              value={title}
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
              value={subtitle}
              onChange={handleSubtitleChange}
              InputProps={{ style: { fontSize: 30, marginBottom: 12 } }}
            />
          </Grid>
          <MarkdownEditor
            mdEditor={mdEditor}
            setBlogMD={setBlogMD}
            blogMD={blogMD}
          />
          {title && blogMD ? (
            <Button
              onClick={handlePublish}
              disabled={isPublishLoading}
              fullWidth={true}
              variant="contained"
              color="primary"
            >
              {isEditing ? "Save Changes" : "Publish"}
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
