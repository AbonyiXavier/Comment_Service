
import { createCommentHandler, fetchCommentByUserIdHandler, fetchCommentsHandler, retrieveRankedListOfHashTagsAndMentionsHandler, softDeleteCommentHandler, updateCommentHandler } from "../controllers/comment.controller";
import validate from "../middlewares/validate";
import { createCommentValidation, updateCommentValidation } from "./validations/comment.validation";

const router = require("express").Router();

router.post("/create", validate(createCommentValidation), createCommentHandler);
router.get("/get/:userId", fetchCommentByUserIdHandler);
router.get("/get", retrieveRankedListOfHashTagsAndMentionsHandler);
router.get("/get-comments", fetchCommentsHandler);
router.patch("/update/:id/user/:userId", validate(updateCommentValidation), updateCommentHandler);
router.delete("/delete/:id/user/:userId", softDeleteCommentHandler);

export default router;
