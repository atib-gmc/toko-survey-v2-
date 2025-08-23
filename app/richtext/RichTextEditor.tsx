"use client";
import dynamic from "next/dynamic";
import React, { useState, useRef, useMemo, useEffect } from "react";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
type props = {
  value: string;
  onchange: (value: string) => void;
};

export default function RichTextEditor({ value, onchange }: props) {
  const editor = useRef(null);
  //   const [content, setContent] = useState("");

  const config = useMemo(
    () => ({
      removeButtons: [
        "image",
        "audio",
        "video",
        "paint",
        "file",
        // "link",
        "source",
        "print",
        "save",
        "speechRecognize",
        "sound",
        "microphone",
      ],
    }),
    []
  );

  return (
    <div>
      <JoditEditor
        className="reset"
        config={config}
        ref={editor}
        value={value}
        onChange={(newContent) => {
          onchange(newContent);
        }}
      />
      {/* <div
        className="prose reset prose-lg dark:prose-invert list-decimal list-inside"
        dangerouslySetInnerHTML={{ __html: value }}
      ></div> */}
      {/* {JSON.stringify(content)} */}
    </div>
  );
}
