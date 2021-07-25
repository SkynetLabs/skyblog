import React, {useState,useEffect} from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core/styles';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import ImageOutlined from '@material-ui/icons/ImageOutlined';
import SettingsEthernet from '@material-ui/icons/SettingsEthernet';
import InsertLink from '@material-ui/icons/InsertLink';
import {Link} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        marginRight:10
    }
}));

export default function CreateMenu (props) {
    const classes = useStyles();
    const [menuAnchor, setMenuAnchor] = useState();

    const handleMenuClick = (event) => {
        setMenuAnchor(event.currentTarget);
    }
    const handleClose = () => {
        setMenuAnchor(null);
    }
    return (
        <div className={classes.root}>
            <IconButton onClick={handleMenuClick}
                        edge="end"
                        aria-label="create"
                        color="inherit"
            >
                <AddCircleOutline style={{color: 'lightGray'}}/>
            </IconButton>
            <Menu
                id="item-menu"
                anchorEl={menuAnchor}
                keepMounted
                open={Boolean(menuAnchor)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>
                    <ImageOutlined style={{color: 'lightGray'}}/>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <InsertLink style={{color:'lightGray'}} />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <SettingsEthernet style={{color:'lightGray'}} />
                </MenuItem>
            </Menu>
        </div>
    );
}
