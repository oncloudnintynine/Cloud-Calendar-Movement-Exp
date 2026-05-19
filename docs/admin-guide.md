# Admin Guide

This guide covers administrative configuration and management tasks. For end-user instructions, see the [User Guide](user-guide.md).

## Accessing Admin Settings

1. Log in with the admin password
2. Open the **Menu** (hamburger icon)
3. Select **Admin Settings**

Admin-only menu items are separated by a divider at the bottom of the menu.

## Admin Settings Sections

### App Mode

Controls whether users see a unified **Add Event / Leave** form (`combined`) or separate classic forms (`classic`).

### Register User

Register a new user manually:

1. Enter the user's full name
2. Enter their mobile number
3. Select their organizational unit
4. Select their birthday
5. Click **Register**

This creates a Google Contact and adds them to the specified unit's Contact Group. Google Contacts may take approximately one minute to reflect the new user.

### Manage Users

Search for an existing user to edit or delete:

1. Type the user's name, phone, or department in the search box
2. Select the user from the results
3. Update their details or click **Delete User** to remove them from the system

### Admin Password

Change the administrator password. Set the new password in the password field and save settings.

### User Keyword

Set the keyword that users append to their phone number to log in. For example, if the keyword is `peace`, users log in with `12345678peace`.

### Menu Order

Drag and drop to reorder the items that appear in the main navigation menu. This controls which tabs are visible and in what order.

## KAH Management

Access via **Menu** > **KAH Management**.

### KAH Limit

Set the maximum percentage of Key Appointment Holders that can be absent from a unit simultaneously. Default is `50`.

When a KAH applies for Overseas Leave or Official Trip and the limit would be exceeded, the system:

1. Flags the record with status "Cal Updated (KAH Limit Crossed for X)"
2. Sends an email to the Approving Authority

### Approving Authority

Set the email address that receives KAH limit breach notifications.

### Email Templates

Customize the subject and body of KAH breach notification emails. Available template variables:

| Variable | Description |
|----------|-------------|
| `{Name}` | Person's name |
| `{EventType}` | Leave type |
| `{Unit}` | Department(s) where limit was exceeded |
| `{Location}` | Location or country |
| `{Remarks}` | Notes |

### Adding KAH Personnel

1. Search for a user in the search box
2. Click their name to add them to the KAH list
3. Repeat for all KAH personnel

KAH personnel are grouped by unit in the display. For hierarchical units (e.g., `HQ-OPS`), the parent unit is shown as a header with sub-units nested below.

### Custom KAH Groups

Create cross-unit KAH groups for attendee selection:

1. Enter a group name and click **Add Group**
2. Search for personnel and add them to the group
3. The group appears as `zz KAH: {group name}` in the attendee picker

### Removing KAH Personnel

Click the **x** button next to a KAH entry to remove them from the list.

## Organisational Structure

Access via **Menu** > **Organisational Structure**.

### Building the Hierarchy

Cloud Moves supports N-tier organizational hierarchies using hyphen-separated paths:

- `HQ` (top-level unit)
- `HQ-OPS` (sub-unit of HQ)
- `HQ-OPS-ALPHA` (sub-unit of HQ-OPS)

**Add a parent unit**: Type the unit name and click **Add Parent Unit**.

**Add a sub-unit**: Expand the parent unit, type the sub-unit name in the "Add Sub-Unit" field, and click **Add**.

### Managing Personnel Assignments

- **Personnel view**: Shows contact cards grouped by unit. Click a card to reassign the user to a different unit.
- **Tree view**: Shows the hierarchy as expandable sections.
- **Unassigned board**: Shows users who are not assigned to any unit.

**Reassign a user**: Click their card, select the new unit from the modal, and confirm.

**Unassign a user**: Click the **x** button on their card. They will appear in the Unassigned board.

### Renaming a Unit

Click the edit icon next to a unit name. Enter the new name and confirm. This cascades the rename across:

- Google Contacts (Contact Groups and contact names)
- Google Calendar (calendar name)
- Google Sheets (Department column in the database)
- The app's internal structure

### Deleting a Unit

Click the **x** button next to a unit name. The unit and all its sub-units are removed. Personnel in those units are automatically marked as Unassigned.

### Force Sync Google Contacts

If Google Contacts has drifted from the app's state (e.g., after bulk unit renames), click **Force Sync G-Contacts** to overwrite Google Contacts with the app's current data. This renames and re-tags all contacts.

### Saving Changes

Personnel reassignments are staged locally. Click **Save** to push all changes to Google Contacts. Unit additions and deletions are applied immediately on save.

## Event Types and Templates

Access via **Menu** > **Event Types & Templates**.

### Event Types

Manage the types available in the leave/event submission forms:

- **Fixed types** (Meeting, Others, Official Trip, Overseas Leave, Local Leave) cannot be removed
- **Custom types** can be added, renamed, reordered, and deleted
- Each type has a **Time-Bound** or **All/Half-Day** setting that controls how the form behaves

### Calendar Title Template

Set the format for Google Calendar event titles. Available variables: `{EventType}`, `{Name}`, `{Attendees}`, `{Time}`, `{Department}`, `{Location}`, `{Remarks}`, `{EventDescription}`.

### Agenda Templates

Set the format for dashboard agenda items:

- **Title template**: The headline shown for each agenda item
- **Details template**: The expanded details shown when the item is opened. Lines with empty variables are automatically hidden.

### Info All Templates

Same as agenda templates but for the Info All panel on the dashboard.

## Acronyms / Shortforms

Access via **Menu** > **Acronyms / Shortforms**.

Define acronyms that automatically replace full text in calendar titles and agenda items. For example, `DEFENCE SCIENCE AND TECHNOLOGY AGENCY` can be shortened to `DSTA`.

### Adding an acronym

1. Enter the short form (e.g., `DSTA`)
2. Enter the full text (e.g., `Defence Science and Technology Agency`)
3. Click **Add**

### Toggling an acronym

Use the toggle switch to enable or disable an acronym without deleting it.

### Removing an acronym

Click the delete icon next to the acronym.

## Saving Admin Settings

Each admin section has its own save button. Changes are not applied until you click save. The app will reload to reflect the new configuration.
