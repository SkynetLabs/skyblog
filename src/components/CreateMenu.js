import React, {useState,useEffect,useRef} from 'react';
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
        position:'absolute',
        zIndex:2,
        top:-10000,
        left:-10000
    }
}));

export default function CreateMenu (props) {
    const classes = useStyles();
    const sideTool = useRef(null);
    const inputImage = useRef(null);
    const imageFormRef = useRef(null);
    const [menuAnchor, setMenuAnchor] = useState();
    useEffect(() => {
        window.addEventListener('resize', adjustMenuPosition);
    },[]);
    useEffect(() => {
        adjustMenuPosition();
    });
    const adjustMenuPosition = () => {
        const sideToolRef = sideTool.current;
        const {selection} = props.editor;
        const domSelection = window.getSelection();
        const domRange = domSelection.getRangeAt(0);
        const rect = domRange.getBoundingClientRect();
        const editorElement = document.getElementById('editor');
        const createContainer = document.getElementById('create-container');
        if (createContainer.getBoundingClientRect().width == window.innerWidth) {
            sideToolRef.removeAttribute('style');
            return
        } else if (sideToolRef && selection) {
            sideToolRef.style.top = `${rect.top+window.pageYOffset- sideToolRef.offsetHeight/2 + rect.height/2}px`
            sideToolRef.style.left = `${editorElement.getBoundingClientRect().left - sideToolRef.offsetWidth - 6}px`
        }
    }
    const handleMenuClick = (event) => {
        setMenuAnchor(event.currentTarget);
    }
    const handleClose = () => {
        setMenuAnchor(null);
    }
    const handleImageClick = () => {
        inputImage.current.click();
    }
    const handleImageSelect = (event) => {
        console.log(event.target.files)
        props.addImageElement(props.editor, URL.createObjectURL(event.target.files[0]));
        imageFormRef.current.reset();
        handleClose();
    }
    return (
        <div ref={sideTool} className={classes.root}>
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
                <MenuItem onClick={handleImageClick}>
                    <ImageOutlined style={{color: 'lightGray'}}/>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <InsertLink style={{color:'lightGray'}} />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <SettingsEthernet style={{color:'lightGray'}} />
                </MenuItem>
            </Menu>
            <form ref={imageFormRef}>
                <input type={'file'} accept={'.png,.jpg,.jpeg'} id={'file'} onChange={handleImageSelect} ref={inputImage} style={{display:'none'}} />
            </form>
        </div>
    );
}
