# Enterprise Multi-Tenant AI HR Agent & RAG Backend

A secure, scalable, multi-tenant AI HR Assistant backend built with **Node.js**, **Express v5**, **MongoDB**, **Pinecone**, **LangGraph**, and **Google Gemini AI**. 

The system enables employees and HR managers to search company policies via RAG (Retrieval-Augmented Generation), check leave balances, view attendance, process approvals, and manage policy lifecycles with enterprise-grade multi-tenant data isolation and audit logging.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Runtime & Server** | Node.js (ESM), Express.js (v5) | High-performance asynchronous REST API server |
| **Database** | MongoDB & Mongoose | Document database storing tenant metadata, users, employees, policies, and audit logs |
| **Vector Database** | Pinecone | Cloud-native vector database storing PDF document embeddings for semantic search |
| **Agentic AI** | LangChain & LangGraph | Stateful cyclic graph framework (`StateGraph`) for LLM tool selection & execution |
| **LLM & Embeddings** | Google Gemini (`gemini-3.6-flash`, `gemini-embedding-001`) | Fast, accurate generative AI for reasoning and vector embedding generation |
| **State Persistence** | `@langchain/langgraph-checkpoint-mongodb` | MongoDBSaver checkpointer for multi-turn conversation thread memory |
| **Security & Auth** | JWT (`jsonwebtoken`), `bcryptjs`, `helmet` | Role-Based Access Control (RBAC), password hashing, HTTP security headers |
| **Rate Limiting** | `express-rate-limit` | Protection against DDoS and LLM API cost abuse |
| **Validation & Parsing**| `zod`, `multer`, `pdf-parse` | Request schema validation, multipart file upload, PDF text extraction |
| **Testing** | Vitest, Supertest | Fast unit and integration test runner |

---

## 🌟 Core Features

1. **Multi-Tenant Policy Vector Ingestion (RAG)**:
   - PDF upload parsing, recursive document chunking, Gemini embedding generation, and Pinecone vector store upserting.
2. **Policy Lifecycle & Archiving**:
   - Status tracking (`draft`, `processing`, `active`, `archived`, `failed`).
   - `PATCH /api/policies/:id/archive` endpoint for archiving outdated policies.
3. **Immutable Audit Logging**:
   - Automatic audit entries written to MongoDB for every write operation (`POLICY_UPLOADED`, `POLICY_ARCHIVED`, `LEAVE_APPLIED`, `LEAVE_APPROVED`).
4. **Agentic Tool Execution**:
   - Dynamic tools for employee search, leave balance lookup, attendance tracking, leave applications, policy search, and manager approvals.
5. **Stateful Conversation Memory**:
   - Thread checkpointer stored in MongoDB (`Conversation` model + `MongoDBSaver`).

---

## 🏗️ System Architecture

```text
                        ┌───────────────────────────────────────────────┐
                        │              Client / Frontend                │
                        └───────────────────────┬───────────────────────┘
                                                │  HTTP / Bearer Token
                                                ▼
                        ┌───────────────────────────────────────────────┐
                        │        Express v5 REST API Gateway            │
                        │   (Authentication & Authorization Middleware) │
                        └───────────────────────┬───────────────────────┘
                                                │
                                                ▼
                        ┌───────────────────────────────────────────────┐
                        │             LangGraph HR Agent Node           │
                        │       (Google Gemini 3.6 Flash reasoning)     │
                        └───────┬───────────────────────────────┬───────┘
                                │                               │
             ┌──────────────────┴───────────────┐   ┌───────────┴───────────────────┐
             │       Pinecone Vector Store      │   │    MongoDB Database Storage   │
             │   (Isolated Tenant Namespace)    │   │  (Company, User, Policy, Logs)│
             └──────────────────────────────────┘   └───────────────────────────────┘
```

---

## 🧠 How the AI Agent Works (LangGraph Execution)

When a request arrives at `POST /api/chat`:

1. **Authentication & Context Building**:
   - Authentication middleware extracts `companyId`, `userId`, `employeeId`, and `role` from the verified JWT.
   - Context is injected into the agent invocation state.

