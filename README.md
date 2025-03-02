# CampusConnect: University Event Management System

CampusConnect is a comprehensive platform for managing university events, registrations, and check-ins.

## Features

- User authentication (Admin, Student, Guest)
- Event creation and management
- Event registration and QR code-based check-in
- User profiles and registration history
- Admin dashboard for event and user management
- Mobile-responsive design
- Secure token handling with automatic refresh
- Robust error handling and date formatting

## Tech Stack

### Backend
- Python/Django
- PostgreSQL
- Django Rest Framework
- Django Allauth
- JWT Authentication

### Frontend
- React
- Redux Toolkit
- Tailwind CSS
- Formik + Yup
- Axios
- date-fns

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js (v14+)
- Python (v3.8+)

### Development Setup

1. Clone the repository:
```
git clone https://github.com/yourusername/campusconnect.git
cd campusconnect
```

2. Start the development environment:
```
docker-compose up
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/v1
- Admin interface: http://localhost:8000/admin

### Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_ENABLE_NOTIFICATIONS=false
```

## Project Structure

- `backend/`: Django backend application
  - Django REST API
  - Authentication with JWT
  - PostgreSQL database
- `frontend/`: React frontend application
  - React components
  - Redux state management
  - API interactions
  - Utilities for error handling, secure storage, and date formatting
- `docker-compose.yml`: Docker configuration for development

## Best Practices Implemented

- Secure token handling with automatic refresh
- Centralized error handling
- Safe local storage operations
- Robust date formatting to prevent "Invalid time value" errors
- Environment-specific configurations
- Code organization with separated concerns

## License

[MIT License](LICENSE) 