export async function createBlogPost(title, subtitle, blogMD, feedDAC) {
  const postJSON = {
    title: title,
    text: blogMD,
    ext: {
      subtitle: subtitle,
    },
  };
  const res = await feedDAC.createPost(postJSON);
  console.log("RESPONSE: ", res);
  return res;
}

export async function loadBlogPost(ref, feedDAC) {
  const res = await feedDAC.loadPost(ref);
  console.log("RESPONSE LOAD: ", res);
  //console.log('PARSED: ', JSON.parse(res.content.text));
  return res;
}

export async function loadBlogProfile(userID, feedDAC) {
  const postsLoader = await feedDAC.loadPostsForUser(userID);
  return postsLoader;
}
