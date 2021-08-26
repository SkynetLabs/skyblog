//domain for post route
const dataDomain =
  window.location.hostname === "localhost" ? "localhost" : "skynetblog.hns";

//dac domain
const dacDomain = "/feed-dac.hns/";

/**
 * postRoute() route to blog view page
 * @param {string} userID 'ed25519-' + user mySky id
 * @param {object} post feed dac post object
 * @param {hook} history react router history hook
 */
export const postRoute = (userID, post, history) => {
  const newRoute =
    "/" + userID + dacDomain + dataDomain + "/posts/page_0.json/" + post.id;
  history.push(newRoute);
};
