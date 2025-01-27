"use client";

import { useState } from "react";

export const CopyButton = ({ text }: any) => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <button disabled={isCopied} onClick={copy}>
      {isCopied ? "Copied!" : "Copy"}
    </button>
  );
};
