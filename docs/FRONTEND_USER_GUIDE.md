# Frontend User Guide

## Overview

The Berth Scheduling Optimizer frontend is a modern, responsive web application built with React. It provides an intuitive interface for solving berth scheduling problems and managing solutions.

## Accessing the Application

**URL**: http://localhost:3000

## User Interface Components

### Header
- **Title**: "Berth Scheduling Optimizer"
- **Subtitle**: "Minimize vessel port makespan efficiently"
- **Status Badge**: Shows system status (System Ready)
- Sticky positioning at top of page

### Sidebar Navigation
Located on the left side, provides access to three main views:
- 📊 **Dashboard** - Overview and metrics
- ⚙️ **Solver** - Create and solve problems
- 📋 **History** - View past solutions

Click any item to navigate to that section.

### Main Content Area
Central area where page content displays. Scrollable if content exceeds screen height.

### Footer
- Copyright information
- Current year auto-updated

---

## Dashboard Page

**Purpose**: Overview of system statistics and recent activity

### Key Performance Indicators (KPIs)

**Three metric cards at the top**:

1. **Total Solutions**
   - Number of problems that have been solved
   - Includes all saved solutions in database

2. **Vessels Scheduled**
   - Cumulative count of all vessels across all solutions
   - Useful for understanding usage patterns

3. **Average Makespan**
   - Mean makespan value across all solutions
   - Indicates solution quality trends

### Recent Solutions Table

Displays the 5 most recent solutions with:
- **Problem ID**: First 8 characters of UUID (clickable to see history)
- **Vessels**: Number of vessels in solution
- **Makespan (hrs)**: Objective value - latest departure time
- **Solve Time (ms)**: How long the algorithm took
- **Date**: Date solution was created

### Getting Started Guide

Quick reference section with:
1. Go to Solver tab
2. Upload JSON or enter manually
3. Click Solve
4. View results
5. Check History tab

---

## Solver Page

**Purpose**: Upload problems and solve berth scheduling instances

### Section 1: Upload Problem Instance

**File Upload**:
- Click file input to select a JSON file
- Supported format: JSON with `vessels` array
- Example: `data/test_instance.json`

File structure:
```json
{
  "vessels": [
    {
      "vessel_id": "V001",
      "arrival_time": 0,
      "processing_time": 6
    }
  ]
}
```

**Action**: File automatically uploads and solves when selected

### Section 2: Manual Entry

**Vessel Data Table**:

Columns:
1. **Vessel ID**: Unique identifier (e.g., "V001")
2. **Arrival Time (hours)**: When vessel arrives (0-72 range)
3. **Processing Time (hours)**: How long processing takes (1+)
4. **Action**: Remove button to delete row

**Each row is editable**:
- Click input field to edit
- Changes saved immediately in form
- Cannot delete if only one vessel exists

### Adding/Removing Vessels

**Add Vessel**: Click "+ Add Vessel" button
- Adds blank row at bottom
- Can add unlimited vessels

**Remove Vessel**: Click "Remove" button in action column
- Deletes that vessel row
- Cannot remove if last vessel

### Solving

**Solve Problem Button**: Green button at bottom right
- Disabled during solving (shows spinner)
- Text changes to "Solving..." while processing

**Input Validation**:
- All fields required
- Vessel ID must be text
- Times must be numbers
- Error messages shown in red alert

### Results Modal

After solving, a modal dialog appears with:

**Solution Summary**:
- **Makespan**: Latest departure time (key metric)
- **Solving Time**: Milliseconds to solve
- **Problem ID**: UUID for future reference

**Berth Schedule Table**:
| Column | Meaning |
|--------|---------|
| Vessel | Vessel ID |
| Berth | Assigned berth number |
| Start (hrs) | When vessel processing begins |
| End (hrs) | When vessel processing ends |
| Wait (hrs) | Time waiting (start - arrival) |

**Actions**:
- Close button to dismiss modal
- Solution automatically saved to history

---

## History Page

**Purpose**: Manage and review past solutions

### Solutions Table

Displays all saved solutions with:

| Column | Content |
|--------|---------|
| Problem ID | First 12 chars of UUID |
| Vessels | Badge with vessel count |
| Makespan | Hours (objective value) |
| Solve Time | Milliseconds |
| Date & Time | When solution was created |
| Actions | View and Delete buttons |

### Sorting

Table sorted by most recent first.

### View Solution Details

**Click "View" button**:
- Opens modal with full solution details
- Shows problem metadata
- Displays complete schedule table

**Schedule Table Columns**:
- Vessel: Vessel ID
- Berth: Assigned berth
- Arrives: Contractual arrival time
- Starts: Actual start time
- Ends: Actual end time
- Wait: Waiting time in hours

