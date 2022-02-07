import { getPreviewImage } from "./feedLibrary";
import { localStorageFeedKey, localStorageUserListKey } from "./consts";
import union from "lodash/union";
/**
 * setLocalStorage() set key value pair in localstorage
 * @param {string} key to set in localStorage
 * @param {object} value value to set in localStorage
 */
export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * getLocalStorage() get key value from localStorage
 * @param {string} key to retrieve in localStorage
 * @return {object} localStorage value for given key
 */
export const getLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

/**
 * removeLocalStorage() remove key value pair in localstorage
 * @param {string} key to clear in localStorage
 */
const removeLocalStorage = (key) => {
  localStorage.removeItem(key);
};

/**
 * getLocalStorageFeed() get the locally stored feed
 * @return {object} array of post objects
 */
export const getLocalStorageFeed = () => {
  const localFeed = getLocalStorage(localStorageFeedKey);
  let pinStatus = false;
  if (!localFeed) {
    return null;
  }
  let dataFeed = [];
  localFeed.forEach((item) => {
    const localPost = getLocalStorage(item);
    if (localPost.isPinned) pinStatus = true;
    dataFeed.push(localPost);
  });
  return { feed: dataFeed, pinStatus: pinStatus };
};

/**
 * setLocalStorageFeed() persists the given array to localStorage at localStorageFeedKey
 * @param {array} localFeed array of post reference ID strings
 */
export const setLocalStorageFeed = (localFeed) => {
  setLocalStorage(localStorageFeedKey, localFeed);
};

/**
 * insertLocalStorageFeed() updates the local storage feed item when post created
 * @param {string} ref post reference id to be added to local storage
 */
export const insertLocalStorageFeed = (ref) => {
  let currentLocalFeed = getLocalStorage(localStorageFeedKey);
  if (currentLocalFeed) {
    currentLocalFeed.unshift(ref);
  } else {
    currentLocalFeed = [ref];
  }
  setLocalStorageFeed(currentLocalFeed);
};

/**
 * clearLocalStorageFeed() updates the local storage feed with item when post created
 */
export const clearLocalStorageFeed = () => {
  removeLocalStorage(localStorageFeedKey);
};

/**
 * getLocalStoragePost() get a post from local storage
 * @param {string} ref post reference id to retrieve
 * @return {object} post from local storage
 */
export const getLocalStoragePost = (ref) => {
  return getLocalStorage(ref);
};

/**
 * setLocalStoragePost() persist a post's data to local storage
 * @param {string} ref post reference id
 * @param {object} postJSON post data
 */
export const setLocalStoragePost = (ref, postJSON) => {
  let storageJSON = {
    ts: postJSON.ts,
    isPinned: postJSON.isPinned,
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
  setLocalStorage(ref, storageJSON);
};

/**
 * editLocalStoragePost() add a post's data to local storage
 * @param {object} postEdits object containing updated fields
 * @param {object} postData object containing original post data
 * @param {string} ref post reference id
 */
export const editLocalStoragePost = (postEdits, postData, ref) => {
  let updatedPost = postData;
  console.log("POST DATA", postData);
  updatedPost.ts = postEdits.ts;
  updatedPost.isPinned = postEdits.isPinned;
  updatedPost.content.title = postEdits.title;
  updatedPost.content.text = postEdits.blogBody;
  updatedPost.content.ext.subtitle = postEdits.subtitle;
  updatedPost.content.previewImage = getPreviewImage(postEdits.blogBody);
  setLocalStorage(ref, updatedPost);
};

/**
 * deleteLocalStoragePost() remove post from local storage
 * @param {string} ref post reference id to remove
 */
export const deleteLocalStoragePost = (ref) => {
  removeLocalStorage(ref);
  let localFeed = getLocalStorage(localStorageFeedKey);
  if (localFeed) {
    const i = localFeed.indexOf(ref);
    if (i > -1) localFeed.splice(i, 1);
    setLocalStorage(localStorageFeedKey, localFeed);
  }
};

/**
 * getLocalStorageProfile() get a profile from local storage
 * @param {string} userID a user's mySky ID
 * @return {object} profile in UserProfileDAC format
 */
export const getLocalStorageProfile = (userID) => {
  return getLocalStorage(userID);
};

/**
 * setLocalStorageProfile() persist a UserProfileDAC object to localStorage
 * @param {string} userID a user's mySky ID
 * @param {object} profile profile as returned from UserProfileDAC
 */
export const setLocalStorageProfile = (userID, profile) => {
  setLocalStorage(userID, profile);
};

/**
 * updateLocalStorageUserList() persist array of userID to local storage
 * @param {array} userList list of users to add to local storage list
 */
export const updateLocalStorageUserList = (userList) => {
  const currentList = getLocalStorage(localStorageUserListKey);
  const newList = union(userList, currentList);
  setLocalStorage(localStorageUserListKey, newList);
};

/**
 * getLocalStorageUserProfileList() return list of user profile objects persisted in storage
 * @return {array} array of user profile objects
 */
export const getLocalStorageUserProfileList = () => {
  const userList = getLocalStorage(localStorageUserListKey);
  let profileList = [];
  if (!userList) {
    return [];
  }
  userList.forEach((item) => {
    let localProfile = getLocalStorageProfile(item);
    localProfile.userID = item;
    if (localProfile) profileList.push(localProfile);
  });
  return profileList;
};
