# User Guide

This guide covers how to use Cloud Moves as personnel. For administrator tasks, see the [Admin Guide](admin-guide.md).

## Logging In

### First-time users

If you are not yet registered, an administrator must register you first, or you can use the self-registration option on the login screen if it is enabled.

### Logging in as a user

Enter your password in the format:

```
{your 8-digit phone number}{keyword}
```

For example, if your phone number is `12345678` and the keyword is `peace`, your password is `12345678peace`.

The keyword is set by your administrator. If unsure, ask your administrator what keyword to use.

### Logging in as an administrator

Enter the admin password directly. The default password is `P@ssw0rd` but it should have been changed by your administrator.

## Dashboard

The Dashboard is the main view. It shows all leave and event records across the organization.

### Views

- **Agenda view**: A chronological list of events grouped by date, with a mini-calendar for navigation
- **Month view**: A full-month calendar grid showing all events as colored bars

Toggle between views using the **Agenda** / **Month** buttons in the top-right of the dashboard.

### Filtering

- **Search**: Type in the search box to filter by name, event type, or location
- **Department filter**: Use the department dropdown to show events for a specific unit
- **My Calendar**: Select "My Calendar" from the department dropdown to see only your own records and events you are attending

### Info All

Events marked as "Info All" appear in a dedicated panel on the right side of the dashboard. These are announcements visible to all departments regardless of unit assignment.

## My Calendar

The My Calendar view shows only records that concern you:

- Records you submitted
- Events where you are listed as an attendee
- Events marked as "Info All"

It has the same agenda and month views as the Dashboard.

## Adding Records

Depending on your organization's configuration, you will see either a unified **Add Event / Leave** form or separate **Add Leave/MC** and **Add Event** forms.

### Adding a leave record

1. Select the leave type (e.g., Overseas Leave, Local Leave, Official Trip)
2. Enter remarks (optional)
3. Select the start and end dates
4. For half-day leaves, use the AM/PM toggle on each date
5. For overseas leave, enter the country and state
6. Click **Save Record**

### Adding an event

1. Select the event type (e.g., Meeting, Others)
2. Enter remarks
3. Add attendees by searching for people or entire departments (optional)
4. Enter the location and any location details
5. Select the start and end date/time
6. For recurring events, select the recurrence pattern (Daily, Weekly, Monthly, Annually, Weekday) and set an end date
7. Check **All Day Event** if applicable
8. Click **Save Record**

### Info All

When creating an event, you can toggle **Info All** to make it visible to all departments in the dashboard's Info All panel.

## Editing Records

1. Navigate to the record in My Calendar or the Dashboard
2. Click **Edit** on the record card
3. Modify the fields as needed
4. Click **Save Record**

Editing a record deletes the old calendar events and creates new ones with the updated information.

## Canceling Records

1. Navigate to the record in My Calendar or the Dashboard
2. Click **Cancel** on the record card
3. Confirm the cancellation

The record status changes to "Cancelled" and the associated calendar events are deleted.

## Parade State

The Parade State view shows real-time personnel availability across the organization.

### Reading the parade state

- The header shows the overall count: `(in-office / total)`
- Each unit shows its own count
- Personnel in the office are shown in standard text
- Personnel who are away show their location in parentheses (e.g., `(Overseas Leave)`, `(Meeting - Conference Room)`)
- Key Appointment Holders are marked with a star icon

### Changing the reference time

Click **Change Time** to set a different date/time for the parade state calculation. This is useful for planning future availability.

### Sorting

Within each unit, personnel are sorted:

1. In-office personnel first
2. Key Appointment Holders
3. Alphabetical by name

## Understanding Status Indicators

| Status | Meaning |
|--------|---------|
| Cal Updated | Record is active and calendar events exist |
| Cal Updated (KAH Limit Crossed for X) | Record is active but KAH absence threshold was exceeded for the listed unit(s) |
| Cancelled | Record has been canceled and calendar events removed |
