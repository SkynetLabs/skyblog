import React, { useState, useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";

//PinningAlerts component shows alerts when pinning a post from the blog view
export default function PinningAlerts(props) {
  /*
        props -> pinStatus, setPinStatus
        showNotifs -> state for handling which notifications to show
         */
  const { pinStatus, setPinStatus } = props;
  const [showNotifs, setShowNotifs] = useState({
    showPinning: false,
    showUnpinning: false,
    showSuccess: false,
    showError: false,
  });

  //effect that updates states when pinstatus changes
  useEffect(() => {
    switch (pinStatus) {
      case "pinning":
        setShowNotifs({
          showPinning: true,
          showUnpinning: false,
          showSuccess: false,
          showError: false,
        });
        break;
      case "unpinning":
        setShowNotifs({
          showPinning: false,
          showUnpinning: true,
          showSuccess: false,
          showError: false,
        });
        break;
      case "success":
        setShowNotifs({
          showPinning: false,
          showUnpinning: false,
          showSuccess: true,
          showError: false,
        });
        break;
      case "error":
        setShowNotifs({
          showPinning: false,
          showUnpinning: false,
          showSuccess: false,
          showError: true,
        });
        break;
      default:
        setShowNotifs({
          showPinning: false,
          showUnpinning: false,
          showSuccess: false,
          showError: false,
        });
        break;
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
        open={showNotifs.showPinning || showNotifs.showUnpinning}
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
            {showNotifs.showPinning
              ? "Bookmarking Post..."
              : "Removing Bookmark"}
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
        open={showNotifs.showSuccess}
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
        open={showNotifs.showError}
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
