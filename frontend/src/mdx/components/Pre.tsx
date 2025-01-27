"use client";

import { CopyButton } from "./CopyButton";

interface PreProps {
  children: React.ReactNode;
  raw?: string;
  'data-language'?: string;
}

const Pre = ({ children, raw, ...props }: PreProps) => {
  const lang = props["data-language"] || "shell";

  console.log({children})
  console.log({raw})

  return (
    <pre {...props} className={"p-4"}>
      <div className={"code-header"}>
        {lang}
        <CopyButton text={raw} />
      </div>
      {children}
    </pre>
  );
};

export default Pre;
