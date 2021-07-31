import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Search from "@material-ui/icons/Search";
import Add from "@material-ui/icons/Add";
import { Link } from "react-router-dom";

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export default function NavigationBar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ElevationScroll {...props}>
        <AppBar position={"static"}>
          <Toolbar>
            <Typography variant="h6" className={classes.root}>
              SkyBlog
            </Typography>
            <div>
              <IconButton
                edge="end"
                aria-label="search"
                aria-haspopup="true"
                color="inherit"
              >
                <Search />
              </IconButton>
              <IconButton
                component={Link}
                to={"/create"}
                edge="end"
                aria-label="create"
                color="inherit"
              >
                <Add />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="account"
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </div>
  );
}
