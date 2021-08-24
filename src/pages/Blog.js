import React, { useState, useEffect, useContext } from "react";
import Container from "@material-ui/core/Container";
import { useParams } from "react-router-dom";
import { loadBlogPost } from "../data/feedLibrary";
import { SkynetContext } from "../state/SkynetContext";
import ReactMarkdown from "react-markdown";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Twitter from "@material-ui/icons/Twitter";
import GitHub from "@material-ui/icons/GitHub";
import Telegram from "@material-ui/icons/Telegram";
import Skeleton from "@material-ui/lab/Skeleton";
import { displayName } from "../data/displayName";
import { useHistory } from "react-router-dom";
import CardActionArea from "@material-ui/core/CardActionArea";
import { makeStyles } from "@material-ui/core/styles";

//style for removing hover shading
const useStyles = makeStyles((theme) => ({
  focus: {
    "&&&": {
      opacity: 0,
    },
  },
}));

//Blog page component, used to create view blog posts, returns JSX layout for rendering blogs
export default function Blog(props) {
  const { getUserProfile, feedDAC } = useContext(SkynetContext); //values to use from Skynet context
  let { ref, dac, domain, posts, file, id } = useParams(); //get parameters from the route
  const [postData, setPostData] = useState(); //state for blog post data
  const [isLoading, setLoading] = useState(true); //state to render loading indicators
  const [date, setDate] = useState(null); //display date
  const [author, setAuthor] = useState(null); //author of the blog, userProfile DAC profile object
  const history = useHistory(); //react router hook
  const classes = useStyles(); //const to useStyles in JSX

  //execute this effect on entry and when the feedDAC connection status is valid
  useEffect(() => {
    if (ref != null && feedDAC.connector) {
      getPostData();
    }
  }, [ref, feedDAC.connector]);

  //handle using parameters to assemle post data including author and blog post data
  const getPostData = async () => {
    const val =
      "sky://" +
      ref +
      "/" +
      dac +
      "/" +
      domain +
      "/" +
      posts +
      "/" +
      file +
      "#" +
      id;
    const res = await loadBlogPost(val, feedDAC);
    setPostData(res);
    const profile = await getUserProfile(ref.substring(8));
    setAuthor(profile);
    const d = new Date(res.ts);
    setDate(d.toDateString());
    setLoading(false);
  };

  //return first letter of display name
  const getLetter = () => {
    const name = displayName(author, ref.substring(8));
    return name.substring(0, 1);
  };
  //route to author's profile page
  const profileRoute = () => {
    const newRoute = "/profile/" + ref;
    history.push(newRoute);
  };

  return (
    <Container maxWidth={"sm"}>
      <Typography variant={"h3"} style={{ marginTop: 10 }}>
        {!isLoading ? postData.content.title : <Skeleton animation={"wave"} />}
      </Typography>
      <Typography variant={"h5"} color={"textSecondary"} gutterBottom={true}>
        {!isLoading ? (
          postData.content.ext.subtitle
        ) : (
          <Skeleton animation={"wave"} />
        )}
      </Typography>
      <CardActionArea
        classes={{ focusHighlight: classes.focus }}
        onClick={profileRoute}
      >
        <CardHeader
          style={{ padding: 0 }}
          avatar={
            !isLoading ? (
              <Avatar
                aria-label={"Author"}
                src={
                  author.avatar[0].url != "" && author.avatar[0].url != null
                    ? author.avatar[0].url
                    : null
                }
              >
                {author.avatar[0].url == "" || author.avatar[0].url == null
                  ? getLetter()
                  : null}
              </Avatar>
            ) : (
              <Skeleton
                variant={"circle"}
                animation={"wave"}
                height={50}
                width={50}
              />
            )
          }
          action={
            !isLoading ? (
              <>
                {author.connections[2].github != "" ? (
                  <IconButton
                    target={"_blank"}
                    href={author.connections[2].github}
                    aria-label="github"
                  >
                    <GitHub />
                  </IconButton>
                ) : null}
                {author.connections[4].telegram != "" ? (
                  <IconButton
                    target={"_blank"}
                    href={author.connections[4].telegram}
                    aria-label="telegram"
                  >
                    <Telegram />
                  </IconButton>
                ) : null}
                {author.connections[0].twitter != "" ? (
                  <IconButton
                    target={"_blank"}
                    href={author.connections[0].twitter}
                    aria-label="twitter"
                  >
                    <Twitter />
                  </IconButton>
                ) : null}
              </>
            ) : null
          }
          title={
            !isLoading ? displayName(author, ref.substring(8)) : <Skeleton />
          }
          subheader={!isLoading ? date : <Skeleton />}
        />
      </CardActionArea>

      {!isLoading ? (
        <ReactMarkdown
          children={postData.content.text}
          components={{
            img({ node, inline, className, children, ...props }) {
              return (
                <Grid container justify={"center"}>
                  <img src={props.src} />
                </Grid>
              );
            },
          }}
        />
      ) : (
        <Skeleton height={window.innerHeight * 0.75} animation={"wave"} />
      )}
    </Container>
  );
}
