import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

//ErrorDisplay component is an error banner used by main pages
export default function ErrorDisplay(props) {
  //title and subtitle of error display
  const { title, subtitle } = props;

  return (
    <Container maxWidth={"sm"} style={{ marginTop: 30 }}>
      <Paper
        elevation={2}
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography align={"center"} variant={"h4"} gutterBottom={true}>
          {title}
        </Typography>
        <Typography align={"center"} variant={"subtitle"} gutterBottom={true}>
          {subtitle}
        </Typography>
      </Paper>
    </Container>
  );
}