2. **LangGraph StateGraph Routing**:
   - The graph initializes with `AgentState` containing message history.
   - **`agent` node**: Binds available tools (`search_company_policy`, `get_leave_balance`, `search_employees`, etc.) to the Gemini LLM.
   - **`shouldContinue` conditional edge**:
     - If Gemini requests a tool call → route to **`tools` node**.
     - If Gemini provides a final answer → route to **`END`**.

3. **Tool Execution Loop**:
   - The `tools` node executes the requested tools (e.g. searching Pinecone or MongoDB) and returns `ToolMessage` outputs back to the `agent` node for final synthesis.

---

## 🔒 Multi-Tenancy at Scale (Handling 1,000+ Companies Securely)

To safely host 1,000+ distinct companies on a single backend infrastructure without data leakage, the architecture implements **3-Layer Security Isolation**:

### 1. Database-Level Isolation (MongoDB)
- Every database model (`User`, `Employee`, `Department`, `Policy`, `LeaveBalance`, `Attendance`, `AuditLog`, `Conversation`) includes an indexed, mandatory `companyId` field.
- All database queries, updates, and deletes are explicitly scoped by `companyId`:
  ```javascript
  const policy = await Policy.findOneAndUpdate(
      { _id: policyId, companyId: req.user.companyId },
      { status: "archived" },
      { new: true }
  );
  ```

### 2. Vector Store Namespace Isolation (Pinecone)
- Pinecone vector data is partitioned into **Namespaces** based on the company's unique ID:
  ```javascript
  namespace: `company-${companyId}`
  ```
- When searching or indexing policy documents, vector queries are strictly confined to `company-${companyId}`. A query from Company A can **never** search or view vectors in Company B's namespace.

### 3. JWT Scoping & Request Context
- The signed JWT token contains `companyId` and `role` encrypted in the payload.
- Clients cannot tamper with or override their `companyId`. All agent context and backend operations automatically derive identity from the verified token.

---

## 🛡️ Anti-Hallucination & Strict Boundary Controls

To prevent the AI from generating false information or using unauthorized external knowledge, the backend enforces strict prompt engineering rules:

1. **Policy-Bound Answers**:
   - The system prompt instructs the agent: *"You are an official HR Assistant. You MUST only answer policy questions based on company policy documents retrieved via `search_company_policy`. Do NOT guess or provide outside general knowledge."*
2. **Missing Information Protocol**:
   - If a user asks about a policy rule that does not exist in the company's uploaded documents, the AI responds:
     > *"Information regarding this request was not found in official company policy documents. Please contact your HR department for assistance."*
3. **Write Confirmation Guard**:
   - Write actions (such as applying for leave) require `confirmAction: true` in the request payload, preventing unintended automated modifications.

---

## 🚦 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new company & admin account.
- `POST /api/auth/login` - Authenticate and receive JWT Bearer token.
- `GET /api/auth/me` - Retrieve current authenticated user profile.

### Policy Management
- `GET /api/policies` - List all company policy documents.
- `POST /api/policies/upload` - Upload PDF policy, extract text, and index vector embeddings in Pinecone (`HR`/`Admin` only).
- `PATCH /api/policies/:id/archive` - Archive a policy document and write a `POLICY_ARCHIVED` audit log (`HR`/`Admin` only).

### AI Agent Chat
- `POST /api/chat` - Interact with the AI HR Agent (Supports Policy RAG queries, DB lookups, and actions).

### Health Check
- `GET /health` - Returns server status and current timestamp.

---

## 🧪 Testing & Data Injection

### Data Injection (Seeding)
To seed initial demo data (company, employees, leave balances, attendance, and sample policy):

```bash
npm run seed
```

### Automated Unit Tests
Run the Vitest unit test suite:

```bash
npm test
```

### Postman Testing Guide
Refer to [`test.md`](file:///c:/Users/JENISH/OneDrive/Desktop/Company-AI-Agent/Backend/test.md) for complete step-by-step Postman instructions covering all 4 query scenarios (Policy-only, Tool-only, Both, and Action execution).
