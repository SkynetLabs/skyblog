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
