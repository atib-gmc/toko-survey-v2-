"use client";
import dynamic from "next/dynamic";
import React, { useState, useRef, useMemo, useEffect } from "react";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
const preflightReset: React.CSSProperties = {
  boxSizing: "border-box",
  borderWidth: 0,
  borderStyle: "solid",
  lineHeight: 1.5,
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  margin: 0,
  padding: 0,
  color: "inherit",
  fontSize: "100%",
  fontWeight: "inherit",
  textDecoration: "inherit",
  verticalAlign: "middle",
  display: "block",
  maxWidth: "100%",
  height: "auto",
};

export default function RichText() {
  const editor = useRef(null);
  const [content, setContent] = useState("");

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
    <div
    // style={preflightReset}
    >
      <JoditEditor
        className="reset"
        config={config}
        ref={editor}
        value={content}
        onChange={(newContent) => setContent(newContent)}
      />
      <div
        className="prose reset"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
      {/* {JSON.stringify(content)} */}
    </div>
  );
}
