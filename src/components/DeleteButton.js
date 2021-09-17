import React, { useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import { useHistory } from "react-router-dom";
import { deleteBlogPost } from "../data/feedLibrary";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

//DeleteButton component is the component that allows for post deletion
export default function DeleteButton(props) {
  /*
      props -> postRef, feedDAC instance
      open -> state to handle opening of error message
      openAlert -> state to handle delete confirmation modal
      openBackdrop -> state to handle loading backdrop
      openSuccess -> state to handle opening of success message
      history -> react router hook
       */
  const { postRef, feedDAC, hidden, setShowDeleteAlert, handleRemovePost } =
    props;
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(hidden);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const history = useHistory();

  //handle edit button click, route to post editor
  const handleClick = async (event) => {
    event.stopPropagation();
    setOpenAlert(true);
  };

  //handles the execution of deleting a post following the user confirmation
  const handleConfirm = async (event) => {
    event.stopPropagation();
    setOpenAlert(false);
    setOpenBackdrop(true);
    const res = await deleteBlogPost(postRef, feedDAC);
    if (res.success) {
      setOpenSuccess(true);
      if (hidden) {
        handleRemovePost(postRef);
      } else {
        setTimeout(() => {
          history.push("/");
        }, 2000);
      }
    } else {
      setOpen(true);
      setOpenAlert(false);
      setOpenBackdrop(false);
      if (hidden) setShowDeleteAlert(false);
    }
  };

  //handles close of alert when user does not proceed with deletion
  const handleCloseAlert = (event) => {
    event.stopPropagation();
    setOpenAlert(false);
    if (hidden) setShowDeleteAlert(false);
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
      {!hidden ? (
        <IconButton
          onMouseDown={(event) => event.stopPropagation()}
          onClick={handleClick}
          disabled={openBackdrop || openAlert}
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
      ) : null}
      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this blog post?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseAlert} color="primary">
            No
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
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
      <Backdrop style={{ zIndex: 10 }} open={openBackdrop}>
        <CircularProgress color={"inherit"} />
      </Backdrop>
    </>
  );
}
