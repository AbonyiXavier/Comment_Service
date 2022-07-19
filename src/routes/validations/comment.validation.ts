import Joi from "joi";
import { objectId } from "./custom.validation";

const createCommentValidation = {
  body: Joi.object().keys({
    hashTags: Joi.array().optional(),
    mentions: Joi.array().optional(),
    text: Joi.string().required(),
    userId: Joi.string().required(),
  }),
};

const updateCommentValidation = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      hashTags: Joi.array().optional(),
      mentions: Joi.array().optional(),
      text: Joi.string().optional(),
    })
    .min(1),
};

export { createCommentValidation, updateCommentValidation };
