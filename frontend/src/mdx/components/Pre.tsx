"use client";

import { CopyButton } from "./CopyButton";

interface PreProps {
  children: React.ReactNode;
  raw?: string;
  'data-language'?: string;
}

const Pre = ({ children, raw, ...props }: PreProps) => {
  const lang = props["data-language"] || "shell";

  return (
    <pre {...props} className={"p-4 max-w-full overflow-x-auto"}>
      <div className={"code-header"}>
        {lang}
        <CopyButton text={raw} />
      </div>
      {children}
    </pre>
  );
};

export default Pre;
