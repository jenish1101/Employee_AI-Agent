import {
    ToolNode
} from "@langchain/langgraph/prebuilt";

export const createToolNode =
    (tools) => {
        return new ToolNode(tools);
    };