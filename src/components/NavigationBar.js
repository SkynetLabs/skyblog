import React, { useState, useEffect, useContext } from "react";
import { SkynetContext } from "../state/SkynetContext";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Add from "@material-ui/icons/Add";
import { Link } from "react-router-dom";

//style values for material-ui JSX components
const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

//Navigation bar component, displayed along top of screen, used to navigate through Skapp
export default function NavigationBar(props) {
  const classes = useStyles();
  const { userID, initiateLogin, mySkyLogout, isMySkyLoading } =
    useContext(SkynetContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <ElevationScroll {...props}>
        <AppBar position={"static"}>
          <Toolbar>
            <Typography variant="h6" className={classes.root}>
              SkyBlog
            </Typography>
            <div>
              {!isMySkyLoading && (userID == null || userID == "") ? (
                <Button variant={"contained"} onClick={initiateLogin}>
                  Login
                </Button>
              ) : !isMySkyLoading ? (
                <>
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
                    onClick={handleMenuOpen}
                    edge="end"
                    aria-label="account"
                    aria-haspopup="true"
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="account-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    getContentAnchorEl={null}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem
                      component={Link}
                      to={`/profile/ed25519-${userID}`}
                    >
                      My Blogs
                    </MenuItem>
                    <MenuItem onClick={mySkyLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : null}
            </div>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </div>
  );
}
