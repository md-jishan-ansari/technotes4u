import prisma from "../db/db.config.js";
import CatchAsync from "../utils/CatchAsync.js";
import jwt from 'jsonwebtoken';


export const createBlog = CatchAsync(async (req, res, next) => {
    // Get blog data from request body
    const { name, description, isBlog=false, parentId=null } = req.body;

    // make slug by using name
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    // Validate required fields
    if (!name) {
        return res.status(400).json({
            success: false,
            message: "blog name is required"
        });
    }

    // Create blog object
    const blog = {
        name,
        slug,
        description: description || "",
        isBlog,
        parentId
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
            position: true
        }
    });

    // Create a map for faster lookups
    const categoryMap = new Map();

    let otherCategory = "";

    // First pass: create map of all categories
    allCategories.forEach(category => {

        let categoryData = {
            ...category,
            children: []
        }

        if (category.slug === 'other') {
            otherCategory = categoryData
        }

        categoryMap.set(category.id, categoryData);

    });

    // Second pass: build the tree structure
    const rootCategories = [];

    categoryMap.forEach(category => {

        // Early return for root categories that aren't blogs
        if (!category.parentId && !category.isBlog) {
            rootCategories.push(category);
            return;
        }

        // Handle blog entries
        if (!category.parentId && category.isBlog) {
            otherCategory.children.push(category);
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

    // Sort function for categories at same level
    const sortSameLevel = (categories) => {
        if (!categories.length) return [];

        const sorted = [];
        const positionMap = new Map();

        // Create position mapping
        categories.forEach(category => {
            if (category.position) {
                if (!category.position.prevBlog) {
                    // First item
                    sorted.push(category);
                }
                positionMap.set(category.id, category);
            }
        });

        // Build the sorted array
        while (sorted.length < categories.length) {
            const lastItem = sorted[sorted.length - 1];
            if (!lastItem?.position?.nextBlog) {
                // Add remaining unsorted items
                categories.forEach(category => {
                    if (!sorted.includes(category)) {
                        sorted.push(category);
                    }
                });
                break;
            }

            const nextItem = positionMap.get(lastItem.position.nextBlog);
            if (nextItem && !sorted.includes(nextItem)) {
                sorted.push(nextItem);
            } else {
                break;
            }
        }

        return sorted;
    };

    // Sort children arrays
    const sortChildren = (categories) => {
        categories.forEach(category => {
            if (category.children.length > 0) {
                category.children = sortSameLevel(category.children);
                sortChildren(category.children);
            }
        });
    };

    // Sort root categories and their children
    const sortedRootCategories = sortSameLevel(rootCategories);
    sortChildren(sortedRootCategories);

    // Sort other category children
    if (otherCategory.children.length > 0) {
        otherCategory.children = sortSameLevel(otherCategory.children);
    }

    res.status(200).json({
        success: true,
        categories: rootCategories
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