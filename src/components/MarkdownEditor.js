import React, { useState } from "react";

import MDEditor from "@uiw/react-md-editor";

export default function MarkdownEditor(props) {
  //states to track store the blog text
  const [blogBody, setBlogBody] = useState();

  const handleEditorChange = (e) => {
    setBlogBody(e);
    props.setBlogMD(e);
    console.log("CHANGE: ", e);
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <MDEditor
        ref={props.mdEditor}
        value={blogBody}
        height={window.innerHeight / 2}
        textareaProps={{ placeholder: "Tell your story..." }}
        onChange={handleEditorChange}
      />
    </div>
  );
}
