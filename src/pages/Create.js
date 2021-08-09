import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

export default function Create(props) {
  //states to track store the blog text
  const [title, setTitle] = useState(); //blog title
  const [subtitle, setSubtitle] = useState(); //blog subtitle

  //handle the title input change
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  //handle the subtitle input change
  const handleSubtitleChange = (event) => {
    setSubtitle(event.target.value);
  };

  //return JSX for create page
  //Title Input, Subtitle Input

  return (
    <Container
      id={"create-container"}
      maxWidth={"sm"}
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
    </Container>
  );
}
