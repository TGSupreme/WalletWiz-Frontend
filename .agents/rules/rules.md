# 📜 WalletWiz - Frontend Project Instructions & Mandates

These instructions guide all code generation, UI/UX architecture decisions, and task execution for the WalletWiz frontend client. Adhere to these principles strictly.

---

## 1. Environment Management
* **Mandate:** Whenever a new frontend environment variable is added (e.g., loaded via `import.meta.env`), it MUST also be added to `.env.example` in the root directory with a placeholder or sensible default.
* **Pre-Modification Check:** Before making any configuration modifications, you MUST read `.env.example` and `src/services/api.js` to understand the required variables and configuration state.
* **Security Mandate:** Never read, modify, create, or commit the local `.env` file containing real API keys, URLs, or client secrets. The developer will manage all local `.env` configurations manually. Only the template configuration files (such as `.env.example` and service configuration files) may be read or modified.

---

## 2. Documentation Updates
* **Architectural Sync:** Any significant architectural changes, routing updates, component structural shifts, or state context updates must be immediately reflected in the relevant documentation files under `docs/` (such as `docs/design_specification.md`).
* **Progress Tracking:** You MUST update `docs/implementation_plan.md` whenever a development stage or task is completed, or when a new task is identified. The implementation plan serves as the absolute "Source of Truth" for development progress.

---

## 3. Modular Development
* **Coding Standards:** Adhere strictly to the styling tokens (Tailwind CSS v4), mobile-first responsiveness, and layout architecture documented in `docs/design_specification.md`.
* **Separation of Concerns (SRP):** Keep UI view components strictly isolated from direct API endpoints integration. Always use the Service Layer (`src/services/api.js`) and React Contexts (`src/context/`) to manage data queries, CRUD functions, and chat messages instead of fetching data directly inside component files.

## 4. Task Execution & Autonomy
* **Wait for Instruction:** Never jump to the next stage or implement new pages/features immediately after finishing one.
* **Explicit Approval:** You MUST wait for the user to explicitly say "proceed," "next stage," or provide a specific directive before moving on to any new work.

---

## 5. Version Control & Git Operations
* **Strict Commit Ban:** Do NOT execute any `git commit`, `git add` (in preparation for commit), or `git push` commands. All commits, staging, and branch pushing must be managed manually and explicitly by the user. You may only run read-only commands (like `git status`) for checking work state.
