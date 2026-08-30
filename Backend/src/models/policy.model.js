import mongoose from "mongoose";

const policySchema =
    new mongoose.Schema(
        {
            companyId: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "Company",

                required: true,

                index: true
            },

            title: {
                type: String,
                required: true,
                trim: true
            },

            type: {
                type: String,
                required: true,
                trim: true
            },

            version: {
                type: Number,
                default: 1
            },

            status: {
                type: String,

                enum: [
                    "draft",
                    "processing",
                    "active",
                    "archived",
                    "failed"
                ],

                default:
                    "processing"
            },

            originalFilename: {
                type: String
            },

            mimeType: {
                type: String
            },

            chunkCount: {
                type: Number,
                default: 0
            },

            indexedAt: {
                type: Date,
                default: null
            },

            createdBy: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "User",

                required: true
            }
        },
        {
            timestamps: true
        }
    );

policySchema.index({
    companyId: 1,
    type: 1,
    version: -1
});

export const Policy =
    mongoose.model(
        "Policy",
        policySchema
    );