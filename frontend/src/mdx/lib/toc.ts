import GithubSlugger from 'github-slugger';

export interface TOCItem {
  text: string;
  slug: string;
  level: number;
  child?: TOCItem[];
}

export const generateTOC = (content: string): TOCItem[] => {
  const slugger = new GithubSlugger();
  const regexp = /\n(?<flag>#{1,6})\s+(?<content>.+)/g;
  const headings = Array.from(content.matchAll(regexp));

  const finalHeadings: TOCItem[] = [];

  headings.forEach(({ groups }) => {
    const { flag, content } = groups!;
    const level = flag.length;

    if (level <= 2) {
      finalHeadings.push({
        text: content,
        slug: slugger.slug(content),
        level,
        child: [],
      });
    } else {
      const lastIndex = finalHeadings.length - 1;
      if (finalHeadings[lastIndex]) {
        finalHeadings[lastIndex].child?.push({
          text: content,
          slug: slugger.slug(content),
          level,
        });
      }
    }
  });

  return finalHeadings;
};
