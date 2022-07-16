import {
  createCommentHandler,
  fetchCommentByUserIdHandler,
  retrieveRankedListOfHashTagsAndMentionsHandler,
  FetchCommentsHandler,
  updateCommentHandler,
  softDeleteCommentHandler
} from "../controllers/comment.controller";
import validate from "../middlewares/validate";
import { createCommentValidation, updateCommentValidation } from "../validations/comment.validation";

const router = require("express").Router();

router.post("/create", validate(createCommentValidation), createCommentHandler);
router.get("/get", retrieveRankedListOfHashTagsAndMentionsHandler);
router.get("/get/:userId", fetchCommentByUserIdHandler);
router.get("/get-comments", FetchCommentsHandler);
router.patch("/update/:id/user/:userId", validate(updateCommentValidation), updateCommentHandler);
router.delete("/delete/:id/user/:userId", softDeleteCommentHandler);

// router.post("/comment/create", validate(createCommentValidation), createCommentHandler);
// router.get("/comment/get", retrieveRankedListOfHashTagsAndMentionsHandler);
// router.get("/comment/get/:userId", fetchCommentByUserIdHandler);
// router.get("/comment/get-comments", FetchCommentsHandler);
// router.patch("/comment/update/:id/user/:userId", validate(updateCommentValidation), updateCommentHandler);
// router.delete("/comment/delete/:id/user/:userId", softDeleteCommentHandler);

export default router;
