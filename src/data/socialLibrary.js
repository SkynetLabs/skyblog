/**
 * followUser() follow/unfollow a user using the socialDAC
 * @param {boolean} isFollowing is the user currently being followed
 * @param setFollowing change parent state of isFollowing
 * @param {array} myFollowing array of current following list
 * @param setMyFollowing set state array of current following list
 * @param setFollowStatus set state that manages the loading indicators for following
 * @param socialDAC instance of the socialDAC
 * @param {string} id userID to follow
 */

export const followUser = async (
  isFollowing,
  setFollowing,
  myFollowing,
  setMyFollowing,
  setFollowStatus,
  socialDAC,
  id
) => {
  let newFollowing = myFollowing;
  if (isFollowing) {
    //unfollow user
    setFollowStatus("unfollow");
    setFollowing(false);
    const res = await socialDAC.unfollow(id);
    if (res.success) {
      setFollowStatus("successUnfollow");
      const i = newFollowing.indexOf(id);
      if (i > -1) newFollowing.splice(i, 1);
      setMyFollowing([...newFollowing]);
      localStorage.setItem("myFollowing", JSON.stringify(newFollowing));
    } else {
      setFollowStatus("errorUnfollow");
      setFollowing(true);
    }
  } else {
    //follow user
    setFollowStatus("follow");
    setFollowing(true);
    const res = await socialDAC.follow(id);
    if (res.success) {
      setFollowStatus("successFollow");
      newFollowing.push(id);
      setMyFollowing([...newFollowing]);
      localStorage.setItem("myFollowing", JSON.stringify(newFollowing));
    } else {
      setFollowStatus("errorFollow");
      setFollowing(false);
    }
  }
};
