# Setup Guide

This guide walks you through deploying Cloud Moves from scratch. It is intended for the person who will administer the system for their organization.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Step 1: Create the Backend](#step-1-create-the-backend)
  - [1.1 Create the Apps Script Project](#11-create-the-apps-script-project)
  - [1.2 Enable the People API](#12-enable-the-people-api)
  - [1.3 Import the Backend Code](#13-import-the-backend-code)
  - [1.4 Initialize the Database](#14-initialize-the-database)
  - [1.5 Deploy as a Web App](#15-deploy-as-a-web-app)
- [Step 2: Configure the Frontend](#step-2-configure-the-frontend)
  - [2.1 Set the API Endpoint](#21-set-the-api-endpoint)
  - [2.2 Deploy to GitHub Pages](#22-deploy-to-github-pages)
- [Step 3: Set Up CI/CD](#step-3-set-up-cicd)
  - [3.1 Generate Clasp Credentials](#31-generate-clasp-credentials)
  - [3.2 Retrieve Project IDs](#32-retrieve-project-ids)
  - [3.3 Configure GitHub Secrets](#33-configure-github-secrets)
  - [3.4 How It Works](#34-how-it-works)
- [Step 4: Initial Configuration](#step-4-initial-configuration)
- [Verification](#verification)

## Prerequisites

- A Google Workspace account (personal Gmail accounts also work)
- A GitHub account
- Access to Google Apps Script, Google Sheets, Google Contacts, and Google Calendar

## Step 1: Create the Backend

### 1.1 Create the Apps Script Project

1. Go to [script.google.com](https://script.google.com/) and create a **New Project**
2. Name it `Cloud Moves Backend`

### 1.2 Enable the People API

1. In the left sidebar, click **Services** (the `+` icon)
2. Find and add the **People API**

### 1.3 Import the Backend Code

1. In the Apps Script editor, create the following files with exact names (note the `.gs` extension):

   | File in repo | Create as |
   |--------------|-----------|
   | `backend/Code.js` | `Code.gs` |
   | `backend/Auth.js` | `Auth.gs` |
   | `backend/Leaves.js` | `Leaves.gs` |
   | `backend/Calendar.js` | `Calendar.gs` |
   | `backend/Settings.js` | `Settings.gs` |

2. Copy the contents of each `.js` file into the corresponding `.gs` file
3. Open project settings (gear icon) and enable **Show "appsscript.json" manifest file in editor**
4. Replace the contents of `appsscript.json` with the version from `backend/appsscript.json` in this repository

### 1.4 Initialize the Database

1. Open `Code.gs` in the Apps Script editor
2. Select `INITIAL_SETUP` from the function dropdown in the toolbar
3. Click **Run**
4. When prompted, click **Review Permissions**, select your Google account, click **Advanced**, and proceed

This creates a Google Sheet named `Company_Leaves_DB` in your Drive and sets all default configuration properties.

### 1.5 Deploy as a Web App

1. Click **Deploy** (top right) > **New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Configure as follows:

   | Setting | Value |
   |---------|-------|
   | Description | `Initial Deployment` |
   | Execute as | **Me** |
   | Who has access | **Anyone** |

4. Click **Deploy**
5. **Copy the Web App URL and the Deployment ID.** You will need both.

## Step 2: Configure the Frontend

### 2.1 Set the API Endpoint

1. Open `frontend/js/core/config.js` in your editor
2. Replace the URL values with your Web App URL:

   ```javascript
   const ENV = 'Exp';

   const EXP_URL = 'YOUR_EXPERIMENTAL_WEB_APP_URL';
   const DEV_URL = 'YOUR_DEVELOPMENT_WEB_APP_URL';
   const PROD_URL = 'YOUR_PRODUCTION_WEB_APP_URL';
   ```

3. Set `ENV` to the environment you are configuring (`'Exp'`, `'Dev'`, or `'Prod'`)

### 2.2 Deploy to GitHub Pages

1. Push your code to a GitHub repository
2. Go to repository **Settings** > **Pages**
3. Set the source to deploy from the `main` branch, root directory
4. The app will be available at `https://[your-username].github.io/[repo-name]/frontend/`

## Step 3: Set Up CI/CD

This step enables automatic backend deployment when you push changes to the `backend/` directory.

### 3.1 Generate Clasp Credentials

You can do this in GitHub Codespaces without installing anything locally:

1. On your GitHub repository page, click **Code** > **Codespaces** > **Create codespace on main**
2. In the terminal, run:

   ```bash
   npm install -g @google/clasp
   clasp login --no-localhost
   ```

3. Open the URL provided in the terminal, log in with the Google account that owns the Apps Script project, and click **Allow**
4. Copy the redirect URL, paste it back into the terminal, and press Enter
5. Run `cat ~/.clasprc.json` and copy the entire JSON output
6. Close and delete the Codespace

### 3.2 Retrieve Project IDs

- **Script ID**: Found in Apps Script project settings (gear icon) under "IDs"
- **Deployment ID**: Found via Deploy > Manage deployments

### 3.3 Configure GitHub Secrets

Go to your repository **Settings** > **Secrets and variables** > **Actions** and add:

| Secret name | Value |
|-------------|-------|
| `CLASP_CREDS` | The JSON from `~/.clasprc.json` |
| `SCRIPT_ID` | Your Apps Script project ID |
| `DEPLOYMENT_ID` | Your Web App deployment ID |

### 3.4 How It Works

When you push changes to the `backend/` directory on the `main` branch, GitHub Actions runs `.github/workflows/deploy.yml`, which:

1. Installs Clasp
2. Injects your credentials
3. Pushes the code to the Apps Script editor (overwriting existing code)
4. Creates a new deployment version using the same Deployment ID (so the Web App URL never changes)

## Step 4: Initial Configuration

1. Open your frontend URL in a browser
2. Log in with the default admin password: `P@ssw0rd`
3. Go to **Menu** > **Admin Settings** and:
   - Change the admin password
   - Set the user login keyword (e.g., `peace`)
   - Build your organizational structure
   - Register your first batch of users

Google Contacts may take approximately one minute to reflect new users.

## Verification

After setup, verify the following:

- [ ] You can log in as admin
- [ ] You can register a user and log in as that user
- [ ] Submitting a leave creates a row in the Google Sheet
- [ ] A calendar event appears on the department calendar
- [ ] The dashboard displays the record
- [ ] Pushing a change to `backend/` triggers the GitHub Actions workflow

## See Also

- [Architecture](./architecture.md) — System overview and data flow
- [Admin Guide](./admin-guide.md) — Post-deployment configuration
- [Maintenance](./maintenance.md) — Ongoing operations and troubleshooting
