import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { displayName } from "../data/displayName";
import { Link } from "react-router-dom";

//SearchProfile is a component for displaying a profile item in the user search
export default function SearchProfile(props) {
  const { profileData } = props; //profile data to display

  return (
    <>
      <Link
        to={"/profile/ed25519-" + profileData.userID}
        className="col-span-1 flex"
      >
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
              {displayName(profileData, profileData.userID)}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
