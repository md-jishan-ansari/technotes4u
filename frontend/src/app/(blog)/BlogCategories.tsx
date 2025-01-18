
import { IoIosArrowDown } from 'react-icons/io';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/src/componentsSadcn/ui/accordion"
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const BlogCategories = ({ categories, activeSlug, openCategories, setOpenCategories, topLevel=false }: any) => {

    const router = useRouter();

    const handleCategoryClick = (categoryId: string) => {
        setOpenCategories((prev: any) =>
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

            return (
                <div key={category.id}>
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        defaultValue={""}
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
                                ${isActiveBlog ? "hover:bg-blue-400 hover:bg-opacity-15" : "hover:bg-secondary"}
                                `}
                                onClick={(e) => handleCategoryLinkClick(e, category.id, `/blog/${category.slug}`)}
                            >
                                <div className="flex items-center gap-2">
                                    {category.iconImage && (
                                        <div className="w-[20px] flex items-center justify-center">

                                            <Image src={category.iconImage.url} alt="icon" width={20} height={20} className="dark:hidden" />

                                            <Image src={category.iconImage.darkUrl ? category.iconImage.darkUrl : category.iconImage.url} alt="icon" width={20} height={20} className="hidden dark:block" />

                                        </div>
                                    )}

                                    <p className={isActiveBlog ? "text-link font-medium" : ""} >
                                        {category.name}
                                    </p>
                                </div>

                                <AccordionTrigger>
                                    {category.children.length > 0 && (
                                        <div className={
                                            `p-1 rounded-full  transition-transform duration-200
                                            ${openCategories.includes(category.id) ? "" : "-rotate-90"}
                                            ${isActiveBlog ? "hover:bg-blue-600 hover:bg-opacity-20" : "hover:bg-gray-400 hover:bg-opacity-20"}
                                        `}>
                                            <IoIosArrowDown className={`${isActiveBlog ? "text-link" : "text-neutral-500 dark:text-neutral-400"}`} />
                                        </div>
                                    )}
                                </AccordionTrigger>
                            </div>
                            {category.children.length > 0 && (
                                <AccordionContent>
                                    <div className="ml-4 my-1 border-l ">
                                        <BlogCategories
                                            categories={category.children}
                                            activeSlug={activeSlug}
                                            openCategories={openCategories}
                                            setOpenCategories={setOpenCategories}
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