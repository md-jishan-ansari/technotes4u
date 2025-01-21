"use client";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
const CodeHeighlighter = ({language, code}) => {

  return (
    <SyntaxHighlighter language={`${language}`} style={docco}>
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeHeighlighter;