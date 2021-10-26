import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";

//UpdatingIndicator is a component that shows when the application is checking if there are updates needed for local storage
export default function UpdatingIndicator(props) {
  const { isUpdating, setUpdating } = props; //state from parent

  //close the indicator
  const handleClose = () => {
    setUpdating(false);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={isUpdating}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      <div>
        <MuiAlert
          elevation={6}
          variant={"filled"}
          onClose={handleClose}
          severity={"info"}
        >
          Checking for updates...
        </MuiAlert>
        <LinearProgress
          color={"secondary"}
          style={{ bottom: 4, backgroundColor: "#4C8BF5" }}
        />
      </div>
    </Snackbar>
  );
}
