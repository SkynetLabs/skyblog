import React, { useState, useRef, useContext } from "react";

import MDEditor, { commands, TextState } from "@uiw/react-md-editor";
import { SkynetContext } from "../state/SkynetContext";

//MarkdownEditor component to handle blog body creation and formatting
export default function MarkdownEditor(props) {
  const [blogBody, setBlogBody] = useState(""); //state for value of markdown editor
  const inputImage = useRef(null); //file input ref
  const imageFormRef = useRef(null); //form ref for file input
  const [imageVars, setImageVars] = useState(null); //state to store image variables for skylink replacement handling
  const { client } = useContext(SkynetContext); //client used from Skynet Context

  //handle change of markdown editor, set blogBody in parent component
  const handleEditorChange = (e) => {
    setBlogBody(e);
    props.setBlogMD(e);
  };

  //command to execute for click on insert image button
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
      setImageVars({ state: state, api: api }); //store current states of editor
      inputImage.current.click(); //focus the file input
    },
  };
  //handle the selection of a local image, upload image to Skynet and replace url
  const handleImageSelect = async (event) => {
    const { state, api } = imageVars;
    let modifyText = `![](${URL.createObjectURL(event.target.files[0])})`;
    api.replaceSelection(modifyText); //insert local file path into editor
    //upload to skynet
    try {
      const { skylink } = await client.uploadFile(event.target.files[0]);
      const newRange = {
        start: state.selection.start,
        end: state.selection.start + modifyText.length,
      };
      const skyLinkText = `![](https://siasky.net/${skylink.substring(6)})\n`;
      api.setSelectionRange(newRange);
      api.replaceSelection(skyLinkText); //replace local path with the skylink url
    } catch (e) {
      console.log(e);
    }
    imageFormRef.current.reset(); //clear form
  };

  //JSX components to render
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
