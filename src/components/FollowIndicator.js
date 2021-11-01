import React from "react";
import CustomIndicator from "./CustomIndicator";

//UpdatingIndicator is a component that shows when the application is checking if there are updates needed for local storage
export default function FollowIndicator(props) {
  /*
          props -> followStatus, setFollowStatus
           */
  const { followStatus, setFollowStatus } = props;

  //close the notifs
  const handleClose = () => {
    setFollowStatus(null);
  };

  return (
    <>
      <CustomIndicator
        openStatus={followStatus === "follow"}
        indicatorType={"info"}
        message={"Following User..."}
        handleClose={handleClose}
      />
      <CustomIndicator
        openStatus={followStatus === "unfollow"}
        indicatorType={"info"}
        message={"Unfollowing User..."}
        handleClose={handleClose}
      />
      <CustomIndicator
        openStatus={followStatus === "successFollow"}
        indicatorType={"success"}
        message={"Successfully followed user."}
        handleClose={handleClose}
      />
      <CustomIndicator
        openStatus={followStatus === "successUnfollow"}
        indicatorType={"success"}
        message={"Successfully unfollowed user."}
        handleClose={handleClose}
      />
      <CustomIndicator
        openStatus={followStatus === "errorFollow"}
        indicatorType={"error"}
        message={"Error following user."}
        handleClose={handleClose}
      />
      <CustomIndicator
        openStatus={followStatus === "errorUnfollow"}
        indicatorType={"error"}
        message={"Error unfollowing user."}
        handleClose={handleClose}
      />
    </>
  );
}
