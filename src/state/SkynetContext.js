import { createContext, useState, useEffect } from "react";
import { SkynetClient, Permission, PermCategory, PermType } from "skynet-js";

import { UserProfileDAC } from "@skynethub/userprofile-library";
import { FeedDAC } from "feed-dac-library";
import { SocialDAC } from "social-dac-library";
import { dataDomain } from "../data/consts";
import {
  clearLocalStorageFeed,
  setLocalStorage,
  getLocalStorage,
} from "../data/localStorage";

const SkynetContext = createContext(undefined);

// We'll define a portal to allow for developing on localhost.
// When hosted on a skynet portal, SkynetClient doesn't need any arguments.
const portal =
  window.location.hostname === "localhost" ? "https://siasky.net" : undefined;

// Initiate the SkynetClient
const client = new SkynetClient(portal);

// For now, we won't use any DACs -- uncomment to create
const userProfile = new UserProfileDAC();
const feedDAC = new FeedDAC();
const socialDAC = new SocialDAC();

//SkynetProvider handles mySky states and initialization
const SkynetProvider = ({ children }) => {
  /*
  isMySkyLoading -> state to indicate when mySky loading
  userID -> mySky user id
  mySky -> mySky instance
  profile -> userProfile state to store DAC profile
  userPreferences -> preferences state for DAC profile prefs
   */
  const [isMySkyLoading, setMySkyLoading] = useState(true);

  const [userID, setUserID] = useState(null);
  const [mySky, setMySky] = useState(null);
  const [profile, setProfile] = useState(null);
  const [myFollowing, setMyFollowing] = useState(null);

  useEffect(() => {
    //initialization of mySky and DACs, check log in status
    const initMySky = async () => {
      try {
        const mySky = await client.loadMySky();
        //load in user profile, feed, and social DACs
        const dacsArray = [userProfile, feedDAC, socialDAC];
        await mySky.loadDacs(...dacsArray);
        const reqDomain = await client.extractDomain(window.location.hostname);
        await mySky.addPermissions(
          new Permission(
            reqDomain,
            dataDomain,
            PermCategory.Discoverable,
            PermType.Write
          )
        );
        await mySky.addPermissions(
          new Permission(
            reqDomain,
            dataDomain,
            PermCategory.Discoverable,
            PermType.Read
          )
        );

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
    initMySky();
  }, []);
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
    getMyFollowing(userID);
    setMySkyLoading(false); //mySky done loading, change state
  };

  //get a specified user's profile information from the profile DAC
  const getUserProfile = async (userID) => {
    const prof = await userProfile.getProfile(userID);
    return prof;
  };

  const getMyFollowing = async (userID) => {
    const localFollowing = getLocalStorage("myFollowing");
    if (localFollowing) {
      setMyFollowing(localFollowing);
    }
    const following = await socialDAC.getFollowingForUser(userID);
    setMyFollowing(following);
    setLocalStorage("myFollowing", following);
  };
  //handle logout from mySky
  const mySkyLogout = async () => {
    try {
      await mySky.logout();
      setUserID("");
      setProfile(null);
      clearLocalStorageFeed();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  return (
    <SkynetContext.Provider
      value={{
        isMySkyLoading,
        userID,
        mySky,
        profile,
        client,
        feedDAC,
        socialDAC,
        myFollowing,
        setMyFollowing,
        getUserProfile,
        initiateLogin,
        mySkyLogout,
      }}
    >
      {children}
    </SkynetContext.Provider>
  );
};

export { SkynetContext, SkynetProvider };
