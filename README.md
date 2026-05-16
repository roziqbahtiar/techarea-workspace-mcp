# techarea-workspace-mcp

MCP Server untuk menghubungkan AI coding tools (Claude Code, Cursor, Windsurf, Gemini CLI, OpenCode) ke Plane workspace Techarea.

## Tools yang Tersedia

| Tool | Fungsi |
|------|--------|
| `list_issues` | Lihat semua issue, bisa filter per module |
| `get_issue` | Detail satu issue |
| `create_issue` | Buat issue baru langsung dari terminal |
| `update_issue` | Update nama, status, assignee, priority |
| `move_to_module` | Pindah issue ke Pipeline / Produksi / Selesai |
| `list_modules` | Lihat semua module + ID-nya |
| `list_members` | Lihat semua member + ID untuk assign |
| `list_states` | Lihat semua state (Todo, In Progress, Done) |

---

## Cara Install

### 1. Clone repo & install dependencies

```bash
git clone git@github.com:roziqbahtiar/techarea-workspace-mcp.git
cd techarea-workspace-mcp
npm install
```

### 2. Dapatkan API Key

Buat API key masing-masing di Plane:
```
workspace.techarea.co.id → Profile → Settings → API Tokens → Add Token
```

Dapatkan Project ID dari URL saat buka project:
```
workspace.techarea.co.id/techarea-indonesia/projects/[PROJECT_ID]/issues/
```

### 3. Setup config di tool masing-masing

Tambahkan config berikut ke settings tool yang kamu pakai. Ganti `PATH_KE_FOLDER`, `PROJECT_ID`, dan `API_KEY` sesuai milikmu.

---

#### Claude Code

Edit file `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "techarea-workspace": {
      "command": "node",
      "args": ["/PATH_KE_FOLDER/techarea-workspace-mcp/src/index.js"],
      "env": {
        "PLANE_BASE_URL": "https://workspace.techarea.co.id",
        "PLANE_WORKSPACE": "techarea-indonesia",
        "PLANE_PROJECT_ID": "YOUR_PROJECT_ID",
        "PLANE_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

---

#### Cursor

Buat file `.cursor/mcp.json` di root project:

```json
{
  "mcpServers": {
    "techarea-workspace": {
      "command": "node",
      "args": ["/PATH_KE_FOLDER/techarea-workspace-mcp/src/index.js"],
      "env": {
        "PLANE_BASE_URL": "https://workspace.techarea.co.id",
        "PLANE_WORKSPACE": "techarea-indonesia",
        "PLANE_PROJECT_ID": "YOUR_PROJECT_ID",
        "PLANE_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

---

#### Windsurf

Buat file `.windsurf/mcp.json` di root project:

```json
{
  "mcpServers": {
    "techarea-workspace": {
      "command": "node",
      "args": ["/PATH_KE_FOLDER/techarea-workspace-mcp/src/index.js"],
      "env": {
        "PLANE_BASE_URL": "https://workspace.techarea.co.id",
        "PLANE_WORKSPACE": "techarea-indonesia",
        "PLANE_PROJECT_ID": "YOUR_PROJECT_ID",
        "PLANE_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

---

#### Gemini CLI

Edit file `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "techarea-workspace": {
      "command": "node",
      "args": ["/PATH_KE_FOLDER/techarea-workspace-mcp/src/index.js"],
      "env": {
        "PLANE_BASE_URL": "https://workspace.techarea.co.id",
        "PLANE_WORKSPACE": "techarea-indonesia",
        "PLANE_PROJECT_ID": "YOUR_PROJECT_ID",
        "PLANE_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

---

#### OpenCode

Buat file `opencode.json` di root project:

```json
{
  "mcp": {
    "techarea-workspace": {
      "command": "node",
      "args": ["/PATH_KE_FOLDER/techarea-workspace-mcp/src/index.js"],
      "env": {
        "PLANE_BASE_URL": "https://workspace.techarea.co.id",
        "PLANE_WORKSPACE": "techarea-indonesia",
        "PLANE_PROJECT_ID": "YOUR_PROJECT_ID",
        "PLANE_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

---

#### VS Code (via Cline atau Continue.dev)

Install extension **Cline** atau **Continue.dev** dari VS Code marketplace, lalu tambahkan config MCP yang sama seperti di atas sesuai petunjuk extension masing-masing.

---

### 4. Restart tool, langsung bisa dipakai

Contoh perintah natural yang bisa digunakan:

```
"lihat semua issue di project ini"
"bikin issue baru: bug di halaman login, priority high"
"pindahin issue abc ke module Produksi"
"assign issue xyz ke sera"
"lihat semua member project"
"ganti status issue abc jadi In Progress"
```

---

## Switch Antar Project

Ganti `PLANE_PROJECT_ID` di config untuk berpindah ke project yang berbeda. Tiap developer bisa setup project ID masing-masing sesuai yang sedang dikerjakan.

## Kompatibilitas

| Tool | Support |
|------|---------|
| Claude Code | ✅ |
| Cursor | ✅ |
| Windsurf | ✅ |
| Gemini CLI | ✅ |
| OpenCode | ✅ |
| Cline (VS Code) | ✅ |
| Continue.dev (VS Code) | ✅ |
| GitHub Copilot | ❌ |
