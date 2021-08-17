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
      const dacsArray = [userProfile, feedDAC];
      await mySky.loadDacs(...dacsArray);

      const checkLogIn = await mySky.checkLogin();
      setMySky(mySky);

      if (checkLogIn) {
        console.log("LOGGED IN");
        loginActions(mySky);
      } else {
        console.log("LOGGED OUT");
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
    setUserID(userID);
    setMySkyLoading(false); //mySky done loading, change state
  };

  //get a specified user's profile information from the profile DAC
  const getUserProfile = async (userID) => {
    const prof = await userProfile.getProfile(userID);
    return prof;
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
        client,
        getUserProfile,
        initiateLogin,
        mySkyLogout,
        feedDAC,
      }}
    >
      {children}
    </SkynetContext.Provider>
  );
};

export { SkynetContext, SkynetProvider };
