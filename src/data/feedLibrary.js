import { dataDomain } from "./consts";
import { insertLocalStorageFeed, editLocalStoragePost } from "./localStorage";
/**
 * createBlogPost() uses the feed DAC to publish a post in the correct format
 * @param {string} title Title string
 * @param {string} subtitle Subtitle string
 * @param {string} blogMD markdown string of blog body
 * @param {object} feedDAC feedDAC as initialized in SkynetContext
 * @param mySky mySky instance
 * @return {object} response object containing success key and ref key with blog
 * reference id
 */
export async function createBlogPost(title, subtitle, blogMD, feedDAC, mySky) {
  try {
    const { data } = await mySky.getJSON(`${dataDomain}/postPaths.json`);
    const postNum = data ? data.postNum + 1 : 1;
    await mySky.setJSON(`${dataDomain}/post${postNum}.json`, {
      title: title,
      subtitle: subtitle,
      blogBody: blogMD,
      ts: Date.now(),
    });
    const resp = await mySky.getEntryLink(`${dataDomain}/post${postNum}.json`);
    const postJSON = {
      title: title,
      text: blogMD,
      ext: {
        subtitle: subtitle,
        resolverSkylink: resp,
        postPath: `${dataDomain}/post${postNum}.json`,
      },
    };
    const res = await feedDAC.createPost(postJSON);
    if (res.success) {
      await mySky.setJSON(`${dataDomain}/postPaths.json`, { postNum: postNum });
      insertLocalStorageFeed(res.ref);
    }
    console.log("RESPONSE", res);
    return res;
  } catch (e) {
    console.log("ERROR: ", e);
    return { success: false };
  }
}

/**
 * editBlogPost() edit your blog post using the mySky registry
 * @param {string} title Title string
 * @param {string} subtitle Subtitle string
 * @param {string} blogMD markdown string of blog body
 * @param {boolean} isPinned whether the post is pinned or not
 * @param {string} postPath path of post JSON
 * @param {string} ref feedDAC post reference
 * @param mySky mySky instance
 * @return {object} response object containing success key and ref key with blog
 * reference id
 */
export async function editBlogPost(
  title,
  subtitle,
  blogMD,
  isPinned,
  postPath,
  ref,
  mySky
) {
  try {
    let postJSON = {
      title: title,
      subtitle: subtitle,
      blogBody: blogMD,
      ts: Date.now(),
      isPinned: isPinned,
    };
    await mySky.setJSON(postPath, postJSON);
    editLocalStoragePost(title, subtitle, blogMD, isPinned, Date.now(), ref);
    return { success: true, ref: ref };
  } catch (e) {
    console.log("ERROR", e);
    return { success: false };
  }
}

/**
 * togglePinPost() pin/unpin a blog post
 * @param {string} ref feedDAC post ref
 * @param {object} newJSON updated json to set at the post path
 * @param {string} postPath path for storing JSON
 * @param mySky mySky instance
 * @return {object} success or failure response
 */
export async function togglePinPost(ref, newJSON, postPath, mySky) {
  try {
    await mySky.setJSON(postPath, newJSON);
    editLocalStoragePost(
      newJSON.title,
      newJSON.subtitle,
      newJSON.blogBody,
      newJSON.isPinned,
      newJSON.ts,
      ref
    );
    return { success: true };
  } catch (e) {
    console.log("ERROR", e);
    return { success: false };
  }
}

/**
 * deleteBlogPost() deletes a feedDAC blog post
 * @param {string} postRef blog post id
 * @param feedDAC feedDAC as initialized in SkynetContext
 * @return {object} success or failure response
 */
export async function deleteBlogPost(postRef, feedDAC) {
  const res = await feedDAC.deletePost(postRef);
  if (res.success) {
    try {
      localStorage.removeItem(postRef);
      //remove post from myFeed local storage
      let myFeed = JSON.parse(localStorage.getItem("myFeed"));
      const i = myFeed.indexOf(postRef);
      if (i > -1) myFeed.splice(i, 1);
      localStorage.setItem("myFeed", JSON.stringify(myFeed));
    } catch (e) {
      console.log(e);
    }
  }
  return res;
}

/**
 * loadBlogPost() retrieves a post using the feedDAC
 * @param {string} ref blog post id
 * @param feedDAC feedDAC as initialized in SkynetContext
 * @param client skynet client from SkynetContext
 * @param {boolean} getFirstImage tells whether or not to add a previewImage key to returned object
 * @param {boolean} featured indicates whether post is featured on home page
 * @return {object} post object data in SkyStandards format
 */
export async function loadBlogPost(
  ref,
  feedDAC,
  client,
  getFirstImage = false,
  featured = false
) {
  let res = await feedDAC.loadPost(ref);
  res.ref = ref;
  if (res.isDeleted) {
    return false;
  } else if (res.content.ext.resolverSkylink) {
    res = await getLatest(res, client, getFirstImage, featured);
  }
  return res;
}

/**
 * loadBlogProfile() retrieves the postLoader for a specific users blog
 * post feed
 * @param {string} userID user's MySky ID
 * @param feedDAC feedDAC as initialized in SkynetContext
 * @param client skynet client instance
 * @return {function} asyncGenerator function to load pages
 */
export async function loadBlogProfile(userID, feedDAC, client) {
  const hostDomain = await client.extractDomain(window.location.hostname);
  const postsLoader = await feedDAC.loadPostsForUser(
    userID,
    hostDomain !== dataDomain ? [dataDomain, hostDomain] : [dataDomain]
  );
  return postsLoader;
}

/**
 * getLatest() use resolver link to return latest version of given post
 * @param {postObject} post a blogPost object
 * @param client skynet client instance
 * @param {boolean} getFirstImage tells whether or not to add a previewImage key to returned object
 * @param {boolean} featured indicates whether post is featured on home page
 * @return {object} blogPost object
 */
export async function getLatest(
  post,
  client,
  getFirstImage = false,
  featured = false
) {
  try {
    let updatedPost = post;
    const skylink = post.content.ext.resolverSkylink;
    const { data } = await client.getFileContent(skylink.substring(6));
    updatedPost.content.title = data._data.title;
    updatedPost.content.ext.subtitle = data._data.subtitle;
    updatedPost.content.text = data._data.blogBody;
    updatedPost.ts = data._data.ts;
    updatedPost.isPinned = featured ? true : data._data.isPinned;
    if (getFirstImage) {
      updatedPost.content.previewImage = getPreviewImage(data._data.blogBody);
    }
    return updatedPost;
  } catch (e) {
    console.log("ERROR", e);
    return post;
  }
}

/**
 * getPreviewImage() help function to get the url for the first image present in post body
 * @param {string} blogText blog post body
 * @return {string} url of first image present in blog body
 */
export const getPreviewImage = (blogText) => {
  const startIndex = blogText.indexOf("![](https://");
  if (startIndex === -1) {
    return null;
  }
  const endIndex = blogText.indexOf(")", startIndex);
  const imageLink = blogText.substring(startIndex + 4, endIndex);
  return imageLink;
};
