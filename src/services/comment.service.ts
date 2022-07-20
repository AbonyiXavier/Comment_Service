import axios from "axios";

import commentModel from "../models/comment.model";
import logger from "../config/logger";
import {
  createCommentConfig,
  deleteCommentConfig,
  getCommentsByUserIdConfig,
  pageDtoConfig,
  updateCommentConfig,
} from "./types";

export const createComment = async (props: createCommentConfig) => {

  const { hashTags, mentions, text, userId } = props;

  try {
    const verifyUser = await validateUserId(userId);

    if (verifyUser.status === 200 && verifyUser.data.data._id === userId) {
      const comment = new commentModel({
        hashTags,
        mentions,
        text,
        userId,
      });

      const commentResult = await comment.save();

      return commentResult;
    }

    throw verifyUser.response.data;
  } catch (error) {
    logger.error("CreateComment failed", error);
    throw error;
  }
};

/**
 * This method is responsible for validating userid before creating a comment
 * @param {*} userId
 * @returns
 */
async function validateUserId(userId: string) {
  try {
    const user = await axios.get(
      `${process.env.USER_SERVICE_BASE_URL}/get/${userId}`
    );

    if (user && user.status === 200 && user.data.data._id === userId) {
      return user;
    }
  } catch (error) {
    logger.error("validateUserId failed", error);

    return error;
  }
}

export const getCommentsByUserId = async (props: getCommentsByUserIdConfig) => {

  let { userId, page, limit } = props;

  try {
    page = !page || isNaN(page) ? 1 : Number(page);

    page = page < 1 ? 1 : Number(page);

    const count = await commentModel.countDocuments({
      userId,
      isDeleted: false,
    });

    limit = !limit || isNaN(limit) ? 5 : Number(limit);

    let totalPages = Math.ceil(count / limit);
    page = page > totalPages ? totalPages : page;

    const userComment = await commentModel
      .find({ userId, isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    return {
      data: userComment,
      meta: {
        totalPages: totalPages,
        currentPage: page,
        totalComments: count,
      },
    };
  } catch (error) {
    logger.error("GetCommentsByUserId failed", error);
    throw error;
  }
};

export const retrieveRankedListOfHashTagsAndMentions = async () => {
  try {
    const res = await commentModel.aggregate([
      {
        $facet: {
          hashTags: [
            {
              $unwind: {
                path: "$hashTags",
              },
            },
            {
              $sortByCount: "$hashTags",
            },
            {
              $limit: 10,
            },
          ],
          mentions: [
            {
              $unwind: {
                path: "$mentions",
              },
            },
            {
              $sortByCount: "$mentions",
            },
            {
              $limit: 10,
            },
          ],
        },
      },
    ]);

    return res;
  } catch (error) {
    logger.error("RetrieveRankedListOfHashTagsAndMentions failed", error);
    throw error;
  }
};

export const getCommentsPaginatedAndSearch = async (props: pageDtoConfig) => {

  let { search, page, limit } = props;

  try {
    page = !page || isNaN(page) ? 1 : Number(page);

    const searchQueries = {
      $or: [
        { hashTags: { $regex: search, $options: "ig" } },
        { mentions: { $regex: search, $options: "ig" } },
      ],
    };

    page = page < 1 ? 1 : Number(page);

    limit = !limit || isNaN(limit) ? 5 : Number(limit);

    let query = search ? searchQueries : {};

    const count = await commentModel.countDocuments(query);

    let totalPages = Math.ceil(count / limit);
    page = page > totalPages ? totalPages : page;

    const comment = await commentModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    return {
      data: comment,
      meta: {
        totalPages: totalPages,
        currentPage: page,
        totalComments: count,
      },
    };
  } catch (error) {
    logger.error("getCommentsPaginatedAndSearch failed", error);
    throw error;
  }
};

export const updateComment = async (props: updateCommentConfig) => {

  const { id, hashTags, mentions, text, userId } = props;

  try {
    const comment = await commentModel.findOneAndUpdate(
      {
        _id: id,
        userId: userId,
        isDeleted: false,
      },
      {
        $set: {
          hashTags: hashTags,
          mentions: mentions,
          text: text,
          updatedBy: userId,
        },
      },
      {
        new: true
      }
    );

    return comment;
  } catch (error) {
    logger.error("updateComment failed", error);
    throw error;
  }
};

export const softDeleteComment = async (props: deleteCommentConfig) => {

  const { id, userId } = props;
  
  try {
    const comment = await commentModel.findOneAndUpdate(
      {
        _id: id,
        userId: userId,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          deletedBy: userId,
          deletedAt: new Date(),
        },
      },
      {
        new: true
      }
    );

    return comment;
  } catch (error) {
    logger.error("softDeleteComment failed", error);
    throw error;
  }
};
