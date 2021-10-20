import React, { useContext, useState, useEffect } from "react";
import ProfileItem from "./ProfileItem";
import { SkynetContext } from "../state/SkynetContext";
import isEqual from "lodash/isEqual";
import XIcon from "@heroicons/react/outline/XIcon";
import Spinner from "./Spinner";

export default function FollowingList(props) {
  /*
    props -> following list from the profile
    getUserProfile -> function to retrieve profile from UserProfileDAC
    profileList -> state to store retrieved profiles
    isLoading -> state to indicate loading status
     */
  const { followingList, setShowFollowing } = props;
  const { getUserProfile } = useContext(SkynetContext);
  const [profileList, setProfileList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    //get all of the following profiles for a user
    const getProfiles = async () => {
      let profiles = [];
      followingList.forEach((item) => {
        const localProfile = JSON.parse(localStorage.getItem(item));
        if (localProfile) {
          profiles.push(localProfile);
          setProfileList([...profiles]);
          setLoading(false);
          getUserProfile(item).then((res) => {
            if (!isEqual(localProfile, res)) {
              const i = profiles.indexOf(localProfile);
              profiles[i] = res;
              setProfileList([...profiles]);
              localStorage.setItem(item, JSON.stringify(res));
            }
          });
        } else {
          //get remote
          getUserProfile(item).then((res) => {
            profiles.push(res);
            setProfileList([...profiles]);
            setLoading(false);
            localStorage.setItem(item, JSON.stringify(res));
          });
        }
      });
      setLoading(false);
    };
    //condition ensures single call of getProfiles()
    if (isLoading) {
      getProfiles();
    }
  }, [followingList, getUserProfile, isLoading]);

  return (
    <div className={"md:max-w-xl mx-auto px-4 sm:px-6 lg:max-w-2xl lg:px-8"}>
      <div className={"flex flex-row justify-between align-center mt-4 mb-2"}>
        <div className="max-w-xl mt-1 text-base sm:text-2xl text-palette-300 space-y-1 md:space-y-2 font-content">
          <p>Following</p>
        </div>
        <button
          onClick={() => setShowFollowing(false)}
          className="flex items-center rounded-full p-2 hover:bg-palette-100 transition-colors duration-200"
        >
          <XIcon className={"h-6 w-6"} />
        </button>
      </div>
      <ul className="space-y-2 sm:grid sm:grid-cols-1 sm:gap-x-6 sm:gap-y-2 sm:space-y-0 md:grid-cols-1 lg:grid-cols-1 lg:gap-x-8">
        {followingList.length > 0 && !isLoading ? (
          profileList.map((item, index) => (
            <li key={followingList[index]}>
              <ProfileItem
                profileData={item}
                profileID={followingList[index]}
              />
            </li>
          ))
        ) : !isLoading ? (
          <div className="max-w-xl mt-1 text-base sm:text-lg text-palette-300 space-y-1 md:space-y-2 font-content">
            <p>No Users to Show.</p>
          </div>
        ) : (
          <Spinner text={"Loading Following"} />
        )}
      </ul>
    </div>
  );
}
