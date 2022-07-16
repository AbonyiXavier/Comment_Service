import { mongoose, Schema } from "mongoose";


const commentSchema = new Schema(
    {
        hashTags: { type: Array },
        mentions: { type: Array },
        
        text: { type: String, required: true },
        userId: { type: String, required: true },

        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },

        deletedBy: { type: String },
        updatedBy: { type: String }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                delete ret.__v;
            }
        },
    }
);

export default mongoose.model("Comment", commentSchema);