const router = require('express').Router();

import commentRoute from './comment.route';

router.use('/v1', commentRoute);


export default router;