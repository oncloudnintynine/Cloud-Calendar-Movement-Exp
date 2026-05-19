# Cloud Moves

Cloud Moves is a serverless Progressive Web App (PWA) for managing organizational personnel availability, leave records, and calendar events. It tracks who is in the office, who is on leave, and enforces Key Appointment Holder (KAH) availability constraints.

**Live demo**: <https://oncloudnintynine.github.io/Cloud-Calendar-Movement-Exp/frontend>

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

## Quick Start for Deployers

1. Create a Google Apps Script project and enable the People API
2. Import the `backend/` files and run `INITIAL_SETUP`
3. Deploy as a Web App (Execute as: Me, Access: Anyone)
4. Point `frontend/js/core/config.js` to your deployment URL
5. Push to GitHub Pages

See the full [Setup Guide](docs/setup-guide.md) for detailed steps.

---

## Architecture

- **Frontend**: HTML5, TailwindCSS (CDN), Vanilla JavaScript. Hosted on GitHub Pages as a PWA.
- **Backend**: Google Apps Script acting as a serverless REST API.
- **Data layer**: Google Sheets (leave/event records), Google Contacts (user directory and organizational structure), Google Calendar (event visualization), Gmail (KAH limit notifications).
- **Environments**: Three separate environments (Experimental, Development, Production) managed by separate GitHub repositories.
- **CI/CD**: GitHub Actions using Google Clasp to auto-deploy backend changes on push.

See [Architecture](docs/architecture.md) for details.

---

## Key Features

### For Personnel
- Submit leave and event records with a unified form
- View personal calendar with agenda and month views
- See real-time parade state (who is in the office vs. away)
- Edit or cancel your own records

### For Administrators
- Manage organizational hierarchy (N-tier unit structure)
- Register and manage users via Google Contacts
- Configure KAH limits and receive email alerts when thresholds are crossed
- Customize event types, calendar templates, and acronym shortforms
- Reorganize menu layout and admin section order
- Force-sync Google Contacts to resolve drift

See the [User Guide](docs/user-guide.md) and [Admin Guide](docs/admin-guide.md) for details.

---

## Security

- The default administrator password is `P@ssw0rd`. **Change it immediately after first login.**
- The backend is deployed with "Execute as: Me" so all Google Workspace operations run under the deployer's account.
- Authentication is handled by the application itself (not Google OAuth). Users log in with their phone number plus a configurable keyword.

---

## License

This project is provided as-is for organizational use.
