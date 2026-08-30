import {
  StateGraph,
  START,
  END
} from "@langchain/langgraph";

import { AgentState } from "../state/agent.state.js";
import { createAgentNode } from "../nodes/agent.node.js";
import { createToolNode } from "../nodes/tool.node.js";

import { createEmployeeTools } from "../../tools/employee.tools.js";
import { createLeaveTools } from "../../tools/leave.tools.js";
import { createAttendanceTools } from "../../tools/attendance.tools.js";
import { createPolicyTools } from "../../tools/policy.tools.js";
import { createManagerTools } from "../../tools/manager.tools.js";

const shouldContinue =
    (state) => {
        const lastMessage =
            state.messages[
            state.messages.length - 1
            ];

        if (
            lastMessage
                ?.tool_calls
                ?.length
        ) {
            return "tools";
        }

        return END;
    };

export const createHRAgent =
    (
        context,
        checkpointer = null
    ) => {
        const tools = [
            ...createEmployeeTools(context),
            ...createLeaveTools(context),
            ...createAttendanceTools(context),
            ...createPolicyTools(context),
            ...createManagerTools(context)
        ];

        const agentNode =
            createAgentNode(
                tools
            );

        const toolNode =
            createToolNode(
                tools
            );

        const workflow =
            new StateGraph(
                AgentState
            )
                .addNode(
                    "agent",
                    agentNode
                )

                .addNode(
                    "tools",
                    toolNode
                )

                .addEdge(
                    START,
                    "agent"
                )

                .addConditionalEdges(
                    "agent",
                    shouldContinue,
                    {
                        tools:
                            "tools",

                        [END]:
                            END
                    }
                )

                .addEdge(
                    "tools",
                    "agent"
                );

        return workflow.compile(
            checkpointer
                ? {
                    checkpointer
                }
                : {}
        );
    };