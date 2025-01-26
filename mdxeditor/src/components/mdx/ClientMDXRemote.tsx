'use client'

import { MDXRemote } from 'next-mdx-remote';
import { MDXComponents } from './MDXComponents';

export default function ClientMDXRemote({ source }: { source: any }) {
  return <MDXRemote {...source} components={MDXComponents} />;
}
