# AGENTS.md — Cloud Moves

## Project Summary

Serverless PWA for personnel availability, leave records, and calendar events. Frontend hosted on GitHub Pages (vanilla JS + TailwindCSS CDN). Backend is Google Apps Script acting as a REST API. Data stored in Google Sheets, Contacts, Calendar, and Gmail.

## Repo Structure

```
backend/          # Google Apps Script source (.js files → .gs in GAS editor)
frontend/         # Static PWA (HTML, CSS, vanilla JS)
frontend/js/core/     # app.js (entry), api.js, auth.js, state.js, config.js
frontend/js/features/ # Dashboard, calendar, parade state rendering
frontend/js/ui/       # Form rendering, date picker
frontend/js/admin/    # Admin settings, KAH, org structure
docs/             # Architecture, setup, API reference, user/admin guides
.github/workflows/deploy.yml  # CI/CD: clasp push + deploy on backend/ changes
```

## Developer Commands

There is **no build system, no npm, no test framework, no linter**. This is a vanilla static frontend + Google Apps Script backend.

- **Frontend**: Open `frontend/index.html` directly in a browser or serve via any static server.
- **Backend changes**: Push to `main` branch → GitHub Actions auto-deploys via Clasp (only triggers on `backend/` path changes).
- **Manual backend deploy**: Requires `@google/clasp` installed, `~/.clasprc.json` credentials, and `.clasp.json` with `scriptId` and `rootDir: "backend"`. Then `clasp push --force && clasp deploy -i <DEPLOYMENT_ID>`.

## Environment Switching

Three separate environments, each with its own GAS project and Sheet. Switch by editing `frontend/js/core/config.js`:

```js
const ENV = 'Exp';  // 'Exp' | 'Dev' | 'Prod'
```

The `ENV` constant selects the corresponding `*_URL`. The frontend is a single codebase; only this constant changes between environments.

## Backend File Mapping

Repo `.js` files map to Google Apps Script `.gs` files (same name, different extension):

| Repo file | GAS file |
|-----------|----------|
| `backend/Code.js` | `Code.gs` (router, INITIAL_SETUP, schema verification) |
| `backend/Auth.js` | `Auth.gs` (login, Contacts integration) |
| `backend/Leaves.js` | `Leaves.gs` (leave CRUD, KAH limit checking) |
| `backend/Calendar.js` | `Calendar.gs` (Calendar event creation) |
| `backend/Settings.js` | `Settings.gs` (admin settings, unit management, contact sync) |

## API Contract

Single POST endpoint (GAS Web App URL). All requests use:
```json
{ "action": "<action>", "data": { ... }, "credentials": { "phone": "...", "pass": "..." } }
```
Content-Type: `text/plain`. See `docs/api-reference.md` for all actions.

## Authentication

- **Admin**: Password stored in GAS `PropertiesService`. Default: `P@ssw0rd` (change after first login).
- **User**: `{phone_number}{keyword}` (e.g., `12345678peace`). Keyword is configurable in admin settings.
- **Session**: User object stored in `localStorage`. Every API call sends credentials.

## CI/CD Secrets Required

GitHub repo secrets for `.github/workflows/deploy.yml`:
- `CLASP_CREDS` — JSON from `~/.clasprc.json`
- `SCRIPT_ID` — Apps Script project ID
- `DEPLOYMENT_ID` — Web App deployment ID (keeps URL stable across deploys)

## Key Gotchas

- **GAS People API**: Must be enabled as an advanced service in the Apps Script project (see `appsscript.json` dependencies).
- **Contacts propagation delay**: Google Contacts takes ~1 minute to reflect new users.
- **INITIAL_SETUP**: Must be run manually once from the GAS editor to create the `Company_Leaves_DB` sheet and default properties.
- **clasp push --force**: Overwrites the GAS editor completely. The deploy workflow uses `--force`.
- **No local test infrastructure**: Verification is done by deploying and testing in the browser against the live GAS endpoint.

## Docs Reference

| Document | Path |
|----------|------|
| Architecture | `docs/architecture.md` |
| Setup Guide | `docs/setup-guide.md` |
| API Reference | `docs/api-reference.md` |
| User Guide | `docs/user-guide.md` |
| Admin Guide | `docs/admin-guide.md` |
| Maintenance | `docs/maintenance.md` |
