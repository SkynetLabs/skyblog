/**
 * displayName() decides the string to display for the author
 * on a blog post or profile based on what values the author's
 * profile DAC has set.
 * @param {object} author UserProfile DAC profile object
 * @param {string} userID user's MySky ID
 * @return {string} string to display for the blog author
 */
export const displayName = (author, userID) => {
  if (author.firstName && author.lastName) {
    return author.firstName + " " + author.lastName;
  } else if (author.username) {
    return author.username;
  }

  return userID;
};
