import { CopyButton } from "./CopyButton";

const Pre = ({ children, raw, ...props }: any) => {
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
