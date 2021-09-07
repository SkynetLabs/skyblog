import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import { useHistory } from "react-router-dom";

//EditButton component is component to route to the edit post page
export default function EditButton(props) {
  /*
    props -> blogPost data
    history -> react router hook
     */
  const { title, subtitle, blogBody, postPath, postRef } = props;
  const history = useHistory();

  //handle edit button click, route to post editor
  const handleClick = (event) => {
    event.stopPropagation();
    history.push({
      pathname: "/create",
      state: {
        title: title,
        subtitle: subtitle,
        blogBody: blogBody,
        postPath: postPath,
        postRef: postRef,
      },
    });
  };

  return (
    <IconButton
      onMouseDown={(event) => event.stopPropagation()}
      onClick={handleClick}
      aria-label="edit"
    >
      <EditIcon />
    </IconButton>
  );
}
