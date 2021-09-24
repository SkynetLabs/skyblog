import React, { useState, useEffect, useContext } from "react";
import { SkynetContext } from "../state/SkynetContext";
import Container from "@material-ui/core/Container";
import BlogPreviewProfile from "../components/BlogPreviewProfile";
import { useParams } from "react-router-dom";
import { loadBlogProfile } from "../data/feedLibrary";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import { displayName } from "../data/displayName";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import ErrorDisplay from "../components/ErrorDisplay";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Button from "@material-ui/core/Button";
import SocialIcons from "../components/SocialIcons";
import { getLatest, togglePinPost } from "../data/feedLibrary";
import IconButton from "@material-ui/core/IconButton";
import SortIcon from "@material-ui/icons/Sort";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

//Profile page component, used to view a users blogs in a feed
export default function Profile(props) {
  /*
  id -> get params from route, id = 'ed25519-' + user's MySky userID
  postFeed -> feed array of blog posts
  profile -> user profile object state
  isLoading -> loading state
  showError -> handles showing error if user doesn't exist
  isMine -> state to indicate to the app if this is the current user's profile
  isMoreLoading -> state for showing post loading at bottom of already loaded feed posts
  pinnedPosts -> boolean to track if there are any pinned posts
  menuAnchor -> state to handle anchor of sorting menu
  allLoaded -> state to track whether or not the end of pagination has been reached
  postLoader -> state to store asyncGenerator function for pagination
  feedDAC, getUserProfile, isMySkyLoading, client, userID, mySky -> values from Skynet context used
   */
  const { id } = useParams();
  const [postFeed, setPostFeed] = useState([]);
  const [profile, setProfile] = useState();
  const [isLoading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [isMine, setMine] = useState(false);
  const [isMoreLoading, setMoreLoading] = useState(true);
  const [pinnedPosts, setPinnedPosts] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [allLoaded, setAllLoaded] = useState(false);
  const [postLoader, setPostLoader] = useState(null);
  const { feedDAC, getUserProfile, isMySkyLoading, client, userID, mySky } =
    useContext(SkynetContext);

  //process the postArr loaded from the feedDAC
  //retrieve most recent version of post using resolver link and insert each post when each response is received
  const processPosts = (postArr) => {
    let updatedPosts = postFeed;
    let countStart = 0; //counts to track whether or not the resolver loading is complete for all posts
    let countFinish = 0;
    postArr.forEach((item, index) => {
      if (!item.isDeleted) {
        countStart += 1;
        getLatest(item, client, true).then((response) => {
          postArr[index] = response;
          if (response.isPinned) {
            setPinnedPosts(true);
          }
          updatedPosts.push(response);
          updatedPosts.sort((a, b) => {
            if (a.ts >= b.ts) return -1;
            return 1;
          });
          setPostFeed([...updatedPosts]);
          setLoading(false);
          countFinish += 1;
          if (countFinish === countStart) {
            setMoreLoading(false);
          }
        });
      }
    });
  };

  //use effect for handling the pagination
  useEffect(() => {
    if (postLoader) {
      const loadNext = async () => {
        if (
          window.innerHeight + document.documentElement.scrollTop ===
            document.scrollingElement.scrollHeight &&
          !allLoaded
        ) {
          const nextPage = await postLoader.next();
          if (nextPage.done) {
            setAllLoaded(true);
          } else {
            processPosts(nextPage.value);
          }
        }
      };
      window.addEventListener("scroll", loadNext);
    }
  }, [postLoader, allLoaded]);

  //execute this effect on entry and when the feedDAC connection status is valid
  useEffect(() => {
    setLoading(true);
    setProfile(null);
    if (!isMySkyLoading && feedDAC.connector) {
      //handle retrieval of profile DAC data and feed array
      const getProfileData = async () => {
        setShowError(false);
        const profile = await getUserProfile(id.substring(8));
        setMine(id.substring(8) === userID);
        if (!profile.error) {
          setProfile(profile);
          const postsLoader = await loadBlogProfile(
            id.substring(8),
            feedDAC,
            client
          );
          const page0 = await postsLoader.next();
          setPostLoader(postsLoader);
          console.log("FEED: ", page0);
          //loop and variables for loading in resolver links in parallel
          if (page0.done) setAllLoaded(true);
          let postArr = page0.value;
          processPosts(postArr);
        } else {
          setShowError(true);
        }
      };
      getProfileData();
    }
  }, [isMySkyLoading, feedDAC, getUserProfile, id, client, userID]);

  //handle the pinning and unpinning of a post
  const handlePin = (postRef) => {
    const updatedFeed = postFeed;
    let result = updatedFeed.find((obj) => {
      return obj.ref === postRef;
    });
    result.isPinned = !result.isPinned;
    const resolverJSON = {
      isPinned: result.isPinned,
      blogBody: result.content.text,
      title: result.content.title,
      subtitle: result.content.ext.subtitle,
      ts: result.ts,
    };
    togglePinPost(resolverJSON, result.content.ext.postPath, mySky);
    let newFeed = postFeed.filter((obj) => {
      return obj.ref !== postRef;
    });
    newFeed.push(result);
    newFeed.sort((a, b) => {
      if (a.ts >= b.ts) return -1;
      return 1;
    });
    setPostFeed(newFeed);
    setPinnedPosts(false);

    newFeed.forEach((item) => {
      if (item.isPinned) setPinnedPosts(true);
    });
  };

  //handle opening of sort menu
  const handleSortClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  //handle close of sort menu
  const handleSortClose = () => {
    setMenuAnchor(null);
  };

  //handle removal of post upon deletion
  const handleRemovePost = (ref) => {
    let updatedFeed = postFeed.filter((e) => {
      return e.ref !== ref;
    });
    setPostFeed([...updatedFeed]);
  };

  return (
    <Container maxWidth={false}>
      {!showError ? (
        <>
          <Container style={{ marginTop: 40 }}>
            <Grid container spacing={2}>
              <Grid item>
                {profile ? (
                  <Avatar
                    style={{ height: 175, width: 175 }}
                    aria-label={"Author"}
                    src={
                      profile.avatar.length >= 1
                        ? `https://siasky.net${profile.avatar[0].url.substring(
                            5
                          )}`
                        : null
                    }
                  />
                ) : (
                  <Skeleton
                    variant={"circle"}
                    animation={"wave"}
                    height={175}
                    width={175}
                  />
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sm
                container
                style={{
                  marginLeft: 14,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Container>
                  <Typography variant={"h3"}>
                    {profile ? (
                      displayName(profile, id.substring(8))
                    ) : (
                      <Skeleton animation={"wave"} />
                    )}
                  </Typography>
                  <Typography
                    variant={"h6"}
                    gutterBottom={true}
                    color={"textSecondary"}
                  >
                    {profile ? (
                      profile.aboutMe
                    ) : (
                      <Skeleton animation={"wave"} />
                    )}
                  </Typography>
                </Container>

                {profile && profile.connections.length > 0 ? (
                  <SocialIcons connectionsArr={profile.connections} />
                ) : profile && userID === id.substring(8) ? (
                  <Container>
                    <Button
                      variant="contained"
                      color="primary"
                      href={"https://skyprofile.hns.siasky.net/"}
                      target={"_blank"}
                      endIcon={<OpenInNewIcon />}
                    >
                      Create your MySky Profile
                    </Button>
                  </Container>
                ) : null}
              </Grid>
            </Grid>
          </Container>
          <Divider variant="middle" style={{ marginTop: 30 }} />
          {!isLoading && pinnedPosts ? (
            <>
              <Grid
                container
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography color={"textSecondary"}>Pinned Posts</Typography>
                <IconButton onClick={handleSortClick}>
                  <SortIcon />
                </IconButton>
              </Grid>
              <Grid
                container
                justifyContent={"space-around"}
                alignItems={"center"}
              >
                {postFeed.map((item, index) =>
                  !item.isDeleted && item.isPinned ? (
                    <Grid key={item.id} item xs={"auto"}>
                      <BlogPreviewProfile
                        post={item}
                        feedDAC={feedDAC}
                        isMine={isMine}
                        handleRemovePost={handleRemovePost}
                        handlePin={handlePin}
                      />
                    </Grid>
                  ) : null
                )}
              </Grid>
              <Divider
                variant="middle"
                style={{ marginTop: 10, marginBottom: 30 }}
              />
            </>
          ) : null}

          {!pinnedPosts && postFeed.length !== 0 ? (
            <Grid
              container
              justifyContent={"flex-end"}
              style={{ paddingTop: 0, paddingBottom: 0 }}
            >
              <IconButton onClick={handleSortClick}>
                <SortIcon />
              </IconButton>
            </Grid>
          ) : null}
          <Grid container justifyContent={"space-around"} alignItems={"center"}>
            {!isLoading && postFeed.length !== 0 ? (
              postFeed.map((item, index) =>
                !item.isDeleted && !item.isPinned ? (
                  <Grid key={item.id} item md={"auto"}>
                    <BlogPreviewProfile
                      post={item}
                      feedDAC={feedDAC}
                      isMine={isMine}
                      handleRemovePost={handleRemovePost}
                      handlePin={handlePin}
                    />
                  </Grid>
                ) : null
              )
            ) : !isLoading ? (
              <Typography
                variant={"h6"}
                align={"center"}
                style={{ margin: 30 }}
                gutterBottom={true}
                color={"textSecondary"}
              >
                No posts to show.
              </Typography>
            ) : (
              <Grid item md={6}>
                <Skeleton
                  height={window.innerHeight * 0.75}
                  animation={"wave"}
                />
              </Grid>
            )}
            {isMoreLoading && !isLoading ? (
              <Grid item md={6} style={{ marginTop: 20 }}>
                <Typography variant={"caption"}>
                  <Skeleton animation={"wave"} />
                </Typography>
                <Typography variant={"h1"}>
                  <Skeleton animation={"wave"} />
                </Typography>
                <Typography variant={"h5"} gutterBottom={true}>
                  <Skeleton animation={"wave"} />
                </Typography>
              </Grid>
            ) : null}
          </Grid>
        </>
      ) : (
        <ErrorDisplay title={"This user does not exist."} />
      )}
      <Menu
        id={"sort-menu"}
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleSortClose}
      >
        <MenuItem onClick={handleSortClose}>Coming Soon!</MenuItem>
      </Menu>
    </Container>
  );
}
