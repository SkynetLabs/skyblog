import React, { useState, useRef } from "react";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import MarkdownEditor from "../components/MarkdownEditor";
import Button from "@material-ui/core/Button";

//Create page component, used to create MD blog posts, returns JSX layout
export default function Create(props) {
  //states to track store the blog text
  const [title, setTitle] = useState(); //blog title
  const [subtitle, setSubtitle] = useState(); //blog subtitle
  const [blogMD, setBlogMD] = useState(null);
  const mdEditor = useRef();

  //handle the title input change
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  //handle the subtitle input change
  const handleSubtitleChange = (event) => {
    setSubtitle(event.target.value);
  };

  const handlePublish = () => {
    console.log("TITLE: ", title);
    console.log("Subtitle: ", subtitle);
    console.log("Body: \n", blogMD);
  };

  //return JSX for create page
  //Title Input, Subtitle Input

  return (
    <Container
      id={"create-container"}
      maxWidth={"md"}
      style={{ marginTop: 14 }}
    >
      <Grid container direction={"row"} alignItems={"center"}>
        <TextField
          label={"Title"}
          fullWidth={true}
          autoFocus={true}
          multiline={true}
          rowsMax={3}
          onChange={handleTitleChange}
          InputProps={{ style: { fontSize: 40, marginBottom: 12 } }}
        />
      </Grid>
      <Grid container direction={"row"} alignItems={"center"}>
        <TextField
          label={"Subtitle"}
          fullWidth={true}
          multiline={true}
          rowsMax={4}
          onChange={handleSubtitleChange}
          InputProps={{ style: { fontSize: 30, marginBottom: 12 } }}
        />
      </Grid>
      <MarkdownEditor mdEditor={mdEditor} setBlogMD={setBlogMD} />
      {title != null && title != "" && blogMD != null && blogMD != "" ? (
        <Button
          onClick={handlePublish}
          fullWidth={true}
          variant="contained"
          color="primary"
        >
          Publish
        </Button>
      ) : null}
    </Container>
  );
}
