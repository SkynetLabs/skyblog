import React, { useState } from "react";
import ShareIcon from "@material-ui/icons/Share";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

//ShareButton component is component to copy link to blog post or user profile
export default function ShareButton(props) {
  //state for handling opening of snackbar
  const [open, setOpen] = useState(false);

  //handle share button click to copy link to clipboard
  const handleClick = (event) => {
    event.stopPropagation();
    navigator.clipboard.writeText(window.location.href).then(() => {
      setOpen(true);
    });
  };
  //close the Snackbar message
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <IconButton
      onMouseDown={(event) => event.stopPropagation()}
      onClick={handleClick}
      aria-label="share"
    >
      <ShareIcon />
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Copied to Clipboard"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </IconButton>
  );
}
