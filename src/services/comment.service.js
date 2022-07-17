import CommentModel from "../models/comment.model";
import axios from "axios"
import logger from "../config/logger";

/**
 * This method is responsible for creating comment
 * @param {*} param0 
 * @returns 
 */
export const CreateComment = async ({ hashTags, mentions, text, userId }) => {
    try {
        const verifyUser = await validateUserId(userId);

        if (verifyUser.status === 200 && verifyUser.data.data._id === userId) {

            const comment = new CommentModel({
                hashTags,
                mentions,
                text,
                userId
            });

            const commentResult = await comment.save();

            return {
                status: true,
                message: "Comment created successfully",
                data: commentResult
            };

        }

        return {
            status: false,
            message: verifyUser.response.data.message,
            data: null
        };

    } catch (error) {
        logger.error("CreateComment failed", error);

        return {
            status: false,
            message: 'Error creating comment',
            data: null
        };
    }
}

/**
 * This method is responsible for validating userid before creating a comment
 * @param {*} userId 
 * @returns 
 */
async function validateUserId(userId) {
    try {
        const user = await axios.get(`${process.env.USER_SERVICE_BASE_URL}/get/${userId}`);

        if (user && user.status === 200 && user.data.data._id === userId) {
            return user;
        }

    } catch (error) {
        logger.error("validateUserId failed", error);

        return error;
    }
}


export const GetCommentsByUserId = async (userId, page, limit) => {
    try {

        page = !page || isNaN(page) ? 1 : Number(page);

        page = page < 1 ? 1 : Number(page);

        const count = await CommentModel.countDocuments({ userId, isDeleted: false });

        limit = !limit || isNaN(limit) ? 5 : Number(limit);

        let totalPages = Math.ceil(count / limit);
        page = page > totalPages ? totalPages : page;

        return await constructFetchCommentsByUserIdEntity(userId, limit, page, totalPages, count);

    } catch (error) {
        logger.error("GetCommentsByUserId failed", error);

        if (error.name === "MongoServerError" && error.code === 51024) {
            return {
                status: false,
                message: "No comment found",
                data: null
            };
        }
        return {
            status: false,
            message: 'Error fetching comment(s)',
            data: null
        };
    }
}

/**
 * A method that construct fetchC omments by userId entity
 * @param {*} userId 
 * @param {*} limit 
 * @param {*} page 
 * @param {*} totalPages 
 * @param {*} count 
 * @returns 
 */
async function constructFetchCommentsByUserIdEntity(userId, limit, page, totalPages, count) {
    const userComment = await CommentModel.find({ userId, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

    if (userComment.length < 1) {
        return {
            status: false,
            message: 'No comment found',
            data: null
        };
    }

    return {
        status: true,
        message: 'Comment fetched successfully',
        data: userComment,
        meta: {
            totalPages: totalPages,
            currentPage: page,
            totalComments: count
        },
    };
}


/**
 * This method is responsible to retrieve a ranked list of the top 10 hashtags and top 10 mentions, and how often they were used.
 * @returns 
 */
export const RetrieveRankedListOfHashTagsAndMentions = async () => {
    try {

        const [hashTags, mentions] = await Promise.all([
            // for hashTags
            CommentModel.aggregate([
                {
                    '$unwind': {
                        'path': '$hashTags'
                    }
                }, {
                    '$sortByCount': '$hashTags'
                }, {
                    '$limit': 10
                }
            ]),

            // for mentions
            CommentModel.aggregate([
                {
                    '$unwind': {
                        'path': '$mentions'
                    }
                }, {
                    '$sortByCount': '$mentions'
                }, {
                    '$limit': 10
                }
            ])
        ]);

        return {
            status: true,
            message: 'Comment fetched successfully',
            data: { hashTags, mentions }
        };

    } catch (error) {
        logger.error("RetrieveRankedListOfHashTagsAndMentions failed", error);

        return {
            status: false,
            message: 'Error retrieving list',
            data: null
        };
    }
}

/**
 * This method is responsible for fetching all Comments with Pagination and can Search by hashTags and mentions
 * @param {*} search 
 * @param {*} page 
 * @param {*} limit 
 * @returns 
 */
export const GetCommentsPaginatedAndSearch = async (search, page, limit) => {
    try {
        page = !page || isNaN(page) ? 1 : Number(page);

        const searchQueries = {

            $or: [
                { hashTags: { $regex: search, $options: 'ig' } },
                { mentions: { $regex: search, $options: 'g' } },
            ]

        };

        page = page < 1 ? 1 : Number(page);

        limit = !limit || isNaN(limit) ? 5 : Number(limit);

        let query = search ? searchQueries : {};

        const count = await CommentModel.countDocuments(query);

        let totalPages = Math.ceil(count / limit);
        page = page > totalPages ? totalPages : page;

        return await constructFetchCommentsEntity(query, limit, page, totalPages, count);

    } catch (error) {
        logger.error("GetCommentsPaginatedAndSearch failed", error);

        if (error.name === "MongoServerError" && error.code === 51024) {
            return {
                status: false,
                message: "No comment found",
                data: null
            };
        }
        return {
            status: false,
            message: 'Error fetching comments',
            data: null
        };
    }
}

/**
 * A method that construct fetch comments entity
 * @param {*} query 
 * @param {*} limit 
 * @param {*} page 
 * @param {*} totalPages 
 * @param {*} count 
 * @returns 
 */
async function constructFetchCommentsEntity(query, limit, page, totalPages, count) {
    const comment = await CommentModel.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

    return {
        status: true,
        message: 'Comment fetched successfully',
        data: comment,
        meta: {
            totalPages: totalPages,
            currentPage: page,
            totalComments: count
        },
    };
}

/**
 * This method is responsible for updating comment by user
 * @param {*} id 
 * @param {*} hashTags 
 * @param {*} mentions 
 * @param {*} text 
 * @param {*} userId 
 * @returns 
 */
export const updateComment = async (id, hashTags, mentions, text, userId) => {
    try {
        const comment = await CommentModel.findOneAndUpdate(
            {
                _id: id,
                userId: userId,
                isDeleted: false
            },
            {
                $set: {
                    hashTags: hashTags,
                    mentions: mentions,
                    text: text,
                    updatedBy: userId
                }
            },
            {
                new: true,
                upsert: true
            }
        );

        return {
            status: true,
            message: 'Comment updated successfully',
            data: comment
        };

    } catch (error) {
        logger.error("updateComment failed", error);

        return {
            status: false,
            message: 'Error updating comment',
            data: null
        };
    }
}

/**
 * This method is responsible for soft delete of comments by user
 * @param {*} id 
 * @param {*} userId 
 * @returns 
 */
export const softDeleteComment = async (id, userId) => {
    try {
        const comment = await CommentModel.findOneAndUpdate(
            {
                _id: id,
                userId: userId,
                isDeleted: false
            },
            {
                $set: {
                    isDeleted: true,
                    deletedBy: userId,
                    deletedAt: new Date()
                }
            },
            {
                new: true,
                upsert: true
            }
        );

        return {
            status: true,
            message: "Comment deleted successfully!",
            data: comment
        };

    } catch (error) {
        logger.error("softDeleteComment failed", error);

        return {
            status: false,
            message: 'Error deleteing comment',
            data: null
        };
    }
}