# Complete AI Agent Scenario & Feature Testing Guide

This guide details how to test all **4 AI Agent Query Scenarios** (Policy-only, Tool-only, Both Policy+Tool, Action-execution) using **Postman** and automated test suites.

---

## 📋 Overview of AI Agent Query Scenarios

The AI HR Agent uses a **LangGraph StateGraph** to dynamically choose tools based on the user's intent:

```text
                        ┌─────────────────────────────────┐
                        │   User Query to POST /api/chat  │
                        └────────────────┬────────────────┘
                                         │
                         ┌───────────────┴───────────────┐
                         │   LangGraph Agent Routing    │
                         └───────────────┬───────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
[Scenario A: Policy-Only]      [Scenario B: Tool-Only]         [Scenario C: Both Policy + Tool]
Uses search_company_policy     Uses DB tools (leave,           Calls BOTH policy search AND
(Pinecone RAG Vector Store)    attendance, employee search)    database tools in single turn
```

---

## 🚀 Environment Setup & Prerequisite

1. Ensure your backend server is running:
   ```bash
   npm run dev
   ```
2. Run data injection if you haven't seeded demo data:
   ```bash
   npm run seed
   ```

---

## 🧪 Postman Scenario 1: Policy-Only Query (RAG Vector Search)

Use this scenario to query official company policies uploaded via PDF into Pinecone.

### Postman Request:
- **HTTP Method**: `POST`
- **URL**: `http://localhost:5000/api/chat`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer <YOUR_JWT_TOKEN>`
- **Body (`raw JSON`)**:
```json
{
  "message": "What is our company remote work policy?"
}
```

### Expected Behavior & Execution Flow:
1. Agent identifies a policy question.
2. Invokes **`search_company_policy`** tool.
3. Performs vector similarity search against Pinecone index.
4. Returns exact policy answer from uploaded document.

### Sample Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "conversationId": "66d30b...",
    "answer": "According to the official company policy, employees are permitted to work remotely up to 2 days per week with prior manager approval."
  }
}
```

---

## 🧪 Postman Scenario 2: Tool-Only Query (Database Lookup)

Use this scenario to perform database lookups for employee records, leave balances, or attendance data.

### Postman Request:
- **HTTP Method**: `POST`
- **URL**: `http://localhost:5000/api/chat`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer <YOUR_JWT_TOKEN>`
- **Body (`raw JSON`)**:
```json
{
  "message": "How many casual leaves do I have left?"
}
```

### Expected Behavior & Execution Flow:
1. Agent identifies a database lookup request.
2. Invokes **`get_leave_balance`** tool.
3. Queries MongoDB `leavebalances` collection for current year (2026).
4. Returns current balance directly from MongoDB database.

### Sample Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "conversationId": "66d30b...",
    "answer": "You currently have 12 casual leaves, 10 sick leaves, and 15 paid leaves remaining for 2026."
  }
}
```

---

## 🧪 Postman Scenario 3: BOTH Policy + Tool Query (Hybrid Execution)

Use this scenario to test queries that require **BOTH** querying MongoDB database data AND Pinecone vector store policy rules in a single turn.

### Postman Request:
- **HTTP Method**: `POST`
- **URL**: `http://localhost:5000/api/chat`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer <YOUR_JWT_TOKEN>`
- **Body (`raw JSON`)**:
```json
{
  "message": "Check my casual leave balance, and also tell me what the company policy says about remote work approval."
}
```

### Expected Behavior & Execution Flow:
1. Agent detects multi-intent request.
2. Invokes **`get_leave_balance`** (Database tool) to fetch leave balance.
3. Invokes **`search_company_policy`** (RAG tool) to fetch remote work approval rules.
4. Combines database results + Pinecone vector chunks into a single response.

### Sample Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "conversationId": "66d30b...",
    "answer": "You have 12 casual leaves remaining for 2026. Regarding remote work approval, official policy states that all remote work requests must be submitted and approved by your direct manager in advance."
  }
}
```

---

## 🧪 Postman Scenario 4: Action Execution (`confirmAction: true`)

Use this scenario to test write operations through the AI agent (e.g. applying for leave).

### Postman Request:
- **HTTP Method**: `POST`
- **URL**: `http://localhost:5000/api/chat`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer <YOUR_JWT_TOKEN>`
- **Body (`raw JSON`)**:
```json
{
  "message": "Apply for 1 day casual leave for tomorrow",
  "confirmAction": true
}
```

### Expected Behavior & Execution Flow:
1. `confirmAction: true` authorizes write operations.
2. Agent invokes **`apply_leave_request`** tool.
3. Inserts leave request record into MongoDB `leaverequests`.
4. Returns confirmation answer with request status `pending`.

---

## 🛠️ Summary Matrix of AI Agent Test Scenarios

| Scenario | Goal | Tools Executed | Primary Data Source | Sample Query |
| :--- | :--- | :--- | :--- | :--- |
| **Scenario A** | Policy RAG Question | `search_company_policy` | Pinecone Vector Store | *"What is the remote work policy?"* |
| **Scenario B** | DB Lookup | `get_leave_balance` / `search_employees` | MongoDB Collections | *"How many casual leaves do I have left?"* |
| **Scenario C** | **Both Policy + Tool** | `search_company_policy` + `get_leave_balance` | **Both Pinecone + MongoDB** | *"Check my leave balance and explain remote work rules"* |
| **Scenario D** | Write Action | `apply_leave_request` | MongoDB Write + Audit Log | *"Apply for casual leave for tomorrow"* |

---

## 🧪 Automated Testing

To run the automated Vitest test suite for all agent scenarios and services:

```bash
npm test
```
