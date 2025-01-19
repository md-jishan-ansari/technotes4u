import prisma from "../db/db.config.js";
import CatchAsync from "../utils/CatchAsync.js";
import jwt from 'jsonwebtoken';

export const resetBlogSortOrders = CatchAsync(async () => {

        // Get all blogs ordered by current sortOrder
        const blogs = await prisma.blog.findMany({
            orderBy: {
                sortOrder: 'asc'
            }
        });

        // Update each blog with new sortOrder values
        const updates = blogs.map((blog, index) => {
            const newSortOrder = (index + 1) * 10000;
            return prisma.blog.update({
                where: { id: blog.id },
                data: { sortOrder: newSortOrder }
            });
        });

        await prisma.$transaction(updates);

        return true;
});

const getAvailableSortOrder = CatchAsync(async (req, res, next) => {

    let predecessorid = req.predecessorid;
    let predecessorblog;

    if (!predecessorid) {
        predecessorblog = await prisma.blog.findFirst({
            orderBy: {
                sortOrder: 'desc'
            }
        });

        return predecessorblog.sortOrder + 10000;
    }


    predecessorblog = await prisma.blog.findFirst({
        where: {
            id: predecessorid
        }
    });

    let successorblog = await prisma.blog.findFirst({
        where: {
            sortOrder: {
                gt: predecessorblog.sortOrder
            }
        },
        orderBy: {
            sortOrder: 'asc'
        }
    });

    if (!successorblog) {
        return predecessorblog.sortOrder + 10000;
    }

    let sortOrder = Number((predecessorblog.sortOrder + successorblog.sortOrder) / 2);

    let blogavailable = await prisma.blog.findFirst({
        where: {
            sortOrder: sortOrder
        }
    })

    if (blogavailable) {
        let isReseted = await resetBlogSortOrders();
        if(!isReseted){
            return false
        }

        sortOrder = await getAvailableSortOrder(req, res, next);
    }

    console.log("inside", {sortOrder});

    return sortOrder;
});

export const createBlogCategory = CatchAsync(async (req, res, next) => {
    // Get blog data from request body
    const {
        name,
        predecessor,
        parent=null,
        iconType,
        icon,
        darkIcon
    } = req.body;

    // make slug by using name
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    // // Validate required fields
    if (!name) {
        return res.status(400).json({
            success: false,
            message: "blog name is required"
        });
    }

    let iconImage = null;

    if (iconType === "url") {
        iconImage = {
            "url": icon,
            "darkUrl": darkIcon
        }
    }

    req.predecessorid = predecessor;

    let sortOrder = await getAvailableSortOrder(req, res, next);

    // // Create blog object
    const blog = {
        name,
        slug,
        parentId: parent,
        iconImage: iconImage,
        sortOrder
    };

    const blogData = await prisma.blog.create({
        data: blog
    });


    res.status(201).json({
        success: true,
        message: "Blog created successfully",
        blog: blogData
    })
});
export const editBlogCategory = CatchAsync(async (req, res, next) => {
    // Get blog data from request body
    const {
        predecessor,
        parent=null,
        iconType,
        icon,
        darkIcon
    } = req.body;

    // console.log(req.body)

    const blogid = req.query.blogid;

    const blog = await prisma.blog.findUnique({
        where: {
            id: blogid
        }
    });

    if (!blog) {
        return res.status(404).json({
            success: false,
            message: "Blog not found"
        });
    }

    const updatedBlogData = {
        parentId: parent,
    }

    if (iconType === "url") {
        let previousIconImage = blog.iconImage;
        if (previousIconImage) {
            if(icon) {
                previousIconImage["url"] = icon;
            }
            if(darkIcon) {
                previousIconImage.darkUrl = darkIcon;
            }
        } else {
            previousIconImage = {
                "url": icon,
                "darkUrl": darkIcon
            }
        }
        updatedBlogData["iconImage"] = previousIconImage;
    }

    if (predecessor) {
        req.predecessorid = predecessor;
        console.log("predecessor", predecessor);
        const newSortOrder = await getAvailableSortOrder(req, res, next);
        updatedBlogData["sortOrder"] = newSortOrder;
    }

    console.log({updatedBlogData})

    const blogData = await prisma.blog.update({
        where: {
            id: blogid
        },
        data: updatedBlogData
    });


    res.status(201).json({
        success: true,
        message: "Blog created successfully",
        blog: blogData
    })
});

export const getAllCategories = CatchAsync(async (req, res, next) => {
    // Single database query to fetch all categories
    const allCategories = await prisma.blog.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            parentId: true,
            isBlog: true,
            iconImage: true,
        },
        orderBy: [
            {
                sortOrder: {
                    sort: 'asc',
                    nulls: 'last'
                }
            },
            {
                id: 'asc'
            }
        ]
    });

    // Create a map for faster lookups
    const categoryMap = new Map();

    let topCategory;

    // First pass: create map of all categories
    allCategories.forEach(category => {

        let categoryData = {
            ...category,
            children: []
        }

        if (category.slug === "top") {
            topCategory = category;
        } else {
            categoryMap.set(category.id, categoryData);
        }

    });

    // Second pass: build the tree structure
    const rootCategories = [];

    categoryMap.forEach(category => {

        // Early return for root categories that aren't blogs
        if (!category.parentId || category.parentId === topCategory.id) {
            rootCategories.push(category);
            return;
        }

        const parent = categoryMap.get(category.parentId);

        if (parent) {
            parent.children.push(category);
        } else if (category.isBlog) {
            otherCategory.children.push(category);
        } else {
            rootCategories.push(category);
        }

    });

    res.status(200).json({
        success: true,
        categories: rootCategories,
        categorylist: allCategories,
        categoryMap: categoryMap,
    });
});

export const tokenVarify = CatchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return res.status(200).json({
            success: true,
            message: "Token verified successfully",
            user: decoded
        });
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Invalid token",
            error: error.message
        });
    }
});