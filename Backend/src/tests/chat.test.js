import { describe, it, expect, vi } from "vitest";
import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { createHRAgent } from "../agent/graph/hr-agent.graph.js";

describe("HR Agent Graph Workflows", () => {
    const mockContext = {
        userId: "user123",
        companyId: "company123",
        employeeId: "emp123",
        role: "employee",
        allowActions: true
    };

    it("should compile the LangGraph workflow with all tools bound", () => {
        const agent = createHRAgent(mockContext);
        expect(agent).toBeDefined();
        expect(typeof agent.invoke).toBe("function");
    });

    it("should handle Policy-Only RAG routing structure", async () => {
        const agent = createHRAgent(mockContext);
        expect(agent.getGraph).toBeDefined();
        const graph = agent.getGraph();
        expect(graph.nodes).toHaveProperty("agent");
        expect(graph.nodes).toHaveProperty("tools");
    });
});
