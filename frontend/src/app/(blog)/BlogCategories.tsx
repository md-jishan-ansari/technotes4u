import { memo, useCallback } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { Pencil } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/src/componentsSadcn/ui/accordion"
import { Category, IconImage } from '@/src/types/types';

interface BlogCategoriesProps {
    categories: Category[];
    activeSlug: string | null;
    openCategories: string[];
    setOpenCategories: (categories: string[]) => void;
    topLevel?: boolean;
}

const CategoryIcon = memo(({ iconImage }: { iconImage: IconImage }) => (
    <div className="w-[20px] flex items-center justify-center">
        <Image src={iconImage.url} alt="icon" width={20} height={20} className="dark:hidden" />
        <Image
            src={iconImage.darkUrl || iconImage.url}
            alt="icon"
            width={20}
            height={20}
            className="hidden dark:block"
        />
    </div>
));

const EditButton = memo(({ isActiveBlog, categoryId }: { isActiveBlog: boolean, categoryId: string }) => (
    <Link
        target="_blank"
        href={`/admin/write/category/?blogid=${categoryId}`}
        className={`p-1 rounded-full ml-auto mr-2 ${
            isActiveBlog ? "hover:bg-blue-600 hover:bg-opacity-20" : "hover:bg-gray-400 hover:bg-opacity-20"
        }`}
    >
        <Pencil className={`${isActiveBlog ? "text-link" : "text-neutral-500 dark:text-neutral-400"} w-3 h-3`} />
    </Link>
));


const BlogCategories: React.FC<BlogCategoriesProps> = ({
    categories,
    activeSlug,
    openCategories,
    setOpenCategories,
    topLevel = false
}) => {

    const router = useRouter();

    const handleCategoryClick = useCallback((categoryId: string) => {
        setOpenCategories(
            openCategories.includes(categoryId)
                ? openCategories.filter(id => id !== categoryId)
                : [...openCategories, categoryId]
        );
    }, [setOpenCategories, openCategories]);

    const handleCategoryLinkClick = useCallback((e: React.MouseEvent, categoryId: string, url: string) => {
        const target = e.target as HTMLElement;
        if (target.closest('a[href^="/admin/write/category"]')) {
            e.stopPropagation();
            return;
        }

        const accordionTrigger = target.closest('.accordion-trigger');
        if (!accordionTrigger) {
            setOpenCategories(openCategories.includes(categoryId) ? openCategories: [...openCategories, categoryId])
            router.push(url);
        }
    }, [router, setOpenCategories, openCategories]);

    return (
        categories.map((category: any) => {
            const isActiveBlog = category.slug === activeSlug;

            return (
                <div key={category.id}>
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        defaultValue=""
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
                                    {category.iconImage && <CategoryIcon iconImage={category.iconImage} />}
                                    <p className={isActiveBlog ? "text-link font-medium" : ""}>
                                        {category.name}
                                    </p>
                                </div>

                                <EditButton isActiveBlog={isActiveBlog} categoryId={category.id} />

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

export default memo(BlogCategories, (prevProps, nextProps) => {
    return (
        prevProps.activeSlug === nextProps.activeSlug &&
        prevProps.categories === nextProps.categories &&
        prevProps.openCategories === nextProps.openCategories &&
        prevProps.topLevel === nextProps.topLevel
    );
});