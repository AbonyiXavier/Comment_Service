import { createCommentHandler, fetchCommentByUserIdHandler, retrieveRankedListOfHashTagsAndMentionsHandler } from '../controllers/comment.controller';
import validate from '../middlewares/validate';
import { createCommentValidation } from '../validations/comment.validation';

const router = require('express').Router();

router.post('/comment/create', validate(createCommentValidation), createCommentHandler);
router.get('/comment/get', retrieveRankedListOfHashTagsAndMentionsHandler);
router.get('/comment/get/:userId', fetchCommentByUserIdHandler);

export default router;




