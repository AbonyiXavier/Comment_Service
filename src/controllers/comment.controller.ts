import { Request, Response } from "express";

import { statusError, statusSuccess } from "../common/constant/constant";
import { STATUS_CODES } from "../common/utils/statusCodes";
import {
  createComment,
  getCommentsByUserId,
  getCommentsPaginatedAndSearch,
  retrieveRankedListOfHashTagsAndMentions,
  softDeleteComment,
  updateComment,
} from "../services/comment-service/comment.service";
import {
  createCommentConfig,
  deleteCommentConfig,
  getCommentsByUserIdConfig,
  pageDtoConfig,
  updateCommentConfig,
} from "../services/comment-service/types";

export const createCommentHandler = async (req: Request, res: Response) => {
    
  const { hashTags, mentions, text, userId } = req.body;

  const payload = { hashTags, mentions, text, userId } as createCommentConfig;

  try {
    const comment = await createComment(payload);

    return res.status(STATUS_CODES.CREATED).send({
      status: statusSuccess,
      message: "Comment created successfully",
      data: comment,
    });

  } catch (error: any) {

    if (error.status === statusError) {
      return res.status(STATUS_CODES.NOT_FOUND).send({
        status: statusError,
        message: "Invalid userId",
        data: null,
      });
    }

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      status: statusError,
      message: "Error creating comment",
      data: null,
    });
  }
};

export const fetchCommentByUserIdHandler = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params;

  const { page, limit } = req.query;

  const query = { userId, page, limit } as unknown as getCommentsByUserIdConfig;

  try {
    const comments = await getCommentsByUserId(query);

    return res.status(STATUS_CODES.OK).send({
      status: statusSuccess,
      message: "Comments fetched successfully",
      data: comments,
    });

  } catch (error: any) {

    if (error.name === "MongoServerError" && error.code === 51024) {
      return res.status(STATUS_CODES.NOT_FOUND).send({
        status: statusError,
        message: "Inavlid userId",
        data: null,
      });
    }

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      status: statusError,
      message: "Error fetching comments",
      data: null,
    });
  }
};

export const retrieveRankedListOfHashTagsAndMentionsHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const comment = await retrieveRankedListOfHashTagsAndMentions();

    return res.status(STATUS_CODES.OK).send({
      status: statusSuccess,
      message: "Comments fetched successfully",
      data: comment,
    });

  } catch (error: any) {

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      status: statusError,
      message: "Error fetching comments",
      data: null,
    });
  }
};

export const fetchCommentsHandler = async (req: Request, res: Response) => {
  const { search, page, limit } = req.query;

  const query = { search, page, limit } as unknown as pageDtoConfig;

  try {
    const comments = await getCommentsPaginatedAndSearch(query);

    return res.status(STATUS_CODES.OK).send({
      status: statusSuccess,
      message: "Comments fetched successfully",
      data: comments,
    });

  } catch (error: any) {

    if (error.name === "MongoServerError" && error.code === 51024) {
      return res.status(STATUS_CODES.NOT_FOUND).send({
        status: statusError,
        message: "No comment found",
        data: null,
      });
    }

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      status: statusError,
      message: "Error fetching comments",
      data: null,
    });
  }
};

export const updateCommentHandler = async (req: Request, res: Response) => {
  const { id, userId } = req.params;

  const { hashTags, mentions, text } = req.body;

  const payload = {
    id,
    hashTags,
    mentions,
    text,
    userId,
  } as updateCommentConfig;

  try {
    const comment = await updateComment(payload);

    return res.status(STATUS_CODES.OK).send({
      status: statusSuccess,
      message: "Comments updated successfully",
      data: comment,
    });

  } catch (error: any) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      status: statusError,
      message: "Error updating comment",
      data: null,
    });
  }
};

export const softDeleteCommentHandler = async (req: Request, res: Response) => {
  const { id, userId } = req.params;

  const query = { id, userId } as deleteCommentConfig;

  try {
    const comment = await softDeleteComment(query);

    return res.status(STATUS_CODES.OK).send({
      status: statusSuccess,
      message: "Comment deleted successfully",
      data: comment,
    });

  } catch (error: any) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      status: statusError,
      message: "Error deleteing comment",
      data: null,
    });
  }
};
