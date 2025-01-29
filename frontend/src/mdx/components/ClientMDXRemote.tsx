'use client'

import { MDXRemote } from 'next-mdx-remote';
import MDXComponents from './MDXComponents';

const ClientMDXRemote = ({ source }: { source: any }) => {

  return <MDXRemote {...source} components={MDXComponents} />;
}

export default ClientMDXRemote;
