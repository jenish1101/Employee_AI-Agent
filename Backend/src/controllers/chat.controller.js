import {
    HumanMessage
} from "@langchain/core/messages";

import {
    createHRAgent
} from "../agent/graph/hr-agent.graph.js";

import {
    checkpointer
} from "../config/langgraph.js";

import {
    Conversation
} from "../models/conversation.model.js";

export const chat =
    async (req, res) => {
        const {
            message,
            conversationId,
            confirmAction = false
        } = req.body;

        if (
            !message ||
            typeof message !==
            "string"
        ) {
            return res.status(400).json({
                success: false,

                message:
                    "message is required"
            });
        }

        let conversation;

        if (conversationId) {
            conversation =
                await Conversation.findOne({
                    _id:
                        conversationId,

                    userId:
                        req.user.userId,

                    companyId:
                        req.user.companyId
                });

            if (!conversation) {
                return res
                    .status(404)
                    .json({
                        success:
                            false,

                        message:
                            "Conversation not found"
                    });
            }
        } else {
            conversation =
                await Conversation.create({
                    userId:
                        req.user.userId,

                    companyId:
                        req.user.companyId,

                    title:
                        message
                            .slice(
                                0,
                                60
                            )
                });
        }

        const context = {
            userId:
                req.user.userId,

            companyId:
                req.user.companyId,

            employeeId:
                req.user.employeeId,

            role:
                req.user.role,

            allowActions:
                confirmAction ===
                true
        };

        const agent =
            createHRAgent(
                context,
                checkpointer
            );

        const result =
            await agent.invoke(
                {
                    messages: [
                        new HumanMessage(
                            message
                        )
                    ],

                    ...context
                },
                {
                    configurable: {
                        thread_id:
                            conversation
                                ._id
                                .toString()
                    }
                }
            );

        const lastMessage =
            result.messages[
            result.messages.length -
            1
            ];

        return res.json({
            success: true,

            data: {
                conversationId:
                    conversation._id,

                answer:
                    typeof lastMessage
                        .content ===
                        "string"
                        ? lastMessage
                            .content
                        : JSON.stringify(
                            lastMessage
                                .content
                        )
            }
        });
    };