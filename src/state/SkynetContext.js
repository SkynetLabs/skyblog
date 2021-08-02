import { createContext, useState, useEffect } from "react";
import { SkynetClient } from "skynet-js";

import { UserProfileDAC } from "@skynethub/userprofile-library";
import { FeedDAC } from "feed-dac-library";
import { SocialDAC } from "social-dac-library";

const SkynetContext = createContext(undefined);

// We'll define a portal to allow for developing on localhost.
// When hosted on a skynet portal, SkynetClient doesn't need any arguments.
const portal =
  window.location.hostname === "localhost" ? "https://siasky.net" : undefined;

//host skapp
const hostApp = "skyblog.hns";

// Initiate the SkynetClient
const client = new SkynetClient(portal);

// For now, we won't use any DACs -- uncomment to create
// const contentRecord = new ContentRecordDAC();
const contentRecord = null;
const userProfile = new UserProfileDAC();
const feedDAC = new FeedDAC();
const socialDAC = new SocialDAC();

const dataDomain =
  window.location.hostname === "localhost" ? "localhost" : "skyblog.hns";

const SkynetProvider = ({ children }) => {
  const [isMySkyLoading, setMySkyLoading] = useState(true); // state to inidicate whether MySky has loaded

  const [userID, setUserID] = useState(null);
  const [mySky, setMySky] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);
  const [userFeed, setUserFeed] = useState(null);

  useEffect(() => {
    initMySky();
  }, []);

  //initialization of mySky and DACs, check log in status
  const initMySky = async () => {
    try {
      const mySky = await client.loadMySky(hostApp);

      //load in user profile, feed, and social DACs
      await mySky.loadDacs([userProfile, feedDAC, socialDAC]);

      const checkLogIn = await mySky.checkLogin();
      setMySky(mySky);

      if (checkLogIn) {
        loginActions(mySky);
      } else {
        setMySkyLoading(false);
      }
    } catch (e) {
      console.log(e);
      setMySkyLoading(false);
    }
  };

  //function to call on login button press
  const initiateLogin = async () => {
    mySky.requestLoginAccess().then((response) => {
      if (response) {
        setMySkyLoading(true);
        loginActions(mySky);
      }
    });
  };

  //actions to perform on successful login check or initial user login
  const loginActions = async (mySky) => {
    const userID = await mySky.userID();
    getUserPreferences(userID);
    const profile = await getUserProfile(userID);
    setProfile(profile);
    setUserID(userID);
    setMySkyLoading(false); //mySky done loading, change state
    //fetch feed after profile loaded
    const feed = await getUserFeed(userID);
    setUserFeed(feed);
  };

  //get the current user's global preferences to set DarkMode
  const getUserPreferences = async (userID) => {
    const preferences = userProfile.getPreferences(userID);
    setUserPreferences(preferences);
  };

  //get a specified user's profile information from the profile DAC
  const getUserProfile = async (userID) => {
    const prof = await userProfile.getProfile(userID);
    return prof;
  };

  //function to load a specified user's feed of posts
  const getUserFeed = async (userID) => {
    const feed = await feedDAC.loadPostsForUser(userID);
    return feed;
  };

  //function to upload blog post to the feedDAC
  //Assumes postJSON is in SkyStandard Post format (for blog post)
  //Embedded images already uploaded to skynet and links within the markdown
  const createBlogPost = async (postJSON) => {
    const res = await feedDAC.createPost(postJSON);
    return res;
  };

  //get the following list for a user using the Social DAC
  const getFollowingList = async (userID) => {
    const followingList = await socialDAC.getFollowingForUser(userID);
    return followingList;
  };
  //follow a user with id, userID
  const followUser = async (userID) => {
    const res = await socialDAC.follow(userID);
    return res;
  };

  const mySkyLogout = () => {
    mySky.logout();
    setUserID("");
    setProfile(null);
    setUserFeed(null);
  };

  return (
    <SkynetContext.Provider
      value={{
        isMySkyLoading,
        userID,
        mySky,
        profile,
        userPreferences,
        userFeed,
        getUserProfile,
        getUserFeed,
        createBlogPost,
        getFollowingList,
        followUser,
        initiateLogin,
        mySkyLogout,
      }}
    >
      {children}
    </SkynetContext.Provider>
  );
};

export { SkynetContext, SkynetProvider };
