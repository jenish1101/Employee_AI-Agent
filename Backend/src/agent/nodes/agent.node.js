import {
    SystemMessage
} from "@langchain/core/messages";

import { llm } from "../../services/llm.service.js";

import {
    HR_AGENT_SYSTEM_PROMPT
} from "../prompts/hr-agent.prompt.js";

export const createAgentNode =
    (tools) => {
        const model =
            llm.bindTools(tools);

        return async (state) => {
            const response =
                await model.invoke([
                    new SystemMessage(
                        HR_AGENT_SYSTEM_PROMPT
                    ),

                    ...state.messages
                ]);

            return {
                messages: [response]
            };
        };
    };