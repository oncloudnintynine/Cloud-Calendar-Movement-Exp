# Maintenance

This guide covers ongoing operations, updates, and troubleshooting for Cloud Moves. It is intended for the person who deployed and administers the system.

## Updating the Frontend

### Making UI changes

The frontend uses TailwindCSS utility classes. UI changes are made by editing the HTML template strings in:

- `js/ui/ui.js` -- shared UI components
- `js/ui/picker.js` -- date/time picker
- `js/ui/forms.js` -- form rendering
- `js/features/calendar.js` -- dashboard and calendar rendering
- `js/features/parade.js` -- parade state rendering
- `js/admin/admin.js` -- admin settings
- `js/admin/structure.js` -- organizational structure UI

### Cache busting

Because the app is a PWA, browsers cache JavaScript files aggressively. After pushing frontend changes:

1. Open `frontend/index.html` and increment the version query parameter on each script tag (e.g., change `?v=55` to `?v=56`)
2. Open `frontend/sw.js` and increment the `CACHE_NAME` value by the same amount
3. Commit and push

Users will receive the updated files on their next page load.

## Updating the Backend

### Making backend changes

Edit the files in the `backend/` directory. When you push changes to the `main` branch, the CI/CD pipeline automatically deploys them to Google Apps Script.

### Adding new data fields

If you add new columns to the leave/event record:

1. Add the field to the `INITIAL_SETUP` function in `Code.js` (the `sheet.appendRow` call)
2. Add a corresponding check in the `verifySchema` function in `Code.js` so existing sheets get the new column automatically
3. Update `submitLeave` and `editLeave` in `Leaves.js` to read and write the new field
4. Update the frontend form and display logic to handle the new field

### Testing backend changes

Use the three-environment model to test safely:

1. Make changes in the Experimental environment first
2. Verify functionality
3. Push to Development for staging
4. Push to Production when ready

Toggle the `ENV` constant in `frontend/js/core/config.js` to point to the appropriate backend URL.

## CI/CD Troubleshooting

### Workflow not triggering

- Verify the push was to the `main` branch
- Verify the changes were in the `backend/` directory (the workflow has a `paths` filter)
- Check that GitHub Actions is enabled for the repository

### Clasp push fails

- **Expired credentials**: Regenerate Clasp credentials (see [Setup Guide](setup-guide.md), Step 3) and update the `CLASP_CREDS` secret
- **Wrong Script ID**: Verify the `SCRIPT_ID` secret matches your Apps Script project
- **Wrong Deployment ID**: Verify the `DEPLOYMENT_ID` secret matches your current deployment

### Deployment ID mismatch

If the deployment was manually recreated in the Apps Script editor, the old Deployment ID is invalid. Update the `DEPLOYMENT_ID` secret and also update `frontend/js/core/config.js` with the new Web App URL.

## Google Contact Sync Issues

### User not appearing

1. Verify the user's phone number in Google Contacts matches the registered number (last 8 digits are used for matching)
2. Wait approximately one minute for Google to sync new contacts
3. If the user was just registered, try logging in again after waiting

### Unit names are incorrect or corrupted

Use the **Force Sync G-Contacts** button in the Organisational Structure admin tab. This overwrites Google Contacts with the app's current state.

### Contacts not reflecting department changes

The app reads department assignments from Google Contact Groups. If a user's department is wrong:

1. Go to Organisational Structure
2. Reassign the user to the correct unit
3. Click **Save** to push the changes to Google Contacts

## Fail-Safe Code Backup

If the CI/CD pipeline fails and you cannot deploy backend changes:

1. In Admin Settings, use the **Code Backup** feature to save the current GitHub repository code to a Google Doc in your Drive
2. Use the [Fail-Safe Code Updater](https://oncloudnintynine.github.io/Fail-Safe-Code-Updater/) tool to manually paste the backup content into the Apps Script editor

This is a manual override for situations where Clasp credentials have expired and cannot be quickly regenerated.

## Security

### Default password

The default admin password is `P@ssw0rd`. Change it immediately after first login via Admin Settings.

### Backend access

The Apps Script Web App is deployed with "Who has access: Anyone". This is required for the frontend to communicate with it. The application handles its own authentication. Ensure the admin password is strong and not shared broadly.

### Google account security

The backend runs under the Google account that deployed it ("Execute as: Me"). That account must have access to:

- Google Sheets (to read/write the database)
- Google Contacts (to manage the user directory)
- Google Calendar (to create events)
- Gmail (to send KAH notifications)
- Google Drive (to store the database and backups)

If this account's access is revoked or the password changes, the backend will stop working.

### Clasp credentials

The `CLASP_CREDS` secret contains OAuth tokens for your Google account. Treat it as sensitive. If compromised, regenerate it and update the GitHub secret.

## Database Maintenance

### Sheet schema drift

If columns are manually added or removed from the Google Sheet, run `verifySchema` by re-running `INITIAL_SETUP` in the Apps Script editor. This adds any missing columns.

### Record cleanup

Old records are not automatically deleted. Periodically review the Google Sheet and remove records that are no longer needed. Cancelled records are filtered out of the dashboard but remain in the sheet.

### Backup the database

The Google Sheet is stored in Google Drive. Use Google Drive's version history or make periodic copies to protect against accidental data loss.

## PropertiesService Reset

If configuration becomes corrupted, you can reset individual properties:

1. Open the Apps Script editor
2. Go to **Project Settings** > **Script Properties**
3. Delete the problematic property
4. Re-run `INITIAL_SETUP` to restore the default value, or set it manually via Admin Settings
