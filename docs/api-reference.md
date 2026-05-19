# API Reference

The backend exposes a single POST endpoint (the Google Apps Script Web App URL). All requests share the same envelope format.

## Request Format

```
POST {API_URL}
Content-Type: text/plain

{
  "action": "<action_name>",
  "data": { ... },
  "credentials": { "phone": "...", "pass": "..." }
}
```

## Response Format

```json
{
  "success": true,
  "data": { ... }
}
```

On error:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Actions

### login

Authenticates a user or administrator.

**Authentication**: None required.

**Request data**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `password` | string | Yes | Admin password or `{phone}{keyword}` for users |

**Response data**:

| Field | Type | Description |
|-------|------|-------------|
| `role` | string | `"admin"` or `"user"` |
| `name` | string | Display name |
| `phone` | string | 8-digit phone number (users only) |
| `pass` | string | The password used (for session persistence) |
| `departments` | string[] | Unit assignments (users only) |

---

### getSettings

Returns the full application configuration and contact directory.

**Authentication**: Admin password or user credentials.

**Request data**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `adminPass` | string | Yes for admin | Admin password (null for regular users) |

**Response data**:

| Field | Type | Description |
|-------|------|-------------|
| `kahLimit` | string | Maximum percentage of KAHs absent per unit |
| `approvingAuthority` | string | Email address for KAH breach notifications |
| `kahList` | array | List of KAH personnel with phone, name, and department |
| `kahEmailSubject` | string | Email subject template for KAH breaches |
| `kahEmailBody` | string | Email body template for KAH breaches |
| `typicalEventTypes` | array | Configurable event/leave types with `name`, `isEvent`, `defaultLoc` |
| `gcalTemplate` | string | Google Calendar event title template |
| `agendaTemplate` | string | Dashboard agenda item title template |
| `agendaDetailsTemplate` | string | Dashboard agenda item details template |
| `infoAllTemplate` | string | Info All section title template |
| `infoAllDetailsTemplate` | string | Info All section details template |
| `acronyms` | object | Acronym-to-full-text mappings |
| `customKahGroups` | array | Custom cross-unit KAH groups |
| `menuOrder` | array | Ordered list of visible menu items |
| `adminSectionsOrder` | array | Ordered list of admin settings sections |
| `userKeyword` | string | Keyword appended to phone number for user login |
| `appMode` | string | `"combined"` (unified form) or `"classic"` (separate forms) |
| `companyStructure` | array | Organizational unit paths (e.g., `["HQ", "HQ-OPS"]`) |
| `allContacts` | array | Contact directory with name, phone, department, birthday |

---

### saveSettings

Persists configuration changes. Admin only.

**Authentication**: Admin credentials required.

**Request data** (all fields optional; only provided fields are updated):

| Field | Type | Description |
|-------|------|-------------|
| `newAdminPass` | string | New admin password |
| `kahLimit` | string | New KAH absence threshold |
| `approvingAuthority` | string | New approving authority email |
| `kahList` | array | Updated KAH personnel list |
| `kahEmailSubject` | string | Updated KAH email subject template |
| `kahEmailBody` | string | Updated KAH email body template |
| `typicalEventTypes` | array | Updated event types |
| `gcalTemplate` | string | Updated calendar title template |
| `agendaTemplate` | string | Updated agenda title template |
| `agendaDetailsTemplate` | string | Updated agenda details template |
| `infoAllTemplate` | string | Updated Info All title template |
| `infoAllDetailsTemplate` | string | Updated Info All details template |
| `acronyms` | object | Updated acronym mappings |
| `customKahGroups` | array | Updated custom KAH groups |
| `userKeyword` | string | Updated login keyword |
| `appMode` | string | Updated app mode |
| `companyStructure` | array | Updated organizational structure |
| `menuOrder` | array | Updated menu order |
| `adminSectionsOrder` | array | Updated admin sections order |

**Response data**:

| Field | Type | Description |
|-------|------|-------------|
| `updated` | boolean | Always `true` on success |

---

### submitLeave

Creates a new leave or event record.

**Authentication**: Admin or the user themselves.

