import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { loadBlogPost, togglePinPost } from "../data/feedLibrary";
import { SkynetContext } from "../state/SkynetContext";
import ReactMarkdown from "markdown-to-jsx";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";
import { displayName } from "../data/displayName";
import { useHistory, Link } from "react-router-dom";
import ErrorDisplay from "../components/ErrorDisplay";
import ShareButton from "../components/ShareButton";
import CardMedia from "@material-ui/core/CardMedia";
import PreviewMenu from "../components/PreviewMenu";
import PinningAlerts from "../components/PinningAlerts";
import UpdatingIndicator from "../components/UpdatingIndicator";
import {
  setLocalStoragePost,
  getLocalStoragePost,
  getLocalStorageProfile,
} from "../data/localStorage";
import { followUser } from "../data/socialLibrary";
import FollowIndicator from "../components/FollowIndicator";

function MarkdownListItem(props) {
  return (
    <li className={"ml-2 font-body font-extralight text-body"}>
      {props.children.length > 1 ? props.children : "- " + props.children}
    </li>
  );
}

const options = {
  overrides: {
    h1: {
      props: {
        className: "text-7xl mt-6",
      },
    },
    h2: {
      props: {
        className: "text-6xl mt-6",
      },
    },
    h3: {
      props: {
        className: "text-5xl mt-6",
      },
    },
    h4: {
      props: {
        className: "text-4xl mt-6",
      },
    },
    h5: {
      props: {
        className: "text-3xl mt-6",
      },
    },
    h6: {
      props: {
        className: "text-2xl mt-6",
      },
    },
    p: {
      props: {
        paragraph: true,
        className: "font-body font-extralight leading-1.58 text-body",
      },
    },
    a: { props: { className: "text-primary hover:underline" } },
    li: {
      component: MarkdownListItem,
    },
    img: {
      component: CardMedia,
      props: {
        component: "img",
        className: "my-4",
      },
    },
    blockquote: {
      props: { className: "italic" },
    },
  },
};

