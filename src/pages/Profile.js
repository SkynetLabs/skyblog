import React, { useState, useEffect, useContext } from "react";
import { SkynetContext } from "../state/SkynetContext";
import Container from "@material-ui/core/Container";
import BlogPreviewProfile from "../components/BlogPreviewProfile";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { loadBlogProfile } from "../data/feedLibrary";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import { displayName } from "../data/displayName";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));
export default function Profile(props) {
  const { id } = useParams();
  const [postFeed, setPostFeed] = useState([]);
  const [profile, setProfile] = useState();
  const [postsLoader, setPostsLoader] = useState();
  const [isLoading, setLoading] = useState(true);
  const { feedDAC, getUserProfile, isMySkyLoading } = useContext(SkynetContext);

  useEffect(() => {
    if (!isMySkyLoading) {
      getProfileData();
    }
  }, [isMySkyLoading]);

  const getProfileData = async () => {
    const profile = await getUserProfile(id.substring(8));
    console.log("PROFILE", profile);
    setProfile(profile);
    const postsLoader = await loadBlogProfile(id.substring(8), feedDAC);
    setPostsLoader(postsLoader);
    const page0 = await postsLoader.next();
    console.log("PAGE0: ", page0);
    setPostFeed(page0.value);
    setLoading(false);
  };
  const bioDisplay = () => {
    if (profile.aboutMe != "" && profile.aboutMe != null) {
      return profile.aboutMe;
    }
    return "This is an example of a bio";
  };

  return (
    <Container maxWidth={false}>
      <Container style={{ marginTop: 40 }}>
        <Typography variant={"h3"}>
          {!isLoading ? (
            displayName(profile, id)
          ) : (
            <Skeleton animation={"wave"} />
          )}
        </Typography>
        <Typography variant={"h6"} gutterBottom={true} color={"textSecondary"}>
          {!isLoading ? bioDisplay() : <Skeleton animation={"wave"} />}
        </Typography>
      </Container>
      <Divider variant="middle" style={{ marginTop: 30 }} />
      <Container maxWidth={"md"}>
        {!isLoading ? (
          postFeed.map((item, index) => <BlogPreviewProfile post={item} />)
        ) : (
          <Skeleton height={window.innerHeight * 0.75} animation={"wave"} />
        )}
      </Container>
    </Container>
  );
}
