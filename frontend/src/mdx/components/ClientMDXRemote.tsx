'use client'

import { MDXRemote } from 'next-mdx-remote';
import MDXComponents from './MDXComponents';
import { useEffect } from 'react';

const ClientMDXRemote = ({ source }: { source: any }) => {

  useEffect(() => {
    // Get the hash from URL
    const hash = window.location.hash;
    if (hash) {
      // Add a small delay to ensure content is loaded
      setTimeout(() => {
        const element = document.querySelector(hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, []);

  return <MDXRemote {...source} components={MDXComponents} />;
}

export default ClientMDXRemote;
