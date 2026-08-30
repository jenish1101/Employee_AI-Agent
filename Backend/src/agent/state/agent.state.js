import {
    Annotation
} from "@langchain/langgraph";

import {
    messagesStateReducer
} from "@langchain/langgraph";

export const AgentState =
    Annotation.Root({
        messages: Annotation({
            reducer: messagesStateReducer,
            default: () => []
        }),

        userId: Annotation({
            reducer: (_, value) => value,
            default: () => null
        }),

        companyId: Annotation({
            reducer: (_, value) => value,
            default: () => null
        }),

        employeeId: Annotation({
            reducer: (_, value) => value,
            default: () => null
        }),

        role: Annotation({
            reducer: (_, value) => value,
            default: () => null
        })
    });