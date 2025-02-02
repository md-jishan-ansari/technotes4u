"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/componentsSadcn/ui/accordion";
import { IoIosArrowDown } from 'react-icons/io';
import { useEffect, useState } from 'react';
import Link from "next/link";

interface TOCItem {
  text: string;
  slug: string;
  level: number;
  child?: TOCItem[];
}

const TOC = ({ toc }: { toc: TOCItem[] }) => {
  const [activeHash, setActiveHash] = useState<string>('');
  // Initialize with all top-level section slugs that have children
  const [openSections, setOpenSections] = useState<string[]>(
    toc.filter(item => item.child && item.child.length > 0).map(item => item.slug)
  );

  const handleClick = (slug: string) => {
    setActiveHash(slug);
  };

  const handleSectionToggle = (slug: string) => {
    setOpenSections(prev =>
      prev.includes(slug)
        ? prev.filter(id => id !== slug)
        : [...prev, slug]
    );
  };

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash.slice(1));
    };

    handleHashChange(); // Initial check
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="w-full pr-2">
      <Accordion type="multiple" value={openSections}>
        {toc.map((item) => (
          <div key={item.slug}>
            {item.child && item.child.length > 0 ? (
              <AccordionItem value={item.slug}>
                <div className="flex items-center justify-between cursor-pointer">
                  <Link
                    href={`#${item.slug}`}
                    onClick={() => handleClick(item.slug)}
                    className={`flex items-center px-2 py-1 text-xs
                        ${activeHash === item.slug
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground'}
                        hover:text-link`}
                  >
                    {item.text}
                  </Link>
                  <AccordionTrigger
                    onClick={() => handleSectionToggle(item.slug)}
                    className="min-w-6"
                  >
                    <div className={`p-1 rounded-full transition-transform duration-200 ${openSections.includes(item.slug) ? "" : "-rotate-90"} hover:bg-gray-400 hover:bg-opacity-20`}>
                      <IoIosArrowDown className="text-neutral-500 dark:text-neutral-400" />
                    </div>
                  </AccordionTrigger>
                </div>
                <AccordionContent>
                  <div className="ml-4 my-1 border-l">
                    {item.child.map((childItem) => (
                      <div key={childItem.slug}>
                        <Link
                          href={`#${childItem.slug}`}
                          onClick={() => handleClick(childItem.slug)}
                          className={`flex items-center px-2 py-1 text-xs
                              ${activeHash === childItem.slug
                              ? 'text-primary font-medium'
                              : 'text-muted-foreground'}
                              hover:text-link`}
                        >
                          {childItem.text}
                        </Link>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ) : (
              <div className="">
                <Link
                  href={`#${item.slug}`}
                  onClick={() => handleClick(item.slug)}
                  className={`flex items-center px-2 py-1 text-xs
                      ${activeHash === item.slug
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground'}
                      hover:text-link`}
                >
                  {item.text}
                </Link>
              </div>
            )}
          </div>
        ))}
      </Accordion>
    </div>
  );
};

export default TOC;
