import {
    CreateComment,
    GetCommentsByUserId,
    RetrieveRankedListOfHashTagsAndMentions,
    GetCommentsPaginatedAndSearch,
    updateComment,
    softDeleteComment
} from "../services/comment.service";
import { createdResponse, badRequestResponse, successfulResponse, deletedResponse, notFoundResponse } from "../utils/response";
import catchAsync from "../utils/catchAsync";

export const createCommentHandler = catchAsync(async (req, res) => {

    const { hashTags, mentions, text, userId } = req.body;
    const { status, message, data } = await CreateComment({ hashTags, mentions, text, userId });

    if (!status) {
        return badRequestResponse({ res, message, data })
    }

    return createdResponse({ res, message, data });

})

export const fetchCommentByUserIdHandler = catchAsync(async (req, res) => {

    const { userId } = req.params;

    const { page, limit } = req.query;

    const { status, message, data, meta } = await GetCommentsByUserId(userId, page, limit);

    if (!status) {
        return notFoundResponse({ res, message, data })
    }

    return successfulResponse({ res, message, data, meta });

})

export const retrieveRankedListOfHashTagsAndMentionsHandler = catchAsync(async (req, res) => {


    const { message, data, meta } = await RetrieveRankedListOfHashTagsAndMentions();

    return successfulResponse({ res, message, data, meta });

})

export const FetchCommentsHandler = catchAsync(async (req, res) => {

    const { search, page, limit } = req.query;

    const { status, message, data, meta } = await GetCommentsPaginatedAndSearch(search, page, limit);

    if (!status) {
        return badRequestResponse({ res, message, data })
    }

    return successfulResponse({ res, message, data, meta });

})

export const updateCommentHandler = catchAsync(async (req, res) => {

    const { id, userId } = req.params;

    const { hashTags, mentions, text } = req.body;

    const { status, message, data } = await updateComment(id, hashTags, mentions, text, userId);

    if (!status) {
        return badRequestResponse({ res, message, data })
    }

    return successfulResponse({ res, message, data });

})
export const softDeleteCommentHandler = catchAsync(async (req, res) => {

    const { id, userId } = req.params;

    const { message, data } = await softDeleteComment(id, userId);

    return deletedResponse({ res, message, data });

})

