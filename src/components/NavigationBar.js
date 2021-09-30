import React, { useState, useContext, useEffect } from "react";
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
import { Link, useHistory } from "react-router-dom";
import ButtonBase from "@material-ui/core/ButtonBase";
import { UserCircleIcon } from "@heroicons/react/outline";

//style values for material-ui JSX components
const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

//Navigation bar component, displayed along top of screen, used to navigate through Skapp
export default function NavigationBar(props) {
  const classes = useStyles(); //const to access useStyles()
  const { userID, initiateLogin, mySkyLogout, isMySkyLoading } =
    useContext(SkynetContext); //states from Skynet context
  const [anchorEl, setAnchorEl] = useState(null); // user menu anchor state
  const history = useHistory();

  useEffect(() => {
    setAnchorEl(null);
  }, [userID]);

  //set anchor point to user profile icon button
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  //close the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const success = await mySkyLogout();
    if (success) {
      history.push("/");
    }
  };
  const className =
    "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-palette-600 bg bg-primary-test hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors";

  //JSX components to render navigation bar
  return (
    <div className={classes.root}>
      <AppBar position={"static"}>
        <Toolbar>
          <div className={classes.root}>
            <ButtonBase component={Link} to={"/"}>
              <Typography variant="h6" className={classes.root}>
                SkyBlog
              </Typography>
            </ButtonBase>
          </div>
          <div>
            {!isMySkyLoading && !userID ? (
              <button className={className} onClick={initiateLogin}>
                <UserCircleIcon
                  className="-ml-1 mr-2 h-5 w-5"
                  aria-hidden="true"
                />{" "}
                Login with MySky
              </button>
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
                    onClick={handleClose}
                  >
                    My Blogs
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : null}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
