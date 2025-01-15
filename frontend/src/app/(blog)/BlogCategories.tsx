import Link from 'next/link';
import React, { useMemo, useState } from 'react'
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/src/sadcnComponents/ui/accordion"
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

const BlogCategories = ({ categories, activeSlug, topLevel=false }: any) => {
    const [openCategories, setOpenCategories] = useState<string[]>([]);
    const router = useRouter();

    const activeParentMap = useMemo(() => {
        const parentMap = new Set<string>();

        const buildParentMap = (cats: any[], parentIds: string[] = []) => {
            cats.forEach(cat => {
                if (cat.slug === activeSlug) {
                    parentIds.forEach(id => parentMap.add(id));
                }
                if (cat.children.length) {
                    buildParentMap(cat.children, [...parentIds, cat.id]);
                }
            });
        };

        buildParentMap(categories);
        return parentMap;
    }, [categories, activeSlug]);

    const handleCategoryClick = (categoryId: string) => {

        setOpenCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleCategoryLinkClick = (e, categoryId: string, url: string) => {
        const target = e.target as HTMLElement;
        const accordionTrigger = target.closest('.accordion-trigger');
        if (!accordionTrigger) {
            setOpenCategories(prev =>
                prev.includes(categoryId)
                ? prev
                : [...prev, categoryId]
            );
            router.push(url);
        }
    };

    return (
        categories.map((category: any) => {
            const isActiveBlog = category.slug === activeSlug;
            const isActive = isActiveBlog || activeParentMap.has(category.id);

            return (
                <div key={category.id}>
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        defaultValue={isActive ? category.id : undefined}
                        value={openCategories.includes(category.id) ? category.id : ''}
                        onValueChange={(value) => handleCategoryClick(category.id)}
                    >
                        <AccordionItem value={category.id}>
                            <div
                                className={`flex items-center justify-between
                                cursor-pointer
                                px-2 py-[0.4rem] rounded-md
                                my-0.5
                                ${topLevel ?
                                    "" :
                                    "rounded-l-none pl-3 border-l hover:border-muted-foreground -translate-x-[1px]"
                                }
                                text-sm
                                text-muted-foreground hover:text-secondary-foreground
                                ${isActiveBlog ? "hover:bg-blue-100" : "hover:bg-accent"}
                                `}
                                onClick={(e) => handleCategoryLinkClick(e, category.id, `/blog/${category.slug}`)}
                            >
                                <div className="flex items-center gap-2">
                                    {topLevel && (
                                        <div className="w-[24px]">
                                         <i className="devicon-mongodb-plain"></i>
                                        </div>
                                    )}

                                    <p className={isActiveBlog ? "text-blue-600 font-medium" : ""} >
                                        {category.name}
                                    </p>
                                </div>

                                <AccordionTrigger>
                                    {category.children.length > 0 && (
                                        <div className={
                                            `p-1 rounded-full  transition-transform duration-200
                                            ${openCategories.includes(category.id) ? "" : "-rotate-90"}
                                            ${isActiveBlog ? "hover:bg-blue-200" : "hover:bg-gray-200"}
                                        `}>
                                            <IoIosArrowDown className={`${isActiveBlog ? "text-blue-600" : "text-neutral-500 dark:text-neutral-400"}`} />
                                        </div>
                                    )}
                                </AccordionTrigger>
                            </div>
                            {category.children.length > 0 && (
                                <AccordionContent>
                                    <div className="ml-4 my-1 border-l">
                                        <BlogCategories
                                            categories={category.children}
                                            activeSlug={activeSlug}
                                        />
                                    </div>
                                </AccordionContent>
                            )}
                        </AccordionItem>
                    </Accordion>
                </div>
            )
        })
    )
}

export default BlogCategories