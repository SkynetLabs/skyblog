import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import MDEditor from "@uiw/react-md-editor";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  titleField: {
    fontSize: 40,
    outline: "none",
    border: "none",
  },
  subtitleField: {
    fontSize: 30,
    outline: "none",
    border: "none",
  },
  bodyField: {
    fontSize: 20,
    outline: "none",
    border: "none",
  },
  formatMenu: {
    position: "absolute",
    opacity: 0,
    zIndex: 1,
    top: -10000,
    left: -10000,
  },
}));

export default function MarkdownEditor(props) {
  const classes = useStyles();

  //states to track store the blog text
  const [blogBody, setBlogBody] = useState();

  const handleEditorChange = (e) => {
    setBlogBody(e);
    props.setBlogMD(e);
    console.log("CHANGE: ", e);
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <MDEditor
        ref={props.mdEditor}
        value={blogBody}
        height={window.innerHeight / 2}
        textareaProps={{ placeholder: "Tell your story..." }}
        onChange={handleEditorChange}
      />
    </div>
  );
}
