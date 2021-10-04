/**
 * postRoute() route to blog view page
 * @param {string} userID 'ed25519-' + user mySky id
 * @param {object} post feed dac post object
 * @param {hook} history react router history hook
 */
export const postRoute = (post, history) => {
  const newRoute = post.ref.replace("#", "/").substring(5);
  history.push(newRoute);
};

/**
 * postRoute() route to blog view page
 * @param {string} title title of the post to be edited
 * @param {string} subtitle subtitle of post to be edited
 * @param {string} blogBody body of post to be edited
 * @param {string} postPath path of dynamic json, used with mySky.setJSON()
 * @param {string} postRef feedDAC post reference
 * @param {boolean} isPinned boolean indicating if post is pinned or not
 * @param history react-router-dom useHistory instance
 */
export function editRoute(
  title,
  subtitle,
  blogBody,
  postPath,
  postRef,
  isPinned,
  history
) {
  history.push({
    pathname: "/create",
    state: {
      title: title,
      subtitle: subtitle,
      blogBody: blogBody,
      postPath: postPath,
      postRef: postRef,
      isPinned: isPinned,
    },
  });
}
