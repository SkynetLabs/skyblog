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

//Blog page component, used to create view blog posts, returns JSX layout for rendering blogs
export default function Blog(props) {
  const { client, getUserProfile, feedDAC } = useContext(SkynetContext);
  let { ref, dac, domain, posts, file, id } = useParams();
  const [postData, setPostData] = useState();
  const [isLoading, setLoading] = useState(true);
  const [date, setDate] = useState(null);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    if (ref != null && client != null) {
      getPostData();
    }
  }, [ref, client]);

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
    console.log("PROFILE", profile);
    setAuthor(profile);
    const d = new Date(res.ts);
    setDate(d.toDateString());
    setLoading(false);
  };

  const getLetter = () => {
    const name = displayName(author, ref);
    return name.substring(0, 1);
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
      <CardHeader
        style={{ padding: 0, marginBottom: 26 }}
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
              <IconButton aria-label="settings">
                <GitHub />
              </IconButton>
              <IconButton aria-label="settings">
                <Telegram />
              </IconButton>
              <IconButton aria-label="settings">
                <Twitter />
              </IconButton>
            </>
          ) : null
        }
        title={!isLoading ? displayName(author, ref) : <Skeleton />}
        subheader={!isLoading ? date : <Skeleton />}
      />
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
