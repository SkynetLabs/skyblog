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

const useStyles = makeStyles((theme) => ({
  root: {
    height: 380,
    transform: "translateZ(0px)",
    flexGrow: 1,
  },
  speedDial: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  backdrop: {
    position: "absolute",
    zIndex: 2,
  },
}));

//PreviewMenu component is a component that allows a user to interact with their post from myBlogs page
export default function PreviewMenu(props) {
  /*
    post, feedDAC, isMine, handlePin, handleRemovePost -> post data, feedDAC instance, bool for is my post, function to pin post, function to remove post
    classes -> styling for components
    open -> state for handling opening of the speeddial menu
    showDeleteAlert -> state for handling whether or not to show the delete action alert
     */
  const { post, feedDAC, history, handlePin, handleRemovePost } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

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
      history
    );
  };

  //handle delete button click
  const handleDeleteClick = (event) => {
    event.stopPropagation();
    setShowDeleteAlert(true);
  };

  //handle pin button click
  const handlePinClick = (event) => {
    event.stopPropagation();
    handlePin(post.ref);
  };

  return (
    <div>
      <Backdrop open={open} className={classes.backdrop} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={handleClose}
        onOpen={handleOpen}
        direction={"left"}
        icon={
          <SpeedDialIcon icon={<MoreVertIcon />} openIcon={<CloseIcon />} />
        }
        className={classes.speedDial}
        open={open}
      >
        <SpeedDialAction
          key={"Delete"}
          tooltipTitle={"Delete"}
          tooltipPlacement={"bottom"}
          icon={<DeleteIcon />}
          onClick={handleDeleteClick}
        />
        <SpeedDialAction
          key={"Edit"}
          tooltipTitle={"Edit"}
          tooltipPlacement={"bottom"}
          icon={<EditIcon />}
          onClick={handleEditClick}
        />
        <SpeedDialAction
          key={"Bookmark"}
          tooltipTitle={post.isPinned ? "Remove Bookmark" : "Bookmark to Top"}
          tooltipPlacement={"bottom"}
          icon={<BookmarkIcon />}
          onClick={handlePinClick}
        />
      </SpeedDial>
      {showDeleteAlert ? (
        <DeleteButton
          postRef={post.ref}
          feedDAC={feedDAC}
          hidden={true}
          handleRemovePost={handleRemovePost}
          setShowDeleteAlert={setShowDeleteAlert}
        />
      ) : null}
    </div>
  );
}
