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
import ErrorDisplay from "../components/ErrorDisplay";
import ShareButton from "../components/ShareButton";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Button from "@material-ui/core/Button";

//Profile page component, used to view a users blogs in a feed
export default function Profile(props) {
  /*
  id -> get params from route, id = 'ed25519-' + user's MySky userID
  postFeed -> feed array of blog posts
  profile -> user profile object state
  isLoading -> loading state
  showError -> handles showing error if user doesn't exist
  feedDAC, getUserProfile, isMySkyLoading, cliet -> values from Skynet context used
   */
  const { id } = useParams();
  const [postFeed, setPostFeed] = useState([]);
  const [profile, setProfile] = useState();
  const [isLoading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const { feedDAC, getUserProfile, isMySkyLoading, userID } =
    useContext(SkynetContext);

  //execute this effect on entry and when the feedDAC connection status is valid
  useEffect(() => {
    if (!isMySkyLoading && feedDAC.connector) {
      //handle retrieval of profile DAC data and feed array
      const getProfileData = async () => {
        setShowError(false);
        const profile = await getUserProfile(id.substring(8));
        console.log("PROFILE", profile);
        if (!profile.error) {
          setProfile(profile);
          const postsLoader = await loadBlogProfile(id.substring(8), feedDAC);
          const page0 = await postsLoader.next();
          setPostFeed(page0.value);
          setLoading(false);
        } else {
          setShowError(true);
        }
      };
      getProfileData();
    }
  }, [isMySkyLoading, feedDAC, getUserProfile, id]);

  return (
    <Container maxWidth={false}>
      {!showError ? (
        <>
          <Container style={{ marginTop: 40 }}>
            <Grid container spacing={2}>
              <Grid item>
                {!isLoading ? (
                  <Avatar
                    style={{ height: 175, width: 175 }}
                    aria-label={"Author"}
                    src={
                      profile.avatar.length >= 1 ? profile.avatar[0].url : null
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
                    {!isLoading ? (
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
                    {!isLoading ? (
                      profile.aboutMe
                    ) : (
                      <Skeleton animation={"wave"} />
                    )}
                  </Typography>
                </Container>

                {!isLoading && profile.connections.length > 0 ? (
                  <Container>
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
                    <ShareButton />
                  </Container>
                ) : !isLoading && userID === id.substring(8) ? (
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
          <Container>
            {!isLoading && postFeed.length !== 0 ? (
              postFeed.map((item, index) => (
                <BlogPreviewProfile key={item.id} post={item} />
              ))
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
              <Skeleton height={window.innerHeight * 0.75} animation={"wave"} />
            )}
          </Container>
        </>
      ) : (
        <ErrorDisplay title={"This user does not exist."} />
      )}
    </Container>
  );
}
