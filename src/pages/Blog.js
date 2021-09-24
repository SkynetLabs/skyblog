import React, { useState, useEffect, useContext } from "react";
import Container from "@material-ui/core/Container";
import { useParams } from "react-router-dom";
import { loadBlogPost, togglePinPost } from "../data/feedLibrary";
import { SkynetContext } from "../state/SkynetContext";
import ReactMarkdown from "markdown-to-jsx";
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
import CardMedia from "@material-ui/core/CardMedia";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import PreviewMenu from "../components/PreviewMenu";
import PinningAlerts from "../components/PinningAlerts";

//style for removing hover shading
const useStyles = makeStyles((theme) => ({
  focus: {
    "&&&": {
      opacity: 0,
    },
  },
}));

function MarkdownListItem(props) {
  return <Box component="li" sx={{ mt: 1, typography: "body1" }} {...props} />;
}

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: "h1",
      },
    },
    h2: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: "h2",
      },
    },
    h3: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: "h3",
      },
    },
    h4: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: "h4",
      },
    },
    h5: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: "h5",
      },
    },
    h6: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: "h6",
      },
    },
    p: {
      component: Typography,
      props: { paragraph: true },
    },
    a: { component: Link },
    li: {
      component: MarkdownListItem,
    },
    img: {
      component: CardMedia,
      props: {
        component: "img",
      },
    },
  },
};

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
  pinStatus -> whether or not the post is currently pinned
  deletingPost -> state to indicate if the post is currently being deleted
  history -> react router hook
  classes -> const to useStyles in JSX
   */
  const { getUserProfile, feedDAC, client, userID, mySky } =
    useContext(SkynetContext);
  let { ref, dac, domain, posts, file, id } = useParams();
  const [postData, setPostData] = useState();
  const [isLoading, setLoading] = useState(true);
  const [date, setDate] = useState(null);
  const [author, setAuthor] = useState(null);
  const [showError, setShowError] = useState(false);
  const [pinStatus, setPinStatus] = useState(null);
  const [deletingPost, setDeletingPost] = useState(false);
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
        let res = await loadBlogPost(val, feedDAC, client);
        if (res) {
          setPostData(res);
          const profile = await getUserProfile(ref.substring(8));
          setAuthor(profile);
          const d = new Date(res.ts);
          console.log("postData", res);
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

  //toggle pin of post
  const handlePin = async () => {
    if (postData.isPinned) {
      setPinStatus("unpinning");
    } else {
      setPinStatus("pinning");
    }
    let newPostData = postData;
    newPostData.isPinned = !newPostData.isPinned;
    const resolverJSON = {
      isPinned: newPostData.isPinned,
      blogBody: newPostData.content.text,
      title: newPostData.content.title,
      subtitle: newPostData.content.ext.subtitle,
      ts: newPostData.ts,
    };
    const res = await togglePinPost(
      resolverJSON,
      postData.content.ext.postPath,
      mySky
    );
    setPinStatus(res.success ? "success" : "error");
    setPostData(newPostData);
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
                      <PreviewMenu
                        post={postData}
                        feedDAC={feedDAC}
                        history={history}
                        handlePin={handlePin}
                        blogView={true}
                        deletingPost={deletingPost}
                        setDeletingPost={setDeletingPost}
                      />
                    ) : (
                      <ShareButton />
                    )}
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
              options={options}
              {...props}
              style={{ marginTop: 26 }}
            >
              {postData.content.text}
            </ReactMarkdown>
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
      <PinningAlerts pinStatus={pinStatus} setPinStatus={setPinStatus} />
    </Container>
  );
}
