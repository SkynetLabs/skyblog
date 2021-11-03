import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Twitter from "@material-ui/icons/Twitter";
import GitHub from "@material-ui/icons/GitHub";
import Telegram from "@material-ui/icons/Telegram";
import Reddit from "@material-ui/icons/Reddit";
import Facebook from "@material-ui/icons/Facebook";
import ShareButton from "./ShareButton";

//SocialIcons component is component to display social icons
export default function SocialIcons(props) {
  const { connectionsArr } = props;

  return (
    <div className={"flex justify-center md:justify-start"}>
      {connectionsArr[2].github ? (
        <IconButton
          target={"_blank"}
          href={connectionsArr[2].github}
          aria-label="github"
        >
          <GitHub />
        </IconButton>
      ) : null}
      {connectionsArr[4].telegram ? (
        <IconButton
          target={"_blank"}
          href={connectionsArr[4].telegram}
          aria-label="telegram"
        >
          <Telegram />
        </IconButton>
      ) : null}
      {connectionsArr[0].twitter ? (
        <IconButton
          target={"_blank"}
          href={connectionsArr[0].twitter}
          aria-label="twitter"
        >
          <Twitter />
        </IconButton>
      ) : null}
      {connectionsArr[3].reddit ? (
        <IconButton
          target={"_blank"}
          href={connectionsArr[3].reddit}
          aria-label="reddit"
        >
          <Reddit />
        </IconButton>
      ) : null}
      {connectionsArr[1].facebook ? (
        <IconButton
          target={"_blank"}
          href={connectionsArr[1].facebook}
          aria-label="facebook"
        >
          <Facebook />
        </IconButton>
      ) : null}
      <ShareButton />
    </div>
  );
}
