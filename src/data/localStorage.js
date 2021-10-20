import { getPreviewImage } from "./feedLibrary";
import { localStorageFeedKey } from "./consts";
/**
 * getLocalStorageFeed() get the locally stored feed
 * @return {array} array of post objects
 */
export const getLocalStorageFeed = () => {
  const localFeed = JSON.parse(localStorage.getItem(localStorageFeedKey));
  if (localFeed) {
    let dataFeed = [];
    localFeed.forEach((item) => {
      const localPost = JSON.parse(localStorage.getItem(item));
      dataFeed.push(localPost);
    });
    return dataFeed;
  }
  return null;
};

/**
 * setLocalStorageFeed() persists the given array to localStorage at localStorageFeedKey
 * @param {array} localFeed array of post ref strings
 */
export const setLocalStorageFeed = (localFeed) => {
  localStorage.setItem(localStorageFeedKey, JSON.stringify(localFeed));
};

/**
 * insertLocalStorageFeed() updates the local storage feed item when post created
 * @param {string} ref post ref to be added to local storage
 */
export const insertLocalStorageFeed = (ref) => {
  let currentLocalFeed = JSON.parse(localStorage.getItem(localStorageFeedKey));
  if (currentLocalFeed) {
    currentLocalFeed.unshift(ref);
  } else {
    currentLocalFeed = [ref];
  }
  localStorage.setItem(localStorageFeedKey, JSON.stringify(currentLocalFeed));
};

/**
 * clearLocalStorageFeed() updates the local storage feed with item when post created
 */
export const clearLocalStorageFeed = () => {
  localStorage.setItem(localStorageFeedKey, null);
};

/**
 * getLocalStoragePost() get a post from local storage
 * @param {string} ref post ref to retrieve
 * @return {object} post from local storage
 */
export const getLocalStoragePost = (ref) => {
  const localPost = JSON.parse(localStorage.getItem(ref));
  return localPost;
};

/**
 * setLocalStoragePost() persist a post's data to local storage
 * @param {string} ref post ref
 * @param {object} postJSON post data
 */
export const setLocalStoragePost = (ref, postJSON) => {
  let storageJSON = {
    ts: postJSON.ts,
    isPinned: false,
    ref: ref,
    content: {
      title: postJSON.content.title,
      text: postJSON.content.text,
      previewImage: getPreviewImage(postJSON.content.text),
      ext: {
        subtitle: postJSON.content.ext.subtitle,
        resolverSkylink: postJSON.content.ext.resolverSkylink,
        postPath: postJSON.content.ext.postPath,
      },
    },
  };
  localStorage.setItem(ref, JSON.stringify(storageJSON));
};

/**
 * editLocalStoragePost() add a post's data to local storage
 * @param {string} title updated title
 * @param {string} subtitle updated subtitle
 * @param {string} blogMD updated blog body
 * @param {boolean} isPinned updated pinned val
 * @param {string} ts updated timestamp
 * @param {string} ref post ref
 */
export const editLocalStoragePost = (
  title,
  subtitle,
  blogMD,
  isPinned,
  ts,
  ref
) => {
  let postJSON = JSON.parse(localStorage.getItem(ref));
  postJSON.ts = ts;
  postJSON.isPinned = isPinned;
  postJSON.content.title = title;
  postJSON.content.text = blogMD;
  postJSON.content.ext.subtitle = subtitle;
  postJSON.content.previewImage = getPreviewImage(blogMD);
  localStorage.setItem(ref, JSON.stringify(postJSON));
};

/**
 * getLocalStorageProfile() get a profile from local storage
 * @param {string} userID a user's mySky ID
 * @return {object} profile in UserProfileDAC format
 */
export const getLocalStorageProfile = (userID) => {
  const localProfile = JSON.parse(localStorage.getItem(userID));
  return localProfile;
};

/**
 * setLocalStorageProfile() persist a UserProfileDAC object to localStorage
 * @param {string} userID a user's mySky ID
 * @param {object} profile profile as returned from UserProfileDAC
 */
export const setLocalStorageProfile = (userID, profile) => {
  localStorage.setItem(userID, JSON.stringify(profile));
};
