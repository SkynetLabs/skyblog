import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { deleteBlogPost } from "../data/feedLibrary";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";

//DeleteButton component is the component that allows for post deletion
export default function DeleteButton(props) {
  /*
      props -> postRef, feedDAC instance, showDeleteAlert, setShowDeleteAlert,
        handleRemovePost, setSpeedOpen, deletingPost, setDeletingPost  <- states and functions from parent
      open -> state to handle opening of error message
      openSuccess -> state to handle opening of success message
      history -> react router hook
       */
  const {
    postRef,
    feedDAC,
    showDeleteAlert,
    setShowDeleteAlert,
    handleRemovePost,
    setSpeedOpen,
    deletingPost,
    setDeletingPost,
  } = props;
  const [open, setOpen] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const history = useHistory();

  //handles the execution of deleting a post following the user confirmation
  const handleConfirm = async (event) => {
    event.stopPropagation();
    setDeletingPost(true);
    setShowDeleteAlert(false);
    setTimeout(() => {
      setSpeedOpen(false);
    }, 50);
    const res = await deleteBlogPost(postRef, feedDAC);
    if (res.success) {
      setDeletingPost(false);
      setOpenSuccess(true);
      if (handleRemovePost) {
        setTimeout(() => {
          handleRemovePost(postRef);
        }, 1000);
      } else {
        setTimeout(() => {
          history.push("/");
        }, 2000);
      }
    } else {
      setDeletingPost(false);
      setOpen(true);
      setShowDeleteAlert(false);
    }
  };

  //handles close of alert when user does not proceed with deletion
  const handleCloseAlert = (event) => {
    event.stopPropagation();
    setShowDeleteAlert(false);
    setTimeout(() => {
      setSpeedOpen(false);
    }, 50);
  };
  //handle close of the error message
  const handleClose = () => {
    setOpen(false);
  };
  //handle close of the success message
  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };

  return (
    <>
      <Dialog
        open={showDeleteAlert}
        onClose={handleCloseAlert}
        onClick={(event) => event.stopPropagation()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this blog post?"}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={handleCloseAlert}
            onMouseDown={(event) => event.stopPropagation()}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={handleConfirm}
            onMouseDown={(event) => event.stopPropagation()}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
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
          severity={"error"}
        >
          Unable to delete post.
        </MuiAlert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={openSuccess}
        autoHideDuration={1900}
        onClose={handleCloseSuccess}
      >
        <MuiAlert
          elevation={6}
          variant={"filled"}
          onClose={handleCloseSuccess}
          severity={"success"}
        >
          Successfully deleted post.
        </MuiAlert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={deletingPost}
        autoHideDuration={1900}
      >
        <div>
          <MuiAlert elevation={6} variant={"filled"} severity={"info"}>
            Deleting Post...
          </MuiAlert>
          <LinearProgress
            color={"secondary"}
            style={{ bottom: 4, backgroundColor: "#4C8BF5" }}
          />
        </div>
      </Snackbar>
    </>
  );
}
