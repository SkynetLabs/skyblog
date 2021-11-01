import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";

//CustomIndicator is a component that returns an indicator
export default function CustomIndicator(props) {
  /*
            props:
            openStatus -> whether snackbar should be open or not
            indicatorType -> type of indicator - 'info', 'success' or 'error'
            message -> text to display in indicator
            handleClose -> close function
             */
  const { openStatus, indicatorType, message, handleClose } = props;

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={openStatus}
      autoHideDuration={2200}
      onClose={handleClose}
    >
      <div>
        <MuiAlert
          elevation={6}
          variant={"filled"}
          onClose={handleClose}
          severity={indicatorType}
        >
          {message}
        </MuiAlert>
        {indicatorType === "info" ? (
          <LinearProgress
            color={"secondary"}
            style={{ bottom: 4, backgroundColor: "#4C8BF5" }}
          />
        ) : null}
      </div>
    </Snackbar>
  );
}
