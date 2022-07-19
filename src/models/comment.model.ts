import { getModelForClass, modelOptions, prop, Severity } from "@typegoose/typegoose";

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
  schemaOptions: {
    timestamps: true,
  },
})
export class Comment {
  @prop()
  hashTags: string[];

  @prop()
  mentions: string[];

  @prop({ unique: true, required: true })
  text: string;

  @prop({ unique: true, required: true })
  userId: string;

  @prop({ default: false })
  isDeleted: Boolean;

  @prop({ default: null })
  deletedAt: Date;

  @prop()
  deletedBy: string;

  @prop()
  updatedBy: string;
}

const commentModel = getModelForClass(Comment);

export default commentModel;
