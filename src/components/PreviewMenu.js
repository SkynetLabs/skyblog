import React, { useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import DeleteButton from "./DeleteButton";
import { makeStyles } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Backdrop from "@material-ui/core/Backdrop";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import { editRoute } from "../data/pageRouting";
import ShareIcon from "@material-ui/icons/Share";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 380,
    transform: "translateZ(0px)",
    flexGrow: 1,
  },
  speedDial: {
    position: "absolute",
    top: 0,
    right: theme.spacing(1),
  },
  backdrop: {
    position: "absolute",
    zIndex: 2,
  },
}));

//PreviewMenu component is the menu for a user when view their blogs
export default function PreviewMenu(props) {
  /*
    post, feedDAC, history, handlePin, handleRemovePost, blogView, deletingPost, setDeletingPost
    classes -> styling for components
    open -> state for handling opening of the speeddial menu
    showDeleteAlert -> state for handling whether or not to show the delete action alert
    showShareSnackbar -> state for showing the copied to clipboard snackbar
     */
  const {
    post,
    feedDAC,
    history,
    handlePin,
    handleRemovePost,
    blogView,
    deletingPost,
    setDeletingPost,
  } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showShareSnackbar, setShowShareSnackbar] = useState(false);

  //close the Snackbar message
  const handleClose = (event) => {
    event.stopPropagation();
    setOpen(false);
  };

  //handle the click opening of the speeddial
  const handleOpen = (event) => {
    event.stopPropagation();
    setOpen(true);
  };

  //handle edit button click
  const handleEditClick = (event) => {
    event.stopPropagation();
    editRoute(
      post.content.title,
      post.content.ext.subtitle,
      post.content.text,
      post.content.ext.postPath,
      post.ref,
      post.isPinned,
      history
    );
  };

  //handle delete button click
  const handleDeleteClick = (event) => {
    event.stopPropagation();
    setShowDeleteAlert(true);
    setOpen(false);
  };

  //handle pin button click
  const handlePinClick = (event) => {
    event.stopPropagation();
    handlePin(post.ref);
  };

  //handle click of the share button
  const handleShareClick = (event) => {
    event.stopPropagation();
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShowShareSnackbar(true);
    });
    setOpen(false);
  };

  //handle close of the share snackbar
  const handleShareClose = () => {
    setShowShareSnackbar(false);
  };

  return (
    <div>
      <Backdrop open={open && !blogView} className={classes.backdrop} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={handleClose}
        onOpen={handleOpen}
        onMouseDown={(event) => event.stopPropagation()}
        direction={"left"}
        icon={
          <SpeedDialIcon icon={<MoreVertIcon />} openIcon={<CloseIcon />} />
        }
        className={!blogView ? classes.speedDial : null}
        open={open}
        hidden={deletingPost}
        FabProps={{ size: "small" }}
      >
        <SpeedDialAction
          key={"Delete"}
          tooltipTitle={"Delete"}
          tooltipPlacement={"bottom"}
          icon={<DeleteIcon />}
          onClick={handleDeleteClick}
          onMouseDown={(event) => event.stopPropagation()}
        />
        <SpeedDialAction
          key={"Edit"}
          tooltipTitle={"Edit"}
          tooltipPlacement={"bottom"}
          icon={<EditIcon />}
          onClick={handleEditClick}
          onMouseDown={(event) => event.stopPropagation()}
        />
        <SpeedDialAction
          key={"Bookmark"}
          tooltipTitle={post.isPinned ? "Remove Bookmark" : "Bookmark"}
          tooltipPlacement={"bottom"}
          icon={<BookmarkIcon />}
          onClick={handlePinClick}
          onMouseDown={(event) => event.stopPropagation()}
        />
        {blogView ? (
          <SpeedDialAction
            key={"Share"}
            tooltipTitle={"Share"}
            tooltipPlacement={"bottom"}
            icon={<ShareIcon />}
            onClick={handleShareClick}
            onMouseDown={(event) => event.stopPropagation()}
          />
        ) : null}
      </SpeedDial>
      <DeleteButton
        postRef={post.ref}
        feedDAC={feedDAC}
        handleRemovePost={handleRemovePost}
        showDeleteAlert={showDeleteAlert}
        setSpeedOpen={setOpen}
        setShowDeleteAlert={setShowDeleteAlert}
        deletingPost={deletingPost}
        setDeletingPost={setDeletingPost}
      />
      {blogView ? (
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={showShareSnackbar}
          autoHideDuration={3000}
          onClose={handleShareClose}
          message="Copied to Clipboard"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleShareClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      ) : null}
    </div>
  );
}
