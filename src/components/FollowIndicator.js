import React, { useState, useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";

//UpdatingIndicator is a component that shows when the application is checking if there are updates needed for local storage
export default function FollowIndicator(props) {
  /*
          props -> pinStatus, setPinStatus
          showNotifs -> state for handling which notifications to show
           */
  const { followStatus, setFollowStatus } = props;
  const [showNotifs, setShowNotifs] = useState({
    follow: false,
    unfollow: false,
    showSuccessFollow: false,
    showSuccessUnfollow: false,
    showErrorFollow: false,
    showErrorUnfollow: false,
  });

  //effect that updates states when pinstatus changes
  useEffect(() => {
    switch (followStatus) {
      case "follow":
        setShowNotifs({
          follow: true,
          unfollow: false,
          showSuccessFollow: false,
          showSuccessUnfollow: false,
          showErrorFollow: false,
          showErrorUnfollow: false,
        });
        break;
      case "unfollow":
        setShowNotifs({
          follow: false,
          unfollow: true,
          showSuccessFollow: false,
          showSuccessUnfollow: false,
          showErrorFollow: false,
          showErrorUnfollow: false,
        });
        break;
      case "successFollow":
        setShowNotifs({
          follow: false,
          unfollow: false,
          showSuccessFollow: true,
          showSuccessUnfollow: false,
          showErrorFollow: false,
          showErrorUnfollow: false,
        });
        break;
      case "successUnfollow":
        setShowNotifs({
          follow: false,
          unfollow: false,
          showSuccessFollow: false,
          showSuccessUnfollow: true,
          showErrorFollow: false,
          showErrorUnfollow: false,
        });
        break;
      case "errorFollow":
        setShowNotifs({
          follow: false,
          unfollow: false,
          showSuccessFollow: false,
          showSuccessUnfollow: false,
          showErrorFollow: true,
          showErrorUnfollow: false,
        });
        break;
      case "errorUnfollow":
        setShowNotifs({
          follow: false,
          unfollow: false,
          showSuccessFollow: false,
          showSuccessUnfollow: false,
          showErrorFollow: false,
          showErrorUnfollow: true,
        });
        break;
      default:
        setShowNotifs({
          follow: false,
          unfollow: false,
          showSuccessFollow: false,
          showSuccessUnfollow: false,
          showErrorFollow: false,
          showErrorUnfollow: false,
        });
        break;
    }
  }, [followStatus]);

  //close the notifs
  const handleClose = () => {
    setFollowStatus(null);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={showNotifs.follow || showNotifs.unfollow}
        autoHideDuration={2200}
        onClose={handleClose}
      >
        <div>
          <MuiAlert
            elevation={6}
            variant={"filled"}
            onClose={handleClose}
            severity={"info"}
          >
            {showNotifs.follow ? "Following User..." : "Unfollowing User..."}
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
        open={showNotifs.showSuccessFollow || showNotifs.showSuccessUnfollow}
        autoHideDuration={1900}
        onClose={handleClose}
      >
        <MuiAlert
          elevation={6}
          variant={"filled"}
          onClose={handleClose}
          severity={"success"}
        >
          {showNotifs.showSuccessFollow
            ? "Successfully followed user."
            : "Successfully unfollowed user."}
        </MuiAlert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={showNotifs.showErrorFollow || showNotifs.showErrorUnfollow}
        autoHideDuration={1900}
        onClose={handleClose}
      >
        <MuiAlert
          elevation={6}
          variant={"filled"}
          onClose={handleClose}
          severity={"error"}
        >
          {showNotifs.showErrorFollow
            ? "Error following user."
            : "Error unfollowing user."}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
