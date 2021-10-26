import React, { useState, useRef, useContext, useEffect } from "react";
import { SkynetContext } from "../state/SkynetContext";
import TextField from "@material-ui/core/TextField";
import MarkdownEditor from "../components/MarkdownEditor";
import { createBlogPost, editBlogPost } from "../data/feedLibrary";
import { useHistory, useLocation } from "react-router-dom";
import Backdrop from "@material-ui/core/Backdrop";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Spinner from "../components/Spinner";

//Create page component, used to create MD blog posts, returns JSX layout
export default function Create(props) {
  /*
  title -> blog title
  subtitle -> blog subtitle
  blogMD -> blog markdown state
  isEditing -> state to determine whether user is editing or creating a post
  isPublishLoading -> state to handle publish loading feedback
  open -> state for handling the showing of error snackbar
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
  const [open, setOpen] = useState(false);
  const mdEditor = useRef();
  const { feedDAC, userID, isMySkyLoading, initiateLogin, mySky } =
    useContext(SkynetContext);
  let history = useHistory();
  let location = useLocation();

  //get route params into states
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
        location.state.isPinned,
        location.state.postPath,
        location.state.postRef,
        location.state.post,
        mySky
      );
    } else {
      res = await createBlogPost(title, subtitle, blogMD, feedDAC, mySky);
    }
    if (res.success) {
      const newRoute = `${res.ref.substring(6)}`;
      setPublishLoading(false);
      history.push(newRoute.replace("#", "/"));
    } else {
      setPublishLoading(false);
      setOpen(true);
    }
  };
  //close the failed to post snackbar
  const handleClose = () => {
    setOpen(false);
  };

  //return JSX for create page
  return (
    <div className={"flex justify-center"}>
      {isMySkyLoading ? (
        <Backdrop style={{ zIndex: 10 }} open={true}>
          <Spinner />
        </Backdrop>
      ) : !userID ? (
        <div className={"py-16 max-w-md"}>
          <div className={"text-center"}>
            <p className="mt-1 mb-3 text-xl font-bold text-palette-600 sm:text-2xl sm:tracking-tight lg:text-3xl">
              Login using MySky to tell your story on SkyBlog.
            </p>
          </div>
          <button
            onClick={initiateLogin}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-palette-600 bg-primary hover:bg-primary-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Login with MySky
          </button>
        </div>
      ) : (
        <div className={"flex-col max-w-7xl mx-auto mt-4 px-4 sm:px-6 lg:px-8"}>
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
          <TextField
            label={"Subtitle"}
            fullWidth={true}
            multiline={true}
            maxRows={4}
            value={subtitle}
            onChange={handleSubtitleChange}
            InputProps={{ style: { fontSize: 30, marginBottom: 12 } }}
          />
          <MarkdownEditor
            mdEditor={mdEditor}
            setBlogMD={setBlogMD}
            blogMD={blogMD}
          />
          {title && blogMD ? (
            <button
              onClick={handlePublish}
              disabled={isPublishLoading}
              className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-palette-600 bg-primary hover:bg-primary-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isEditing ? "Save Changes" : "Publish"}
            </button>
          ) : null}
        </div>
      )}
      <Backdrop style={{ zIndex: 10 }} open={isPublishLoading}>
        <Spinner text={isEditing ? "Saving Changes" : "Creating Post"} />
      </Backdrop>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <MuiAlert
          elevation={6}
          variant={"filled"}
          onClose={handleClose}
          severity="error"
        >
          Failed to {isEditing ? "edit" : "create"} post.
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
