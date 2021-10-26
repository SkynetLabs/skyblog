import React, { useState, useEffect, useContext } from "react";
import { SkynetContext } from "../state/SkynetContext";
import Container from "@material-ui/core/Container";
import BlogPreviewProfile from "../components/BlogPreviewProfile";
import { useParams } from "react-router-dom";
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
import { getLatest, togglePinPost, loadBlogProfile } from "../data/feedLibrary";
import PinningAlerts from "../components/PinningAlerts";
import SortAscending from "@heroicons/react/outline/SortAscendingIcon";
import SortDescending from "@heroicons/react/outline/SortDescendingIcon";
import isEqual from "lodash/isEqual";
import UpdatingIndicator from "../components/UpdatingIndicator";
import {
  getLocalStorageProfile,
  setLocalStorageProfile,
  getLocalStorageFeed,
  setLocalStoragePost,
  setLocalStorageFeed,
} from "../data/localStorage";

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
  const [allLoaded, setAllLoaded] = useState(false);
  const [postLoader, setPostLoader] = useState(null);
  const [pinStatus, setPinStatus] = useState(null);
  const [isAscending, setAscending] = useState(true);
  const [initLocal, setInitLocal] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
  const { feedDAC, getUserProfile, isMySkyLoading, client, userID, mySky } =
    useContext(SkynetContext);

  //process the postArr loaded from the feedDAC
  //retrieve most recent version of post using resolver link and insert each post when each response is received
  const processPosts = (postArr, usedLocal = false) => {
    if (postArr.length === 0) {
      setLoading(false);
      setMoreLoading(false);
      return;
    }
    let updatedPosts = postFeed;
    let countFinish = 0;
    postArr.forEach((item, index) => {
      if (!item.isDeleted) {
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
          if (!usedLocal) {
            //did not pull local initially, so dynamically update
            //dont want to do this if using local bc paging would mess up the feed
            setPostFeed([...updatedPosts]);
            setLoading(false);
          }
          countFinish += 1;
          if (countFinish === postArr.length) {
            setMoreLoading(false);
            if (id.substring(8) === userID) {
              localProcess(updatedPosts);
            }
          }
        });
      } else {
        //accounting for deleted posts
        countFinish += 1;
        if (countFinish === postArr.length) {
          setLoading(false);
          setMoreLoading(false);
          if (id.substring(8) === userID) {
            localProcess(updatedPosts);
          }
        }
      }
    });
  };

  //process the local storage if this is the current user's profile
  const localProcess = (updatedPosts) => {
    let currentFeed = postFeed;
    updatedPosts.forEach((item) => {
      const i = currentFeed.findIndex((el) => el.ref === item.ref); //check if fetched post already in feed from local storage
      if (i >= 0) {
        currentFeed[i] = item; //update current feed with latest of the item
        setLocalStoragePost(item.ref, item);
      } else if (!item.isDeleted) {
        //insert any unaccounted for posts
        currentFeed.unshift(item);
      }
    });
    //sort posts to ensure order
    currentFeed.sort((a, b) => {
      if (a.ts >= b.ts) return -1;
      return 1;
    });
    const newLocalFeed = currentFeed.map((item) => {
      return item.ref;
    }); //create new feed array of refs for local storage
    setLocalStorageFeed(newLocalFeed);
    setPostFeed([...currentFeed]); //update state
    setUpdating(false);
    setLoading(false);
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
            processPosts(nextPage.value, initLocal);
          }
        }
      };
      window.addEventListener("scroll", loadNext);
    }
  }, [postLoader, allLoaded, initLocal]);

  //execute this effect on entry and when the feedDAC connection status is valid
  useEffect(() => {
    if (!isMySkyLoading && feedDAC.connector) {
      //get feed using only remote means
      const getInitFeed = async (usedLocal = false) => {
        const postsLoader = await loadBlogProfile(
          id.substring(8),
          feedDAC,
          client
        );
        const page0 = await postsLoader.next(); //initial p
        setPostLoader(postsLoader);
        console.log("FEED: ", page0);
        //loop and variables for loading in resolver links in parallel
        if (page0.done) setAllLoaded(true);
        let postArr = page0.value;
        processPosts(postArr, usedLocal);
      };
      //if it is current user's profile, use local storage
      const getMyInitFeed = async () => {
        const localFeed = getLocalStorageFeed();
        if (localFeed) {
          setUpdating(true);
          setInitLocal(true);
          setPinnedPosts(localFeed.pinStatus);
          setPostFeed(localFeed.feed);
          setLoading(false);
          setMoreLoading(false);
          getInitFeed(true);
        } else {
          getInitFeed();
        }
      };

      //handle retrieval of profile DAC data and feed array
      const getProfileData = async () => {
        setMine(id.substring(8) === userID);
        const localProfile = getLocalStorageProfile(id.substring(8));
        if (localProfile) {
          setProfile(localProfile);
          if (id.substring(8) === userID) {
            getMyInitFeed();
          } else {
            getInitFeed();
          }
          const profile = await getUserProfile(id.substring(8));
          if (!isEqual(profile, localProfile) && !profile.error) {
            setProfile(profile);
            setLocalStorageProfile(id.substring(8), profile);
          }
        } else {
          const profile = await getUserProfile(id.substring(8));
          if (!profile.error) {
            setProfile(profile);
            setLocalStorageProfile(id.substring(8), profile);
            if (id.substring(8) === userID) {
              getMyInitFeed();
            } else {
              getInitFeed();
            }
          } else {
            setShowError(true);
          }
        }
      };
      getProfileData();
    }
  }, [isMySkyLoading, feedDAC, getUserProfile, id, client, userID]);

  //handle the pinning and unpinning of a post
  const handlePin = async (postRef) => {
    const updatedFeed = postFeed;
    let result = updatedFeed.find((obj) => {
      return obj.ref === postRef;
    });
    if (result.isPinned) {
      setPinStatus("unpinning");
    } else {
      setPinStatus("pinning");
      setPinnedPosts(true);
    }
    result.isPinned = !result.isPinned;
    const resolverJSON = {
      isPinned: result.isPinned,
      blogBody: result.content.text,
      title: result.content.title,
      subtitle: result.content.ext.subtitle,
      ts: result.ts,
    };
    const res = await togglePinPost(
      postRef,
      resolverJSON,
      result.content.ext.postPath,
      result,
      mySky
    );
    setPinStatus(res.success ? "success" : "error");
    if (res.success) {
      let newFeed = postFeed.filter((obj) => {
        return obj.ref !== postRef;
      });
      newFeed.push(result);
      newFeed.sort((a, b) => {
        if (a.ts >= b.ts) return -1;
        return 1;
      });
      setPostFeed(newFeed);
      if (resolverJSON.isPinned) {
        return;
      }
      setPinnedPosts(false);
      newFeed.forEach((item) => {
        if (item.isPinned) setPinnedPosts(true);
      });
    } else {
      result.isPinned = !result.isPinned;
    }
  };

  //handle opening of sort menu
  const handleSortClick = () => {
    let updatedFeed = postFeed;
    if (isAscending) {
      setAscending(false);
      updatedFeed.sort((a, b) => {
        if (a.ts <= b.ts) return -1;
        return 1;
      });
    } else {
      setAscending(true);
      updatedFeed.sort((a, b) => {
        if (a.ts >= b.ts) return -1;
        return 1;
      });
    }
    setPostFeed(updatedFeed);
  };

  //handle removal of post upon deletion
  const handleRemovePost = (ref) => {
    let updatedFeed = postFeed.filter((e) => {
      return e.ref !== ref;
    });
    setPostFeed([...updatedFeed]);
  };

  return (
    <div
      className={
        "mx-auto bg-white pb-12 pt-4 px-4 max-w-full sm:px-6 lg:px-8 lg:pb-24 pt-8"
      }
    >
      {!showError ? (
        <>
          <div className={"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
            <Grid container spacing={2} wrap={"nowrap"}>
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
                sm
                container
                style={{
                  marginLeft: 14,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Container>
                  <p className="mt-1 text-3xl font-extrabold text-palette-600 sm:text-4xl sm:tracking-tight lg:text-5xl">
                    {profile ? (
                      displayName(profile, id.substring(8))
                    ) : (
                      <Skeleton animation={"wave"} />
                    )}
                  </p>
                  <div className="max-w-xl mt-1 text-base sm:text-xl text-palette-400 space-y-1 md:space-y-2 font-content">
                    {profile ? (
                      <p>{profile.aboutMe}</p>
                    ) : (
                      <Skeleton animation={"wave"} />
                    )}
                  </div>
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
          </div>
          <Divider variant="middle" style={{ marginTop: 30 }} />
          {!isLoading && pinnedPosts ? (
            <>
              <Grid
                container
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography color={"textSecondary"}>Pinned Posts</Typography>
                <button onClick={handleSortClick}>
                  {isAscending ? (
                    <SortAscending className={"h-6 w-6 m-2 text-palette-400"} />
                  ) : (
                    <SortDescending
                      className={"h-6 w-6 m-2 text-palette-400"}
                    />
                  )}
                </button>
              </Grid>
              <ul className="space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
                {postFeed.map((item, index) =>
                  !item.isDeleted && item.isPinned ? (
                    <li key={item.ref}>
                      <BlogPreviewProfile
                        post={item}
                        feedDAC={feedDAC}
                        isMine={isMine}
                        handleRemovePost={handleRemovePost}
                        handlePin={handlePin}
                      />
                    </li>
                  ) : null
                )}
              </ul>
              <Divider
                variant="middle"
                style={{ marginTop: 10, marginBottom: 30 }}
              />
            </>
          ) : null}
          {!pinnedPosts && postFeed.length !== 0 ? (
            <div className={"flex justify-end w-full"}>
              <button onClick={handleSortClick}>
                {isAscending ? (
                  <SortAscending className={"h-6 w-6 m-2 text-palette-400"} />
                ) : (
                  <SortDescending className={"h-6 w-6 m-2 text-palette-400"} />
                )}
              </button>
            </div>
          ) : null}

          {!isLoading && postFeed.length !== 0 ? (
            <ul className="space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
              {postFeed.map((item, index) =>
                !item.isDeleted && !item.isPinned ? (
                  <li key={item.ref}>
                    <BlogPreviewProfile
                      post={item}
                      feedDAC={feedDAC}
                      isMine={isMine}
                      handleRemovePost={handleRemovePost}
                      handlePin={handlePin}
                    />
                  </li>
                ) : null
              )}
            </ul>
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
            <ul className="space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
              {["0", "1", "2", "3"].map((item) => (
                <li key={item}>
                  <div className="space-y-4">
                    <Skeleton
                      height={window.innerHeight * 0.5}
                      style={{ minWidth: 300 }}
                      animation={"wave"}
                    />
                  </div>
                </li>
              ))}
            </ul>
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
        </>
      ) : (
        <ErrorDisplay title={"This user does not exist."} />
      )}
      <PinningAlerts pinStatus={pinStatus} setPinStatus={setPinStatus} />
      <UpdatingIndicator isUpdating={isUpdating} setUpdating={setUpdating} />
    </div>
  );
}
