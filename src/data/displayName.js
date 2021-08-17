export const displayName = (author, userID) => {
  if (
    author.firstName != null &&
    author.firstName != "" &&
    author.lastName != null &&
    author.lastName != ""
  ) {
    return author.firstName + " " + author.lastName;
  } else if (author.username != null && author.username != "") {
    return author.username;
  } else {
    return userID.substring(8);
  }
};
