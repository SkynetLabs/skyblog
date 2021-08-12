import React, { useState, useRef } from "react";

import MDEditor, {
  commands,
  ICommand,
  TextState,
  TextApi,
} from "@uiw/react-md-editor";

export default function MarkdownEditor(props) {
  //states to track store the blog text
  const [blogBody, setBlogBody] = useState("");
  const inputImage = useRef(null);
  const imageFormRef = useRef(null);
  const [imageVars, setImageVars] = useState(null);

  const handleEditorChange = (e) => {
    setBlogBody(e);
    props.setBlogMD(e);
    console.log("CHANGE: ", e);
    const jStr = JSON.stringify(e);
    console.log("Change with json stringify", jStr);
    console.log("JSON parse", JSON.parse(jStr));
  };
  const image = {
    name: "image",
    keyCommand: "image",
    shortcuts: "ctrlcmd+i",
    buttonProps: { "aria-label": "Add image", title: "Add image" },
    icon: (
      <svg width="12" height="12" viewBox="0 0 20 20">
        <path
          fill="currentColor"
          d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
        />
      </svg>
    ),
    execute: (state: TextState, api: TextAreaTextApi) => {
      setImageVars(api);
      inputImage.current.click();
      console.log("IMAGE CLICK");
    },
  };
  const handleImageSelect = async (event) => {
    const api = imageVars;
    console.log("RAW FILE: ", event.target.files[0]);
    let modifyText = `![](${URL.createObjectURL(event.target.files[0])})\n`;
    api.replaceSelection(modifyText);
    try {
    } catch (e) {
      console.log(e);
    }
    imageFormRef.current.reset();
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <MDEditor
        ref={props.mdEditor}
        value={blogBody}
        commands={[
          commands.bold,
          commands.italic,
          commands.strikethrough,
          commands.hr,
          commands.title,
          commands.link,
          commands.quote,
          commands.code,
          image,
          commands.unorderedListCommand,
          commands.orderedListCommand,
          commands.checkedListCommand,
        ]}
        height={window.innerHeight / 2}
        textareaProps={{ placeholder: "Tell your story..." }}
        onChange={handleEditorChange}
      />
      <form ref={imageFormRef}>
        <input
          type={"file"}
          accept={".png,.jpg,.jpeg"}
          id={"file"}
          onChange={handleImageSelect}
          ref={inputImage}
          style={{ display: "none" }}
        />
      </form>
    </div>
  );
}
