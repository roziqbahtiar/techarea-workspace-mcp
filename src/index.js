#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as plane from "./plane.js";

const server = new McpServer({
  name: "plane-mcp",
  version: "1.0.0",
});

// --- LIST ISSUES ---
server.tool(
  "list_issues",
  "List issues in the Plane project. Optionally filter by module.",
  { moduleId: z.string().optional().describe("Filter by module ID") },
  async ({ moduleId }) => {
    const issues = await plane.listIssues({ moduleId });
    if (!issues.length) return { content: [{ type: "text", text: "No issues found." }] };
    const text = issues
      .map((i) => `[HALOZ-${i.sequence_id}] ${i.name} | priority: ${i.priority} | id: ${i.id}`)
      .join("\n");
    return { content: [{ type: "text", text }] };
  }
);

// --- GET ISSUE ---
server.tool(
  "get_issue",
  "Get full detail of a specific issue by ID.",
  { issueId: z.string().describe("Issue UUID") },
  async ({ issueId }) => {
    const issue = await plane.getIssue(issueId);
    const text = [
      `Name: ${issue.name}`,
      `Priority: ${issue.priority}`,
      `State: ${issue.state}`,
      `Assignees: ${issue.assignees?.join(", ") || "none"}`,
      `Description: ${issue.description_html || "-"}`,
    ].join("\n");
    return { content: [{ type: "text", text }] };
  }
);

// --- CREATE ISSUE ---
server.tool(
  "create_issue",
  "Create a new issue in the Plane project.",
  {
    name: z.string().describe("Issue title"),
    description: z.string().optional().describe("Issue description (plain text)"),
    priority: z.enum(["urgent", "high", "medium", "low", "none"]).optional(),
    stateId: z.string().optional().describe("State UUID"),
    assigneeIds: z.array(z.string()).optional().describe("List of member UUIDs to assign"),
    moduleId: z.string().optional().describe("Module UUID to add the issue into"),
  },
  async ({ name, description, priority, stateId, assigneeIds, moduleId }) => {
    const issue = await plane.createIssue({ name, description, priority, stateId, assigneeIds });
    if (moduleId) await plane.moveToModule(issue.id, moduleId);
    return {
      content: [{ type: "text", text: `Issue created: [HALOZ-${issue.sequence_id}] ${issue.name} (id: ${issue.id})` }],
    };
  }
);

// --- UPDATE ISSUE ---
server.tool(
  "update_issue",
  "Update an existing issue — change name, description, priority, state, or assignees.",
  {
    issueId: z.string().describe("Issue UUID"),
    name: z.string().optional().describe("New title"),
    description: z.string().optional().describe("New description (plain text)"),
    priority: z.enum(["urgent", "high", "medium", "low", "none"]).optional(),
    stateId: z.string().optional().describe("New state UUID"),
    assigneeIds: z.array(z.string()).optional().describe("New assignee UUIDs (replaces existing)"),
  },
  async ({ issueId, ...fields }) => {
    await plane.updateIssue(issueId, fields);
    return { content: [{ type: "text", text: `Issue ${issueId} updated successfully.` }] };
  }
);

// --- MOVE TO MODULE ---
server.tool(
  "move_to_module",
  "Move an issue to a module (e.g. Pipeline, Produksi, Selesai).",
  {
    issueId: z.string().describe("Issue UUID"),
    moduleId: z.string().describe("Module UUID"),
  },
  async ({ issueId, moduleId }) => {
    await plane.moveToModule(issueId, moduleId);
    return { content: [{ type: "text", text: `Issue moved to module ${moduleId}.` }] };
  }
);

// --- LIST MODULES ---
server.tool(
  "list_modules",
  "List all modules in the project (Pipeline, Produksi, Selesai, etc.).",
  {},
  async () => {
    const modules = await plane.listModules();
    const text = modules.map((m) => `${m.name} | id: ${m.id}`).join("\n");
    return { content: [{ type: "text", text }] };
  }
);

// --- LIST MEMBERS ---
server.tool(
  "list_members",
  "List all project members — useful to get IDs for assignment.",
  {},
  async () => {
    const members = await plane.listMembers();
    const text = members.map((m) => `${m.name} (${m.email}) | id: ${m.id}`).join("\n");
    return { content: [{ type: "text", text }] };
  }
);

// --- LIST STATES ---
server.tool(
  "list_states",
  "List all available states in the project (Todo, In Progress, Done, etc.).",
  {},
  async () => {
    const states = await plane.listStates();
    const text = states.map((s) => `${s.name} [${s.group}] | id: ${s.id}`).join("\n");
    return { content: [{ type: "text", text }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
