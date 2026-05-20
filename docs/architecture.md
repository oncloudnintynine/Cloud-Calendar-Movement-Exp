# Architecture

Cloud Moves is a serverless application that uses Google Workspace as its entire infrastructure. There are no dedicated servers, databases, or hosting costs beyond a Google account.

## Table of Contents

- [System Overview](#system-overview)
- [Components](#components)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Data Layer](#data-layer)
- [Data Flow](#data-flow)
- [Environment Model](#environment-model)
- [CI/CD Pipeline](#ci/cd-pipeline)
- [Authentication Model](#authentication-model)

## System Overview

```
  Browser (PWA)                    Google Workspace
  ┌──────────────┐                 ┌──────────────────────────┐
  │  GitHub Pages│                 │  Google Apps Script      │
  │  (Frontend)  │──── POST ────▶ │  (REST API / Backend)    │
  │              │◀──── JSON ──── │                          │
  └──────────────┘                 └──────┬───────┬───────┬───┘
                                          │       │       │
                                    ┌─────┴─┐ ┌──┴──┐ ┌──┴──────┐
                                    │Sheets │ │Contacts│ │Calendar │
                                    │ (DB)  │ │(Dir) │ │(Events) │
                                    └───────┘ └──────┘ └─────────┘
```

## Components

### Frontend

| Layer | Technology | Purpose |
|-------|------------|---------|
| Hosting | GitHub Pages | Static file serving with PWA support |
| UI framework | TailwindCSS (CDN) | Utility-first CSS styling |
| Search | Fuse.js | Fuzzy search for contacts and records |
| Drag-and-drop | SortableJS | Reorderable admin lists |
| Service Worker | Custom (`sw.js`) | Offline caching and PWA installability |

The frontend is organized into four modules:

| Directory | Purpose |
|-----------|---------|
| `js/core/` | Application initialization, API communication, state, auth |
| `js/features/` | Dashboard/calendar rendering, parade state logic |
| `js/ui/` | Form rendering, date picker components |
| `js/admin/` | Admin settings, KAH management, organizational structure |

### Backend

The backend is a Google Apps Script project split across five files:

| File | Purpose |
|------|---------|
| `Code.js` | Request router, `INITIAL_SETUP`, schema verification, acronym processing |
| `Auth.js` | Login handling, Google Contacts integration, user registration and management |
| `Leaves.js` | CRUD operations for leave/event records, KAH limit checking |
| `Calendar.js` | Google Calendar event creation (single and recurring) |
| `Settings.js` | Admin settings read/write, unit management, contact sync |

### Data Layer

| Service | Role | Details |
|---------|------|---------|
| Google Sheets | Primary database | Single sheet (`Company_Leaves_DB`) stores all leave/event records |
| Google Contacts | User directory | Contacts represent registered users; Contact Groups represent organizational units |
| Google Calendar | Event visualization | One calendar per department/unit; events created from leave records |
| Gmail | Notifications | KAH limit breach alerts sent to the approving authority |
| Google Drive | Storage | The spreadsheet and backup documents are stored here |
| PropertiesService | Configuration | Script properties store settings (passwords, KAH lists, templates, etc.) |

## Data Flow

### User submits a leave or event

1. User fills out the form in the browser
2. Frontend sends a POST request to the Apps Script Web App URL with `{ action: "submitLeave", data: {...}, credentials: {...} }`
3. Backend validates credentials, checks KAH limits, creates Google Calendar events, and appends a row to the Google Sheet
4. Backend returns `{ success: true, data: { status: "..." } }`
5. Frontend updates the UI and reloads the dashboard

### User views the dashboard

1. Frontend calls `getLeaves` to fetch all records from the Google Sheet
2. Records are filtered by department, search query, and user ownership
3. The agenda or month view is rendered client-side from the filtered data
4. Scrolling the agenda automatically syncs the mini-calendar to the visible date

### Parade state rendering

1. Frontend calls `getSettings` which returns all contacts and their group memberships
2. Contacts are organized into an N-tier tree based on their unit path (e.g., `HQ-OPS-ALPHA`)
3. Each contact is checked against active leave records to determine if they are in the office
4. The tree is rendered with color-coded status (green = in office, orange = away) and KAH indicators

## Environment Model

Three fully separate environments exist, each with its own GitHub repository, Apps Script project, and Google Sheet:

| Environment | Purpose | Config value |
|-------------|---------|--------------|
| Experimental | Testing new features before they reach development | `ENV = 'Exp'` |
| Development | Staging area for changes before production | `ENV = 'Dev'` |
| Production | Live system used by personnel | `ENV = 'Prod'` |

Each environment has its own API URL configured in `frontend/js/core/config.js`. The frontend is a single codebase; switching environments only requires changing the `ENV` constant.

## CI/CD Pipeline

```
  Developer pushes to main
          │
          ▼
   GitHub Actions (deploy.yml)
          │
          ├── Install @google/clasp
          ├── Inject CLASP_CREDS secret
          ├── Generate .clasp.json with SCRIPT_ID
          ├── clasp push --force (overwrite GAS editor)
          └── clasp deploy -i DEPLOYMENT_ID (new version, same URL)
```

The workflow triggers only on changes to the `backend/` directory. The frontend is deployed separately through GitHub Pages.

## Authentication Model

The application implements its own authentication layer rather than using Google OAuth:

- **Admin**: Logs in with a password stored in `PropertiesService`. Default is `P@ssw0rd`.
- **User**: Logs in with `{phone_number}{keyword}` (e.g., `12345678peace`). The keyword is configurable in admin settings.
- **Credential verification**: Every authenticated API call includes `{ phone, pass }` in the `credentials` field. The backend validates against the admin password or looks up the phone number in Google Contacts.
- **Session persistence**: The user object is stored in `localStorage` and survives page refreshes.

## See Also

- [Setup Guide](./setup-guide.md) — Deploy Cloud Moves from scratch
- [API Reference](./api-reference.md) — Backend action endpoints and schemas
- [Maintenance](./maintenance.md) — Ongoing operations and troubleshooting
