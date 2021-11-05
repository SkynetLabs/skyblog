import React, { useEffect, useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import { displayName } from "../data/displayName";
import { SkynetContext } from "../state/SkynetContext";
import { Link } from "react-router-dom";
import FollowIndicator from "./FollowIndicator";
import { followUser } from "../data/socialLibrary";

export default function ProfileItem(props) {
  /*
    props -> profileData and userID for profile
    userID, myFollowing, setMyFollowing, socialDAC -> all states or instances from SkynetContext
    isFollowing -> state to indicate whether user is following a user or not
    followStatus -> state to manage which loading indicator to show for FollowIndicator
     */
  const { profileData, profileID } = props;
  const { userID, myFollowing, setMyFollowing, socialDAC } =
    useContext(SkynetContext);
  const [isFollowing, setFollowing] = useState(false);
  const [followStatus, setFollowStatus] = useState(null);

  useEffect(() => {
    //track whether following or not
    if (userID && myFollowing) {
      setFollowing(myFollowing.includes(profileID));
    }
  }, [myFollowing, profileID, userID]);

  return (
    <>
      <Link to={"/profile/ed25519-" + profileID} className="col-span-1 flex">
        <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 m-2 text-white text-sm font-medium overflow-hidden rounded-full">
          {profileData.avatar && profileData.avatar.length >= 1 ? (
            <img
              src={
                profileData.avatar[0].url.startsWith("sia://")
                  ? `https://siasky.net${profileData.avatar[0].url.substring(
                      5
                    )}`
                  : `https://siasky.net/${profileData.avatar[0].url.substring(
                      4
                    )}`
              }
              alt={""}
            />
          ) : (
            <Avatar
              style={{ height: 60, width: 60 }}
              aria-label={"Profpic"}
              src={null}
            />
          )}
        </div>

        <div className="flex-1 flex items-center justify-between truncate">
          <div className="flex-1 px-4 py-2 text-sm truncate space-y-1 text-left">
            <div className="font-semibold text-palette-600 hover:text-primary transition-colors">
              {displayName(profileData, profileID)}
            </div>

            <p className="text-palette-400 text-xs truncate">
              {profileData.aboutMe}
            </p>
          </div>
        </div>
        {userID && userID !== profileID ? (
          <div className="flex items-center pr-4">
            <button
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                followUser(
                  isFollowing,
                  setFollowing,
                  myFollowing,
                  setMyFollowing,
                  setFollowStatus,
                  socialDAC,
                  profileID
                );
              }}
              className="justify-center my-2 py-2 px-5 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-palette-600 bg-primary hover:bg-primary-light transition-colors duration-200 hidden sm:block"
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        ) : null}
      </Link>
      <FollowIndicator
        followStatus={followStatus}
        setFollowStatus={setFollowStatus}
      />
    </>
  );
}
