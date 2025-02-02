import CatchAsync from "../utils/CatchAsync.js";
import prisma from "../db/db.config.js";


export const addComment = CatchAsync(async (req, res, next) => {
    console.log(req.body);

    const commentContext = req.body;

    const blog = await prisma.blog.findFirst({
        where: {
            id: commentContext.blogId
        }
    });

    if (!blog) {
        return res.status(404).json({
            success: false,
            message: "Blog not found"
        });
    }

    const comment = await prisma.comment.create({
        data: {
            ...commentContext,
            userId: req.userId
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            blogId: true,
            parentId: true,
            _count: {
                select: {
                    replies: true
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        }
    });

    res.status(200).json({
        status: "success",
        message: "Comment added successfully",
        comment: comment
    });
});

export const getComments = CatchAsync(async (req, res, next) => {
    const blogId = req.query.blogid;
    const start = Number(req.query.start || 0);
    const limit = Number(req.query.limit || 3);

    const comments = await prisma.comment.findMany({
        where: {
            blogId: blogId,
            parentId: null
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            blogId: true,
            parentId: true,
            _count: {
                select: {
                    replies: true
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'  // This will sort comments newest to oldest
        },
        skip: start,    // Add offset
        take: limit     // Add limit
    });

    // Get total comments count
    const totalCount = await prisma.comment.count({
        where: {
            blogId: blogId
        }
    });

    // Get direct comments count
    const blogCommentsCount = await prisma.comment.count({
        where: {
            blogId: blogId,
            parentId: null
        }
    });

    if(!comments) {
        comments = [];
    }

    res.status(200).json({
        status: "success",
        totalComments: totalCount,
        blogCommentsCount: blogCommentsCount,
        comments: comments
    });
});

export const getReplies = CatchAsync(async (req, res, next) => {
    const commentId = req.query.commentid;
    const start = Number(req.query.start || 0);
    const limit = Number(req.query.limit || 3);

    const replies = await prisma.comment.findMany({
        where: {
            parentId: commentId
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            blogId: true,
            parentId: true,
            _count: {
                select: {
                    replies: true
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        },
        orderBy: {
            updatedAt: 'asc'
        },
        skip: start,    // Add offset
        take: limit     // Add limit
    });

    if(!replies) {
        replies = [];
    }

    res.status(200).json({
        status: "success",
        replies: replies
    });
});