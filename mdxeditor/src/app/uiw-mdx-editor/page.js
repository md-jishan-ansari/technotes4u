"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";


import '@uiw/react-markdown-editor/markdown-editor.css';

import axios from 'axios';

const MDEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  { ssr: false }
);

// const EditerMarkdown = dynamic(
//   () =>
//     import("@uiw/react-markdown-editor").then((mod) => {
//       return mod.default.Markdown;
//     }),
//   { ssr: false }
// );


function HomePage() {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");

  const handleChange = (value) => {
    setValue(value);
  };

  useEffect(() => {
    setValue(localStorage.getItem('value') || "");
    setTitle(localStorage.getItem('title') || "");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title && value) {
      console.log(title, value);
      try {
        localStorage.setItem('title', title);
        localStorage.setItem('value', value);

        await axios.post('/api/create-mdx', { title, value });


      } catch (error) {
        console.error('Error creating file:', error);
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <MDEditor
          value={value}
          enablePreview={false}
          onChange={handleChange}
          style={{ width: "100%", height: "80vh" }}
        />
        <button className="btn border-t-neutral-50" type="submit">Submit</button>
      </form>
      {/* <EditerMarkdown source={value} /> */}
    </div>
  );
}

export default HomePage;
