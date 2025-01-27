'use client'

import { MDXRemote } from 'next-mdx-remote';
import Pre from './Pre';
// import MDXComponents from './MDXComponents';

const ClientMDXRemote = ({ source }: { source: any }) => {

  const MDXComponents = {
    pre: Pre, // Use custom `CodeBlock` for syntax highlighting with a copy button
  };

  return <MDXRemote {...source} components={MDXComponents} />;
}

export default ClientMDXRemote;
