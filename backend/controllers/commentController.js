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
        include: {
            user: true
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

    const comments = await prisma.comment.findMany({
        where: {
            blogId: blogId,
            parentId: null
        },
        include: {
            user: true
        },
        orderBy: {
            updatedAt: 'desc'  // This will sort comments newest to oldest
        }
    });

    if(!comments) {
        comments = [];
    }

    res.status(200).json({
        status: "success",
        comments: comments
    });
});

export const getReplies = CatchAsync(async (req, res, next) => {
    const commentId = req.query.commentid;

    const replies = await prisma.comment.findMany({
        where: {
            parentId: commentId
        },
        include: {
            user: true
        },
        orderBy: {
            updatedAt: 'asc'
        }
    });



    if(!replies) {
        replies = [];
    }

    res.status(200).json({
        status: "success",
        replies: replies
    });
});