//Blog page component, used to create view blog posts, returns JSX layout for rendering blogs
export default function Blog(props) {
  /*
  getUserProfile, feedDAC, client, userID -> values to use from Skynet context
  ref, dac, domain, posts, file, id -> get parameters from the route
  postData -> state for blog post data
  isLoading -> state to render loading indicators
  date -> display date
  author -> author of the blog, userProfile DAC profile object
  showError -> show error if the post cannot be loaded or doesn't exist
  pinStatus -> whether or not the post is currently pinned
  deletingPost -> state to indicate if the post is currently being deleted
  history -> react router hook
  classes -> const to useStyles in JSX
   */
  const {
    getUserProfile,
    feedDAC,
    client,
    userID,
    mySky,
    myFollowing,
    setMyFollowing,
    socialDAC,
  } = useContext(SkynetContext);
  let { ref, dac, domain, posts, file, id } = useParams();
  const [postData, setPostData] = useState();
  const [isLoading, setLoading] = useState(true);
  const [date, setDate] = useState(null);
  const [author, setAuthor] = useState(null);
  const [showError, setShowError] = useState(false);
  const [pinStatus, setPinStatus] = useState(null);
  const [deletingPost, setDeletingPost] = useState(false);
  const [fullRef, setFullRef] = useState(null);
  const [isUpdating, setUpdating] = useState(false);
  const [isFollowing, setFollowing] = useState(false);
  const [followStatus, setFollowStatus] = useState(null);
  const history = useHistory();
  //execute this effect on entry and when the feedDAC connection status is valid
  useEffect(() => {
    if (ref != null && feedDAC.connector) {
      //handle using parameters to assemble post data including author and blog post data
      const getPostData = async () => {
        const val =
          "sky://" +
          ref +
          "/" +
          dac +
          "/" +
          domain +
          "/" +
          posts +
          "/" +
          file +
          "#" +
          id;
        setFullRef(val);
        let res;
        if (userID === ref.substring(8)) {
          //use local storage if it is current user's post
          const localPost = getLocalStoragePost(val);
          const localProfile = getLocalStorageProfile(ref.substring(8));
          if (localPost) {
            setUpdating(true);
            setPostData(localPost);
            setAuthor(localProfile);
            const localDate = new Date(localPost.ts);
            setDate(localDate.toDateString());
            setLoading(false);
            res = await loadBlogPost(val, feedDAC, client); //fetch remote to check for updates
          } else {
            res = await loadBlogPost(val, feedDAC, client);
            setLocalStoragePost(val, res);
          }
        } else {
          //if not current user's post, fetch remote
          res = await loadBlogPost(val, feedDAC, client);
          if (userID && myFollowing) {
            setFollowing(myFollowing.includes(ref.substring(8)));
          }
        }
        if (res) {
          setPostData(res);
          const profile = await getUserProfile(ref.substring(8)); //fetch latest profile
          setAuthor(profile);
          const d = new Date(res.ts);
          setDate(d.toDateString());
          setLoading(false);
          setUpdating(false);
        } else {
          setShowError(true);
          setUpdating(false);
        }
      };
      getPostData();
    }
  }, [
    ref,
    feedDAC.connector,
    dac,
    domain,
    feedDAC,
    file,
    getUserProfile,
    id,
    posts,
    client,
    userID,
    myFollowing,
  ]);

  //return first letter of display name
  const getLetter = () => {
    const name = displayName(author, ref.substring(8));
    return name.substring(0, 1);
  };

  //toggle pin of post
  const handlePin = async () => {
    if (postData.isPinned) {
      setPinStatus("unpinning");
    } else {
      setPinStatus("pinning");
    }
    let newPostData = postData;
    newPostData.isPinned = !newPostData.isPinned;
    const resolverJSON = {
      isPinned: newPostData.isPinned,
      blogBody: newPostData.content.text,
      title: newPostData.content.title,
      subtitle: newPostData.content.ext.subtitle,
      ts: newPostData.ts,
    };
    const res = await togglePinPost(
      fullRef,
      resolverJSON,
      postData.content.ext.postPath,
      mySky
    );
    setPinStatus(res.success ? "success" : "error");
    setPostData(newPostData);
  };

  return (
    <div className={"md:max-w-xl mx-auto px-4 sm:px-6 lg:max-w-3xl lg:px-8"}>
      {!showError ? (
        <>
          <h3 className={"text-5xl mt-4"}>
            {!isLoading ? (
              postData.content.title
            ) : (
              <Skeleton animation={"wave"} />
            )}
          </h3>
          <h5
            className={"text-3xl mt-1 text-palette-300"}
            variant={"h5"}
            color={"textSecondary"}
            gutterBottom={true}
          >
            {!isLoading ? (
              postData.content.ext.subtitle
            ) : (
              <Skeleton animation={"wave"} />
            )}
          </h5>

          <Link to={"/profile/" + ref}>
            {!isLoading ? (
              <div
                className={
                  userID === ref.substring(8)
                    ? "flex flex-col sm:flex-row justify-between my-3 md:items-center"
                    : "flex flex-row justify-between my-3 items-center"
                }
              >
                <div className={"flex flex-row"}>
                  <Avatar
                    aria-label={"Author"}
                    src={
                      author.avatar.length >= 1
                        ? `https://siasky.net${author.avatar[0].url.substring(
                            5
                          )}`
                        : null
                    }
                  >
                    {author.avatar.length === 0 ? getLetter() : null}
                  </Avatar>
                  <div className={"ml-4"}>
                    <p className={"text-sm mb-0"}>
                      {displayName(author, ref.substring(8))}
                    </p>
                    <p className={"text-sm text-palette-300"}>{date}</p>
                  </div>
                </div>
                {userID === ref.substring(8) &&
                postData.content.ext.postPath ? (
                  <PreviewMenu
                    post={postData}
                    feedDAC={feedDAC}
                    history={history}
                    handlePin={handlePin}
                    blogView={true}
                    deletingPost={deletingPost}
                    setDeletingPost={setDeletingPost}
                  />
                ) : (
                  <div>
                    {userID ? (
                      <button
                        onMouseDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
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
                            ref.substring(8)
                          );
                        }}
                        className="justify-center my-2 py-1 px-5 border border-transparent rounded-full shadow-sm text-sm font-medium text-palette-600 bg-primary hover:bg-primary-light transition-colors duration-200"
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </button>
                    ) : null}
                    <ShareButton />
                  </div>
                )}
              </div>
            ) : (
              <div className={"flex flex-row my-3"}>
                <Skeleton
                  variant={"circle"}
                  animation={"wave"}
                  height={50}
                  width={50}
                />
                <div className={"flex-grow ml-4"}>
                  <p>
                    <Skeleton />
                  </p>
                  <Skeleton />
                </div>
              </div>
            )}
          </Link>

          {!isLoading ? (
            <ReactMarkdown
              options={options}
              {...props}
              style={{ marginTop: 26 }}
            >
              {postData.content.text}
            </ReactMarkdown>
          ) : (
            <Skeleton height={window.innerHeight * 0.75} animation={"wave"} />
          )}
        </>
      ) : (
        <ErrorDisplay
          title={"This post could not be loaded."}
          subtitle={
            "It either does not exist or is the result of a bad connection."
          }
        />
      )}
      <PinningAlerts pinStatus={pinStatus} setPinStatus={setPinStatus} />
      <UpdatingIndicator isUpdating={isUpdating} setUpdating={setUpdating} />
      <FollowIndicator
        followStatus={followStatus}
        setFollowStatus={setFollowStatus}
      />
    </div>
  );
}
