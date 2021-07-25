import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Popper from '@material-ui/core/Popper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import TextFields from '@material-ui/icons/TextFields';
import InsertLink from '@material-ui/icons/InsertLink';
import Close from '@material-ui/icons/Close';
import CreateMenu from "../components/CreateMenu";
import { createEditor, Editor, Transforms, Text, Range } from "slate";
import {Slate, Editable, withReact, useSlate, ReactEditor} from "slate-react";
import { useTheme } from '@material-ui/core/styles';



const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    titleField: {
        fontSize: 40,
        outline: 'none',
        border:'none',

    },
    subtitleField: {
        fontSize: 30,
        outline: 'none',
        border:'none',
    },
    bodyField: {
        fontSize: 20,
        outline: 'none',
        border:'none',
    },
    formatMenu: {
        position: 'absolute',
        opacity: 0,
        zIndex: 1,
        top: -10000,
        left: -10000
    }
}));

export default function Create (props) {
    const classes = useStyles();

    //states to track store the blog text
    const [title, setTitle] = useState();
    const [subtitle, setSubtitle] = useState();
    const [blogBody, setBlogBody] = useState([{
        type: 'paragraph',
        children: [{ text: '' }],
    },]);

    const editorRef = useRef();
    if (!editorRef.current) editorRef.current = withReact(createEditor());
    const editor = editorRef.current;

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    }
    const handleSubtitleChange = (event) => {
        setSubtitle(event.target.value);
    }

    const renderElement = useCallback(props => {
        switch (props.element.type) {
            case 'code':
                return <CodeElement {...props} />
            case 'title':
                return <TitleElement {...props} />
            case 'subtitle':
                return <SubtitleElement {...props} />
            default:
                return <DefaultElement {...props} />
        }
    }, []);

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, []);

    return (
        <Container maxWidth={'sm'} style={{marginTop:14}}>
            <Grid container direction={'row'} alignItems={'center'} >
                <TextField label={'Title'} fullWidth={true} autoFocus={true} multiline={true} rowsMax={3}
                           onChange={handleTitleChange}
                           InputProps={{style: {fontSize: 40,marginBottom: 12}}}
                />
            </Grid>
            <Grid container direction={'row'} alignItems={'center'}>
                <TextField label={'Subtitle'} fullWidth={true} multiline={true} rowsMax={4}
                           onChange={handleSubtitleChange}
                           onKeyDown={(event) => {
                               if (event.key==='Tab'){
                                   setTimeout(() => {
                                       ReactEditor.focus(editor);
                                   }, 100);
                               }
                           }}
                           InputProps={{style: {fontSize: 30,marginBottom: 12}}}
                />
            </Grid>
            <Slate editor={editor}
                   value={blogBody}
                   onChange={newValue => setBlogBody(newValue)}
                   >
                <HoveringToolbar />
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder={'Tell your story...'}
                    onKeyDown={event => {
                        if (event.metaKey) {
                            switch (event.key) {
                                case '`': {
                                    event.preventDefault();
                                    formatBlock(editor, 'code');
                                    break
                                }
                                case 'b': {
                                    event.preventDefault();
                                    toggleFormat(editor, 'bold');
                                    break
                                }
                                case 'i': {
                                    event.preventDefault();
                                    toggleFormat(editor, 'italic')
                                    break
                                }
                                case 'u': {
                                    event.preventDefault();
                                    toggleFormat(editor, 'underlined');
                                    break
                                }
                            }
                        } else if (event.key==='Tab') {
                            event.preventDefault();
                            Editor.insertText(editor, '    ');
                        }
                    }}
                    onKeyUp={event => {
                        if (event.key==='Enter') {
                            formatBlock(editor,'paragraph');
                        }
                    }}
                />
            </Slate>



        </Container>
    );
}

const CodeElement = props => {
    return (
        <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
    )
}

const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>
}

const TitleElement = props => {
    return <p style={{fontSize: 40, fontStyle:'bold'}} {...props.attributes}>{props.children}</p>
}
const SubtitleElement = props => {
    return <p style={{fontSize: 30, fontStyle:'bold'}} {...props.attributes}>{props.children}</p>
}
const LinkElement = props => {
    const textRef = useRef(null);
    const [popoverAnchor, setPopoverAnchor] = useState(null);
    const handleOpenPop = (event) => {
        setPopoverAnchor(event.currentTarget);
    }
    const handleClosePop = () => {
        setPopoverAnchor(null)
    }
    const handleClick = () => {
        if (props.leaf.linkUrl.startsWith('https://')){
            window.open(props.leaf.linkUrl);
        } else {
            window.open('https://'+props.leaf.linkUrl);
        }

    }
    return (
        <>
            <Typography
                ref={textRef}
                aria-owns={'mouse-over-popover'}
                display={'inline'}
                variant={'inherit'}
                aria-haspopup={true}
                onMouseEnter={handleOpenPop}
                onMouseLeave={handleClosePop}
            >
                <a href={props.leaf.linkUrl} onClick={handleClick} style={{cursor:'pointer', color:'black'}}>
                    {props.children}
                </a>
            </Typography>
            <Popper open={popoverAnchor!=null}
                     anchorEl={popoverAnchor}
            >
                <p>{props.leaf.linkUrl}</p>
            </Popper>
        </>
    );
}

