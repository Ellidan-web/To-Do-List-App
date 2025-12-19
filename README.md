# To-Do List App

A **modern, responsive, and professional To-Do application** built using **vanilla HTML, CSS, and JavaScript**.  

This app allows users to **add, edit, delete, and manage tasks** with optional **due date and time**. It also includes **filters, calendar filtering, drag-and-drop ordering, reminders**, and **dark/light mode**.

---

## Features

- **Add Tasks**: Enter a task name with optional date and time  
- **Edit Tasks**: Update task name, date, and time  
- **Delete Tasks**: Remove tasks permanently  
- **Mark Complete/Active**: Toggle task status  
- **Filters**: View **All**, **Active**, or **Completed** tasks  
- **Calendar Filter**: Filter tasks by a selected date  
- **Reminders**: Alert user 5 minutes before a task is due  
- **Drag-and-Drop**: Reorder tasks easily  
- **Dark/Light Mode**: Toggle themes  
- **Persistent Storage**: Tasks are saved in `localStorage`  

---

## Task Data Structure

Each task is stored as an object:

```javascript
{
  id: 1234567890,          // Unique identifier
  text: "Task Name",       // Task description
  completed: false,        // Task completion status
  dueDate: "YYYY-MM-DD",   // Optional due date
  dueTime: "HH:MM",        // Optional due time
  notified: false          // Internal flag for reminders
}
```

## Project Structure

```
to-do-list-app/
├── index.html          # Main HTML file
├── style.css           # Styling with CSS variables for theming
├── script.js           # All JavaScript logic
├── assets/
│   └── logo/
│       └── tab-logo.png # Favicon
├── README.md           # This file
└── (optional) .gitignore
```
