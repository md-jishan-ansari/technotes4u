import { serialize } from 'next-mdx-remote/serialize';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

const codeOptions = {
  theme: 'github-dark',
};

export const renderMDX = async (content: string) => {
  return serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        () => (tree) => {
          visit(tree, (node) => {
            if (node?.type === "element" && node?.tagName === "pre") {
              const [codeEl] = node.children;

              if (codeEl.tagName !== "code") return;

              node.raw = codeEl.children?.[0].value;
            }
          });
        },
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'append' }],
        [rehypePrettyCode, codeOptions],
        () => (tree) => {
          visit(tree, (node) => {
            if (node?.type === "element" && node?.tagName === "figure") {
              if (!("data-rehype-pretty-code-figure" in node.properties)) {
                return;
              }

              for (const child of node.children) {
                if (child.tagName === "pre") {
                  child.properties["raw"] = node.raw;
                }
              }
            }
          });
        },
      ],
    },
  });
};