### Delete Solution

**Click "Delete" button**:
1. Confirmation dialog appears
2. Confirm to permanently delete
3. Solution removed from database
4. Table refreshes automatically

### Empty State

If no solutions exist, message displays:
"No solutions saved yet. Create one from the Solver tab!"

---

## Design Features

### Color Scheme

**Primary Colors**:
- Dark Blue (#1e3a5f): Headers, main titles
- Blue (#2c5aa0): Primary buttons, KPI values
- Light Blue (#4a7ba7): Secondary elements
- Accent Blue (#0ea5e9): Navigation highlights

**Neutral Colors**:
- Dark Grey (#1f2937): Sidebar, text
- Medium Grey (#4b5563): Secondary text
- Light Grey (#9ca3af): Placeholders, hints
- Lighter Grey (#e5e7eb): Borders
- Lightest Grey (#f3f4f6): Backgrounds

### Typography

- **Font Family**: System fonts (Segoe UI, Roboto)
- **Headings**: Bold, 1.5-2rem
- **Body**: Regular, 1rem
- **Small text**: 0.875rem

### Interactive Elements

**Buttons**:
- Primary (Blue): Main actions
- Secondary (Grey): Alternative actions
- Danger (Red): Delete operations
- Hover effect: Darker color + shadow
- Active effect: Slight scale down

**Forms**:
- Focused input: Blue border + subtle shadow
- Error state: Red border + red text
- Placeholders: Grey text

**Tables**:
- Header: Light grey background
- Hover rows: Slightly darker background
- Alternating row colors for readability

### Responsive Design

**Desktop (1024px+)**:
- Sidebar on left (250px wide)
- Full table visibility
- Multi-column grid layouts

**Tablet (768px-1023px)**:
- Sidebar adjusts width (200px)
- Grid becomes 2 columns
- Some spacing reduced

**Mobile (320px-767px)**:
- Sidebar converts to horizontal nav
- Single column layout
- Touch-friendly button sizing
- Optimized typography

**Small Mobile (<480px)**:
- Minimal padding
- Full width inputs
- Stacked buttons
- Simplified modals

---

## Key Interactions

### File Upload Workflow
1. Go to Solver tab
2. Click "Select JSON File"
3. Choose file from computer
4. File loads and auto-solves
5. Results shown in modal
6. Solution saved automatically

### Manual Problem Workflow
1. Go to Solver tab
2. Enter vessel information in table:
   - Vessel ID
   - Arrival Time
   - Processing Time
3. Add more vessels if needed
4. Click "Solve Problem"
5. Wait for results (usually <100ms)
6. View solution in modal
7. Close modal to return to form

### Review Past Solution
1. Go to History tab
2. Find solution in table
3. Click "View" button
4. Modal shows full details
5. Review schedule
6. Close modal

### Delete Solution
1. Go to History tab
2. Click "Delete" on row
3. Confirm deletion
4. Solution removed
5. Table refreshes

---

## Tips & Best Practices

### Data Entry
- Use consistent vessel ID format (e.g., "V001", "V002")
- Ensure times are within 0-72 hour range
- Processing time should be > 0
- Avoid special characters in vessel IDs

### Performance
- Most problems solve in <100ms
- Can handle 100+ vessels
- Larger problems may take longer
- Browser remains responsive

### Data Storage
- Solutions saved automatically
- Can retrieve and review anytime
- Delete when no longer needed
- No export/backup yet (future feature)

---

## Keyboard Shortcuts (Future)

*Currently all interactions via mouse/touch. Keyboard shortcuts planned for:*
- `Ctrl+S` - Solve
- `Ctrl+H` - Go to History
- `Esc` - Close modal
- `Enter` - Confirm action

---

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Color contrast meets WCAG standards
- Keyboard navigable (Tab key)
- Focus indicators visible
- Mobile touch targets 44x44px minimum

---

## Troubleshooting

### Cannot connect to backend
- Check if backend is running (http://localhost:8000/health)
- Verify network connectivity
- Check browser console for CORS errors
- Ensure proxy setting in package.json

### File upload fails
- Verify JSON file format
- Check file size (<1MB)
- Ensure valid vessel data
- Try uploading sample file

### Solution not saving
- Check browser console for errors
- Verify backend database is running
- Check network tab in dev tools
- Refresh page to reload from database

### Modal won't close
- Try pressing Escape key
- Click outside modal area
- Refresh page
- Check browser console

---

## Browser Support

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance Tips

- Close unused tabs
- Clear browser cache if experiencing issues
- Use modern browser for best experience
- Disable browser extensions if problems occur

---

**Version**: 1.0.0
**Last Updated**: January 2026
