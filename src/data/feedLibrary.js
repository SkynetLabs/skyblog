/**
 * createBlogPost() uses the feed DAC to publish a post in the correct format
 * @param {string} title Title string
 * @param {string} subtitle Subtitle string
 * @param {string} blogMD markdown string of blog body
 * @param {object} feedDAC feedDAC as initialized in SkynetContext
 * @return {object} response object containing success key and ref key with blog
 * reference id
 */
export async function createBlogPost(title, subtitle, blogMD, feedDAC) {
  const postJSON = {
    title: title,
    text: blogMD,
    ext: {
      subtitle: subtitle,
    },
  };
  const res = await feedDAC.createPost(postJSON);
  return res;
}

/**
 * loadBlogPost() retrieves a post using the feedDAC
 * @param {string} ref blog post id
 * @param {object} feedDAC feedDAC as initialized in SkynetContext
 * @return {object} post object data in SkyStandards format
 */
export async function loadBlogPost(ref, feedDAC) {
  const res = await feedDAC.loadPost(ref);
  console.log("RESPONSE LOAD: ", res);
  //console.log('PARSED: ', JSON.parse(res.content.text));
  return res;
}

/**
 * loadBlogProfile() retrieves the postLoader for a specific users blog
 * post feed
 * @param {string} useID user's MySky ID
 * @param {object} feedDAC feedDAC as initialized in SkynetContext
 * @return {object} post object data in SkyStandards format
 */
export async function loadBlogProfile(userID, feedDAC) {
  const blogSkapps = ["skynetblog.hns"]; //skapps paths to load posts from
  const postsLoader = await feedDAC.loadPostsForUser(userID, blogSkapps);
  return postsLoader;
}
