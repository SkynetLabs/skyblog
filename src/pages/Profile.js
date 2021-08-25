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
import IconButton from "@material-ui/core/IconButton";
import Twitter from "@material-ui/icons/Twitter";
import GitHub from "@material-ui/icons/GitHub";
import Telegram from "@material-ui/icons/Telegram";
import Reddit from "@material-ui/icons/Reddit";
import Facebook from "@material-ui/icons/Facebook";

//Profile page component, used to view a users blogs in a feed
export default function Profile(props) {
  /*
  id -> get params from route, id = 'ed25519-' + user's MySky userID
  postFeed -> feed array of blog posts
  profile -> user profile object state
  postsLoader -> post loader state, to be used for paging
  isLoading -> loading state
  feedDAC, getUserProfile, isMySkyLoading, cliet -> values from Skynet context used
   */
  const { id } = useParams();
  const [postFeed, setPostFeed] = useState([]);
  const [profile, setProfile] = useState();
  const [postsLoader, setPostsLoader] = useState();
  const [isLoading, setLoading] = useState(true);
  const { feedDAC, getUserProfile, isMySkyLoading, client } =
    useContext(SkynetContext);

  //execute this effect on entry and when the feedDAC connection status is valid
  useEffect(() => {
    if (!isMySkyLoading && feedDAC.connector) {
      getProfileData();
    }
  }, [isMySkyLoading, feedDAC.connector]);

  //handle retrieval of profile DAC data and feed array
  const getProfileData = async () => {
    const profile = await getUserProfile(id.substring(8));
    setProfile(profile);
    const postsLoader = await loadBlogProfile(id.substring(8), feedDAC);
    setPostsLoader(postsLoader);
    const page0 = await postsLoader.next();
    setPostFeed(page0.value);
    setLoading(false);
  };

  return (
    <Container maxWidth={false}>
      <Container style={{ marginTop: 40 }}>
        <Typography variant={"h3"}>
          {!isLoading ? (
            displayName(profile, id.substring(8))
          ) : (
            <Skeleton animation={"wave"} />
          )}
        </Typography>
        <Typography variant={"h6"} gutterBottom={true} color={"textSecondary"}>
          {!isLoading ? profile.aboutMe : <Skeleton animation={"wave"} />}
        </Typography>
        {!isLoading ? (
          <Container style={{ padding: 0 }}>
            {profile.connections[2].github ? (
              <IconButton
                target={"_blank"}
                href={profile.connections[2].github}
                aria-label="github"
              >
                <GitHub />
              </IconButton>
            ) : null}
            {profile.connections[4].telegram ? (
              <IconButton
                target={"_blank"}
                href={profile.connections[4].telegram}
                aria-label="telegram"
              >
                <Telegram />
              </IconButton>
            ) : null}
            {profile.connections[0].twitter ? (
              <IconButton
                target={"_blank"}
                href={profile.connections[0].twitter}
                aria-label="twitter"
              >
                <Twitter />
              </IconButton>
            ) : null}
            {profile.connections[3].reddit ? (
              <IconButton
                target={"_blank"}
                href={profile.connections[3].reddit}
                aria-label="twitter"
              >
                <Reddit />
              </IconButton>
            ) : null}
            {profile.connections[1].facebook ? (
              <IconButton
                target={"_blank"}
                href={profile.connections[1].facebook}
                aria-label="twitter"
              >
                <Facebook />
              </IconButton>
            ) : null}
          </Container>
        ) : null}
      </Container>
      <Divider variant="middle" style={{ marginTop: 30 }} />
      <Container>
        <Grid container spacing={3}>
          <Grid
            item
            xs
            style={{ marginTop: 20, display: "flex", justifyContent: "center" }}
          >
            {!isLoading ? (
              <Avatar
                style={{ height: 175, width: 175 }}
                aria-label={"Author"}
                src={profile.avatar ? profile.avatar[0].url : null}
              />
            ) : null}
          </Grid>
          <Grid item xs={6}>
            {!isLoading ? (
              postFeed.map((item, index) => (
                <BlogPreviewProfile key={item.id} post={item} id={id} />
              ))
            ) : (
              <Skeleton height={window.innerHeight * 0.75} animation={"wave"} />
            )}
          </Grid>
          <Grid item xs></Grid>
        </Grid>
      </Container>
    </Container>
  );
}
