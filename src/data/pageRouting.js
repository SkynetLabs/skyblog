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
