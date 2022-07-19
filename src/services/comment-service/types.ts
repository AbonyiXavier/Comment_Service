export type createCommentConfig = {
  hashTags: string;
  mentions: string;
  text: string;
  userId: string;
};

export type getCommentsByUserIdConfig = {
  userId: string;
  page: number;
  limit: number;
};

export type pageDtoConfig = {
  search: string;
  page: number;
  limit: number;
};

// extending type in type
export type updateCommentConfig = createCommentConfig & {
  id: string;
};

export type deleteCommentConfig = {
  id: string;
  userId: string;
};
