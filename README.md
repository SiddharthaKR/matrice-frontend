# Project Management Dashboard Frontend

## Table of Contents
- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Setup and Running Locally](#setup-and-running-locally)
- [Key Components](#key-components)
- [API Integration](#api-integration)
- [Authentication Mechanism](#authentication-mechanism)
- [Styling and Theming](#styling-and-theming)

## Introduction
This frontend application serves a Project Management Dashboard, providing an overview of projects, tasks, deadlines, etc. Users can see the projects they are a member of, categorized by their roles (admin or member). The application is built using React and Material-UI.

## Project Structure
```
project-management-dashboard/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── api/
│   │   ├── authApi.js
│   │   ├── boardApi.js
│   │   ├── sectionApi.js
│   │   ├── taskApi.js
│   │   └── ...
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── ...
│   │   ├── Dashboard/
│   │   │   ├── DashboardOverview.js
│   │   │   └── ...
│   │   ├── Kanban/
│   │   │   ├── Kanban.js
│   │   │   ├── TaskModal.js
│   │   │   ├── SimpleDialog.js
│   │   │   └── ...
│   │   ├── Layout/
│   │   │   ├── Header.js
│   │   │   └── Sidebar.js
│   │   └── ...
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── ...
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── ...
│   ├── App.js
│   ├── index.js
│   └── ...
├── .env
└── package.json
```

## Setup and Running Locally
### Prerequisites
- Node.js and npm installed

### Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/project-management-dashboard.git
   cd project-management-dashboard/frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory with the following content:
   ```plaintext
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Run the Application**
   ```bash
   npm start
   ```

5. **Frontend is now running at** `http://localhost:3000`

## Key Components
### Kanban Component
The `Kanban` component is the core of the task management system, allowing users to view and manage tasks within different sections. It uses the `react-beautiful-dnd` library for drag-and-drop functionality.

### TaskModal Component
The `TaskModal` component provides a detailed view of individual tasks, allowing users to edit task details, assign members, and set deadlines.

### DashboardOverview Component
The `DashboardOverview` component provides a high-level view of the user's projects, tasks, and deadlines, categorized by their role in the project.

### SimpleDialog Component
The `SimpleDialog` component is used to add new members to a project, providing a simple user interface for selecting users and assigning roles.

## API Integration
API requests are handled by the `api` module, which contains separate files for each resource (e.g., `authApi.js`, `boardApi.js`, `sectionApi.js`, `taskApi.js`). These files define functions for making HTTP requests to the backend endpoints using `axios`.

### Example: Fetching Boards
```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getBoards = async () => {
  const response = await axios.get(`${API_URL}/boards`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export default {
  getBoards,
  // other board-related API functions
};
```

## Authentication Mechanism
The frontend uses JWT (JSON Web Tokens) for authentication. Upon successful login, the JWT token is stored in `localStorage` and included in the Authorization header of subsequent API requests.

### Example: Login Function
```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { username, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export default {
  login,
  // other auth-related API functions
};
```

## Styling and Theming
The application uses Material-UI for styling and theming. Components are styled using Material-UI's `sx` prop and `makeStyles` utility.

### Example: Styling a Component
```javascript
import { Box, Typography } from '@mui/material';

const Header = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#3f51b5', color: 'white' }}>
      <Typography variant="h6">Project Management Dashboard</Typography>
    </Box>
  );
};

export default Header;
```

## Conclusion
This documentation provides an overview of the frontend setup, including project structure, steps to run the project locally, key components, API integration, authentication mechanism, and styling. Follow the provided instructions to set up and run the project, and refer to the code examples for integrating with the backend API and implementing various features.