**Request data**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phone` | string | Yes | Phone number of the person the record is for |
| `name` | string | Yes | Full name |
| `departments` | string[] | Yes | Unit assignments |
| `leaveType` | string | Yes | Type (e.g., "Overseas Leave", "Meeting") |
| `startDate` | string | Yes | ISO date string |
| `endDate` | string | Yes | ISO date string |
| `halfDay` | string | No | `"AM"`, `"PM"`, `"None"`, or recurrence pattern |
| `remarks` | string | No | Free-text notes |
| `location` | string | No | Event location |
| `locationDetails` | string | No | Additional location info |
| `country` | string | No | For overseas leave |
| `state` | string | No | For overseas leave |
| `attendees` | string | No | JSON array of attendee objects |
| `infoAll` | boolean | No | Whether this is visible to all departments |
| `isAllDay` | boolean | No | Whether the event is all-day |
| `untilDate` | string | No | End date for recurring events |

**Response data**:

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Record status (e.g., "Cal Updated", "Cal Updated (KAH Limit Crossed for HQ)") |

---

### editLeave

Updates an existing leave or event record. Deletes old calendar events and creates new ones.

**Authentication**: Admin or the record owner.

**Request data**: Same as `submitLeave`, plus:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | The record's UUID |

**Response data**: Same as `submitLeave`.

---

### getLeaves

Returns all leave/event records from the database.

**Authentication**: Admin or user credentials.

**Request data**: None beyond credentials.

**Response data**: Array of record objects. Each record contains:

| Field | Type | Description |
|-------|------|-------------|
| `ID` | string | Unique record identifier |
| `Timestamp` | string | Creation/modification time |
| `Phone` | string | User's phone number |
| `Name` | string | User's name |
| `Department` | string | Comma-separated unit list |
| `LeaveType` | string | Event/leave type |
| `StartDate` | string | Start date |
| `EndDate` | string | End date |
| `HalfDay` | string | Half-day or recurrence setting |
| `Country` | string | For overseas leave |
| `State` | string | For overseas leave |
| `Remarks` | string | Notes |
| `Status` | string | Current status |
| `EventIDs` | string | Comma-separated calendar event references |
| `Location` | string | Event location |
| `Attendees` | string | JSON array of attendees |
| `InfoAll` | string | `"TRUE"` or `"FALSE"` |
| `IsAllDay` | string | `"TRUE"` or `"FALSE"` |
| `UntilDate` | string | Recurrence end date |
| `LocationDetails` | string | Additional location info |

---

### cancelLeave

Cancels a record and deletes associated calendar events.

**Authentication**: Admin or the record owner.

**Request data**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | The record's UUID |

**Response data**:

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` on success |

---

### registerUser

Creates a new user in Google Contacts.

**Authentication**: None (self-registration).

**Request data**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fullName` | string | Yes | User's full name |
| `mobile` | string | Yes | Phone number |
| `unit` | string | Yes | Organizational unit |
| `birthday` | string | No | Date in `YYYY-MM-DD` format |

**Response data**:

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` on success |
| `message` | string | Confirmation message |

---

### updateUser

Updates an existing user's contact details. Admin only.

**Authentication**: Admin credentials required.

**Request data**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `resourceName` | string | Yes | Google Contacts resource identifier |
| `fullName` | string | Yes | Updated name |
| `mobile` | string | Yes | Updated phone number |
| `unit` | string | Yes | Updated unit |
| `birthday` | string | No | Updated birthday in `YYYY-MM-DD` format |

**Response data**:

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` on success |

---

### deleteUser

Permanently removes a user from Google Contacts. Admin only.

**Authentication**: Admin credentials required.

**Request data**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `resourceName` | string | Yes | Google Contacts resource identifier |

**Response data**:

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` on success |

---

### updateUserUnits

Reassigns users to different organizational units. Admin only.

**Authentication**: Admin credentials required.

**Request data**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `changes` | object | Yes | Map of `resourceName` to new unit name |

**Response data**:

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` on success |

---

### renameUnit

Renames an organizational unit across all platforms (Contacts, Calendar, Sheets). Admin only.

**Authentication**: Admin credentials required.

**Request data**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `oldName` | string | Yes | Current unit name |
| `newName` | string | Yes | New unit name (auto-converted to uppercase) |

**Response data**:

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` on success |

---

### forceSyncContacts

Overwrites Google Contacts with the app's current state. Admin only.

**Authentication**: Admin credentials required.

**Request data**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `structure` | array | Yes | Current organizational unit paths |
| `contacts` | array | Yes | Contact objects with `resourceName`, `name`, `unit` |

**Response data**:

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` on success |

## Template Variables

The following placeholders can be used in calendar and agenda templates:

| Variable | Description |
|----------|-------------|
| `{EventType}` | Leave or event type name |
| `{Name}` | Person's name |
| `{Department}` | Unit assignment |
| `{Attendees}` | Comma-separated attendee list |
| `{Location}` | Event location |
| `{Time}` | Formatted time string |
| `{Remarks}` | Notes/remarks |
| `{EventDescription}` | Event description |
| `{Unit}` | Unit name (KAH email template) |
