import React, { useState, useEffect, useContext } from "react";
import Container from "@material-ui/core/Container";
import { useParams } from "react-router-dom";
import { loadBlogPost } from "../data/feedLibrary";
import { SkynetContext } from "../state/SkynetContext";
import ReactMarkdown from "react-markdown";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";
import { displayName } from "../data/displayName";
import { useHistory } from "react-router-dom";
import CardActionArea from "@material-ui/core/CardActionArea";
import { makeStyles } from "@material-ui/core/styles";
import ErrorDisplay from "../components/ErrorDisplay";
import ShareButton from "../components/ShareButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import CardMedia from "@material-ui/core/CardMedia";

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
  /*
  getUserProfile, feedDAC, client, userID -> values to use from Skynet context
  ref, dac, domain, posts, file, id -> get parameters from the route
  postData -> state for blog post data
  isLoading -> state to render loading indicators
  date -> display date
  author -> author of the blog, userProfile DAC profile object
  showError -> show error if the post cannot be loaded or doesn't exist
  fullRef -> full post reference from route
  history -> react router hook
  classes -> const to useStyles in JSX
   */
  const { getUserProfile, feedDAC, client, userID } = useContext(SkynetContext);
  let { ref, dac, domain, posts, file, id } = useParams();
  const [postData, setPostData] = useState();
  const [isLoading, setLoading] = useState(true);
  const [date, setDate] = useState(null);
  const [author, setAuthor] = useState(null);
  const [showError, setShowError] = useState(false);
  const [fullRef, setFullRef] = useState(null);
  const history = useHistory();
  const classes = useStyles();

  //execute this effect on entry and when the feedDAC connection status is valid
  useEffect(() => {
    if (ref != null && feedDAC.connector) {
      //handle using parameters to assemble post data including author and blog post data
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
        setFullRef(val);
        const res = await loadBlogPost(val, feedDAC, client);
        if (res) {
          setPostData(res);
          const profile = await getUserProfile(ref.substring(8));
          setAuthor(profile);
          const d = new Date(res.ts);
          setDate(d.toDateString());
          setLoading(false);
        } else {
          setShowError(true);
        }
      };
      getPostData();
    }
  }, [
    ref,
    feedDAC.connector,
    dac,
    domain,
    feedDAC,
    file,
    getUserProfile,
    id,
    posts,
    client,
  ]);

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
      {!showError ? (
        <>
          <Typography variant={"h3"} style={{ marginTop: 10 }}>
            {!isLoading ? (
              postData.content.title
            ) : (
              <Skeleton animation={"wave"} />
            )}
          </Typography>
          <Typography
            variant={"h5"}
            color={"textSecondary"}
            gutterBottom={true}
          >
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
                      author.avatar.length >= 1
                        ? `https://siasky.net${author.avatar[0].url.substring(
                            5
                          )}`
                        : null
                    }
                  >
                    {author.avatar.length === 0 ? getLetter() : null}
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
                    {!isLoading &&
                    userID === ref.substring(8) &&
                    postData.content.ext.postPath ? (
                      <EditButton
                        postRef={fullRef}
                        title={postData.content.title}
                        postPath={postData.content.ext.postPath}
                        subtitle={postData.content.ext.subtitle}
                        blogBody={postData.content.text}
                      />
                    ) : null}
                    {userID === ref.substring(8) ? (
                      <DeleteButton postRef={fullRef} feedDAC={feedDAC} />
                    ) : null}
                    <ShareButton />
                  </>
                ) : null
              }
              title={
                !isLoading ? (
                  displayName(author, ref.substring(8))
                ) : (
                  <Skeleton />
                )
              }
              subheader={!isLoading ? date : <Skeleton />}
            />
          </CardActionArea>

          {!isLoading ? (
            <ReactMarkdown
              children={postData.content.text}
              components={{
                img({ node, inline, className, children, ...props }) {
                  return <CardMedia component={"img"} image={props.src} />;
                },
              }}
            />
          ) : (
            <Skeleton height={window.innerHeight * 0.75} animation={"wave"} />
          )}
        </>
      ) : (
        <ErrorDisplay
          title={"This post could not be loaded."}
          subtitle={
            "It either does not exist or is the result of a bad connection."
          }
        />
      )}
    </Container>
  );
}
