import { CreateComment, GetCommentsByUserId,  RetrieveRankedListOfHashTagsAndMentions } from "../services/comment.service";
import { createdResponse, badRequestResponse, notFoundResponse, successfulResponse } from "../utils/response";
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

    const { message, data, meta } = await GetCommentsByUserId(userId, page, limit);


    return successfulResponse({ res, message, data, meta });

})

export const retrieveRankedListOfHashTagsAndMentionsHandler = catchAsync(async (req, res) => {


    const { message, data, meta } = await  RetrieveRankedListOfHashTagsAndMentions();

    return successfulResponse({ res, message, data, meta });

})