const Leaf = props => {
    return (
        <span
            {...props.attributes}
            style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal', fontStyle: props.leaf.italic ? 'italic' : 'normal',
                    textDecorationLine: props.leaf.underlined ? 'underline' : null}}
        >
      {props.leaf.link ? (
          <LinkElement {...props} />
          ) : props.children}
    </span>
    )
}

const toggleFormat = (editor, format, linkUrl = null) => {
    const isActive = isFormatActive(editor, format);
    if (linkUrl) {
        Transforms.setNodes(
            editor,
            { [format]: isActive ? null : true, 'linkUrl': isActive ? null : linkUrl},
            { match: Text.isText, split: true }
        );
    } else {
        Transforms.setNodes(
            editor,
            { [format]: isActive ? null : true},
            { match: Text.isText, split: true }
        );
    }

}

const formatTitle = (event, editor) => {
    event.preventDefault();
    const formatSelection = titleFormatSelector(editor);
    // Toggle the block type depending on whether there's already a match.
    Transforms.setNodes(
        editor,
        { type: formatSelection==='paragraph' ? 'paragraph' : formatSelection==='title' ? 'title' : 'subtitle'},
        { match: n => Editor.isBlock(editor, n) }
    );
}

const titleFormatSelector = (editor) => {
    let [match] = Editor.nodes(editor, {
        match: n => n.type === 'title',
    });
    if (!!match) {
        return 'subtitle';
    } else {
        [match] = Editor.nodes(editor, {
            match: n => n.type === 'subtitle'
        });

        if (!!match) {
            return 'paragraph';
        }
    }

    return 'title';
}

const formatBlock = (editor, formatType) => {
    const isActive = isTypeActive(editor, formatType);
    Transforms.setNodes(editor,
        {type: isActive ? 'paragraph' : formatType},
        {match: n => Editor.isBlock(editor, n)}
    );

}

const isTypeActive = (editor, formatType) => {
    const [match] = Editor.nodes(editor, {
        match: n => n.type === formatType
    });

    return !!match;
}

const isFormatActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: n => n[format] === true,
        mode: 'all'
    });

    return !!match;
}

const HoveringToolbar = () => {
    const theme = useTheme();
    const classes = useStyles();
    const editor = useSlate();
    const ref = useRef(null);
    const linkInput = useRef(null);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [lastSeleciton, setLastSelection] = useState(null);

    useEffect(() => {
        const el = ref.current;
        const {selection} = editor;
        if (showLinkInput){
            editor.selection = lastSeleciton;
        } else if (!selection || !ReactEditor.isFocused(editor) || Range.isCollapsed(selection)) {
            el.removeAttribute('style');
            setShowLinkInput(false);
            return
        } else {
            setLastSelection(selection);
            const domSelection = window.getSelection();
            const domRange = domSelection.getRangeAt(0);
            const rect = domRange.getBoundingClientRect();
            el.style.opacity = '1';
            el.style.top = `${rect.top+window.pageYOffset+el.offsetHeight}px`
            el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth/2 + rect.width/2}px`
        }

    });

    const handleLinkSubmit = (event) => {
        if (event.keyCode == 13) {
            toggleFormat(editor, 'link', event.target.value);
            setShowLinkInput(false);
        }
    }
    const titleColor = () => {
        const val = titleFormatSelector(editor);
        if (val==='title') {
            return 'gray';
        } else if (val==='subtitle') {
            return theme.palette.primary.main;
        }
        return 'black';
    }

    return (
            <div ref={ref}
                 className={classes.formatMenu}
            >
                {!showLinkInput ? (
                    <ButtonGroup>
                        <IconButton
                            onMouseDown={(event) => toggleFormat(editor, 'bold')}
                        >
                            <FormatBoldIcon color={isFormatActive(editor, 'bold') ? 'primary' : 'gray'}/>
                        </IconButton>
                        <IconButton
                            onMouseDown={(event) => toggleFormat(editor, 'italic')}
                        >
                            <FormatItalicIcon color={isFormatActive(editor, 'italic') ? 'primary' : 'gray'} />
                        </IconButton>
                        <IconButton
                            onMouseDown={(event) => toggleFormat(editor, 'underlined')}
                        >
                            <FormatUnderlinedIcon color={isFormatActive(editor, 'underlined') ? 'primary' : 'gray'} />
                        </IconButton>
                        <IconButton
                            onMouseDown={(event) => formatTitle(event, editor)}
                        >
                            <TextFields style={{color:titleColor()}}/>
                        </IconButton>
                        <IconButton
                            onMouseDown={(event) => {
                                const linkActive = isFormatActive(editor, 'link');
                                if (linkActive) {
                                    toggleFormat(editor, 'link');
                                } else {
                                    setShowLinkInput(true);
                                }
                                //formatBlock(editor, 'link')
                            }}
                        >
                            <InsertLink color={isFormatActive(editor, 'link') ? 'primary' : 'gray'} />
                        </IconButton>
                    </ButtonGroup>
                ):(
                    <TextField
                        id="link-input"
                        ref={linkInput}
                        fullWidth={true}
                        onKeyDown={(event) => handleLinkSubmit(event)}
                        label="Link"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onMouseDown={(event) => setShowLinkInput(false)}
                                    >
                                        <Close />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                )}

            </div>
    );
}
