const BASE_URL = process.env.PLANE_BASE_URL || "https://api.plane.so";
const WORKSPACE = process.env.PLANE_WORKSPACE;
const PROJECT_ID = process.env.PLANE_PROJECT_ID;
const API_KEY = process.env.PLANE_API_KEY;

function validateEnv() {
  const missing = ["PLANE_WORKSPACE", "PLANE_PROJECT_ID", "PLANE_API_KEY"].filter(
    (k) => !process.env[k]
  );
  if (missing.length) throw new Error(`Missing env vars: ${missing.join(", ")}`);
}

async function request(method, path, body) {
  validateEnv();
  const url = `${BASE_URL}/api/v1/workspaces/${WORKSPACE}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      "X-API-Key": API_KEY,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function listIssues({ stateGroup, moduleId } = {}) {
  const params = new URLSearchParams({ per_page: "50" });
  if (stateGroup) params.set("group_by", "state__group");

  const data = await request("GET", `/projects/${PROJECT_ID}/issues/?${params}`);
  let issues = data.results || [];

  if (moduleId) {
    const mod = await request("GET", `/projects/${PROJECT_ID}/modules/${moduleId}/module-issues/`);
    const modIds = new Set((mod.results || []).map((i) => i.issue));
    issues = issues.filter((i) => modIds.has(i.id));
  }

  return issues.map((i) => ({
    id: i.id,
    name: i.name,
    priority: i.priority,
    state: i.state,
    assignees: i.assignees,
    sequence_id: i.sequence_id,
  }));
}

export async function getIssue(issueId) {
  return request("GET", `/projects/${PROJECT_ID}/issues/${issueId}/`);
}

export async function createIssue({ name, description, priority, stateId, assigneeIds }) {
  const body = { name, priority: priority || "none" };
  if (description) body.description_html = `<p>${description}</p>`;
  if (stateId) body.state = stateId;
  if (assigneeIds?.length) body.assignees = assigneeIds;
  return request("POST", `/projects/${PROJECT_ID}/issues/`, body);
}

export async function updateIssue(issueId, { name, description, priority, stateId, assigneeIds }) {
  const body = {};
  if (name) body.name = name;
  if (description) body.description_html = `<p>${description}</p>`;
  if (priority) body.priority = priority;
  if (stateId) body.state = stateId;
  if (assigneeIds) body.assignees = assigneeIds;
  return request("PATCH", `/projects/${PROJECT_ID}/issues/${issueId}/`, body);
}

export async function moveToModule(issueId, moduleId) {
  return request("POST", `/projects/${PROJECT_ID}/modules/${moduleId}/module-issues/`, {
    issues: [issueId],
  });
}

export async function listModules() {
  const data = await request("GET", `/projects/${PROJECT_ID}/modules/`);
  const modules = Array.isArray(data) ? data : data.results || [];
  return modules.map((m) => ({ id: m.id, name: m.name, status: m.status }));
}

export async function listMembers() {
  const data = await request("GET", `/projects/${PROJECT_ID}/members/`);
  const members = Array.isArray(data) ? data : data.results || [];
  return members.map((m) => {
    const member = m.member || m;
    return {
      id: member.id,
      name: member.display_name || `${member.first_name} ${member.last_name}`.trim(),
      email: member.email,
    };
  });
}

export async function listStates() {
  const data = await request("GET", `/projects/${PROJECT_ID}/states/`);
  const states = Array.isArray(data) ? data : data.results || [];
  return states.map((s) => ({ id: s.id, name: s.name, group: s.group }));
}
