import React, { useState, useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";

//PinningAlerts component shows alerts when pinning a post from the blog view
export default function PinningAlerts(props) {
  /*
        props -> pinStatus, setPinStatus
        showPinning -> state for handling pinning notif
        showUnpinning -> state for handling unpinning notif
        showSuccess -> state for handling success notif
        showError -> state for handling error notif
         */
  const { pinStatus, setPinStatus } = props;
  const [showPinning, setShowPinning] = useState(false);
  const [showUnpinning, setShowUnpinning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  //effect that updates states when pinstatus changes
  useEffect(() => {
    setShowPinning(false);
    setShowUnpinning(false);
    setShowSuccess(false);
    setShowError(false);
    if (pinStatus === "pinning") {
      setShowPinning(true);
    } else if (pinStatus === "unpinning") {
      setShowUnpinning(true);
    } else if (pinStatus === "success") {
      setShowSuccess(true);
    } else if (pinStatus === "error") {
      setShowError(true);
    }
  }, [pinStatus]);

  //close the notifs
  const handleClose = () => {
    setPinStatus(null);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={showPinning || showUnpinning}
        autoHideDuration={1900}
        onClose={handleClose}
      >
        <div>
          <MuiAlert
            elevation={6}
            variant={"filled"}
            onClose={handleClose}
            severity={"info"}
          >
            {showPinning ? "Bookmarking Post..." : "Removing Bookmark"}
          </MuiAlert>
          <LinearProgress
            color={"secondary"}
            style={{ bottom: 4, backgroundColor: "#4C8BF5" }}
          />
        </div>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={showSuccess}
        autoHideDuration={1900}
        onClose={handleClose}
      >
        <MuiAlert
          elevation={6}
          variant={"filled"}
          onClose={handleClose}
          severity={"success"}
        >
          Successfully updated post.
        </MuiAlert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={showError}
        autoHideDuration={1900}
        onClose={handleClose}
      >
        <MuiAlert
          elevation={6}
          variant={"filled"}
          onClose={handleClose}
          severity={"error"}
        >
          Error updating post.
        </MuiAlert>
      </Snackbar>
    </>
  );
}
