# Cloud Moves

A serverless Progressive Web App (PWA) for managing organizational personnel availability, leave records, and calendar events. Tracks who is in the office, who is on leave, and enforces Key Appointment Holder (KAH) availability constraints.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-Enabled-success)](https://web.dev/pwa-check/)
[![Frontend](https://img.shields.io/badge/Frontend-GitHub%20Pages-lightgrey)](https://oncloudnintynine.github.io/Cloud-Calendar-Movement-Exp/frontend)

---

## Quick Links

| Resource | Link |
|----------|------|
| **Live Demo** | [oncloudnintynine.github.io/Cloud-Calendar-Movement-Exp/frontend](https://oncloudnintynine.github.io/Cloud-Calendar-Movement-Exp/frontend) |
| **Setup Guide** | [docs/setup-guide.md](docs/setup-guide.md) |
| **Architecture** | [docs/architecture.md](docs/architecture.md) |
| **API Reference** | [docs/api-reference.md](docs/api-reference.md) |
| **User Guide** | [docs/user-guide.md](docs/user-guide.md) |
| **Admin Guide** | [docs/admin-guide.md](docs/admin-guide.md) |
| **Maintenance** | [docs/maintenance.md](docs/maintenance.md) |

---

## Overview

Cloud Moves runs entirely on Google Workspace with zero infrastructure costs:

- **Frontend**: Vanilla JavaScript, TailwindCSS (CDN), hosted as a PWA on GitHub Pages
- **Backend**: Google Apps Script acting as a serverless REST API
- **Data**: Google Sheets (database), Google Contacts (directory), Google Calendar (events), Gmail (notifications)

### Key Features

#### For Personnel
- Submit leave and event records with a unified or classic form
- View personal calendar with agenda and month views
- See real-time parade state (who is in the office vs. away)
- Edit or cancel your own records

#### For Administrators
- Manage organizational hierarchy (N-tier unit structure)
- Register and manage users via Google Contacts
- Configure KAH limits and receive email alerts when thresholds are crossed
- Customize event types, calendar templates, and acronym shortforms
- Reorganize menu layout and admin section order
- Force-sync Google Contacts to resolve drift

See the [User Guide](docs/user-guide.md) and [Admin Guide](docs/admin-guide.md) for details.

---

## Quick Start for Deployers

1. Create a Google Apps Script project and enable the People API
2. Import the `backend/` files and run `INITIAL_SETUP`
3. Deploy as a Web App (Execute as: Me, Access: Anyone)
4. Point `frontend/js/core/config.js` to your deployment URL
5. Push to GitHub Pages

See the full [Setup Guide](docs/setup-guide.md) for detailed steps.

---

## Architecture

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

**Environments**: Three separate environments (Experimental, Development, Production) managed by separate repositories. Toggle the `ENV` constant in `frontend/js/core/config.js` to switch.

**CI/CD**: GitHub Actions auto-deploys backend changes on push using Google Clasp. Frontend is deployed via GitHub Pages.

See [Architecture](docs/architecture.md) for a complete breakdown.

---

## Documentation

| Audience | Document | Description |
|----------|----------|-------------|
| Everyone | [Architecture](docs/architecture.md) | System overview, tech stack, data flow |
| Deployers | [Setup Guide](docs/setup-guide.md) | Deploy from scratch: backend, frontend, CI/CD |
| Developers | [API Reference](docs/api-reference.md) | Backend actions, request/response schemas |
| End users | [User Guide](docs/user-guide.md) | How to use the app as personnel |
| Admins | [Admin Guide](docs/admin-guide.md) | Configuration, KAH management, org structure |
| Maintainers | [Maintenance](docs/maintenance.md) | Updates, troubleshooting, backups |

---

## Contributing

This project is organized for organizational use. If you are setting up a new instance:

1. Follow the [Setup Guide](docs/setup-guide.md) to deploy your own backend and frontend
2. Review the [Architecture](docs/architecture.md) to understand the data flow
3. Use the three-environment model (Experimental → Development → Production) for safe changes
4. See [Maintenance](docs/maintenance.md) for update procedures and troubleshooting

---

## Security

> **The default administrator password is `P@ssw0rd`. Change it immediately after first login.**

- The backend is deployed with "Execute as: Me" so all Google Workspace operations run under the deployer's account
- Authentication is application-level (not Google OAuth). Users log in with their phone number plus a configurable keyword
- The `CLASP_CREDS` GitHub secret contains sensitive OAuth tokens. Regenerate and rotate if compromised

See [Maintenance — Security](docs/maintenance.md#security) for full details.

---

## License

This project is provided as-is for organizational use.
