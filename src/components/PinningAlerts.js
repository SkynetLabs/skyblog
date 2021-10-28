import React, { useState, useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";
import CustomIndicator from "./CustomIndicator";

//PinningAlerts component shows alerts when pinning a post from the blog view
export default function PinningAlerts(props) {
  /*
        props -> pinStatus, setPinStatus
         */
  const { pinStatus, setPinStatus } = props;

  //close the notifs
  const handleClose = () => {
    setPinStatus(null);
  };

  return (
    <>
      <CustomIndicator
        openStatus={pinStatus === "pinning"}
        indicatorType={"info"}
        message={"Bookmarking Post..."}
        handleClose={handleClose}
      />
      <CustomIndicator
        openStatus={pinStatus === "unpinning"}
        indicatorType={"info"}
        message={"Removing Bookmark..."}
        handleClose={handleClose}
      />
      <CustomIndicator
        openStatus={pinStatus === "success"}
        indicatorType={"success"}
        message={"Successfully updated post."}
        handleClose={handleClose}
      />
      <CustomIndicator
        openStatus={pinStatus === "error"}
        indicatorType={"error"}
        message={"Error updating post."}
        handleClose={handleClose}
      />
    </>
  );
}
