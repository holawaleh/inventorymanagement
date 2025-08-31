# 📦 Inventory Management API

A RESTful API for managing inventory , built with **Django** and **Django REST Framework (DRF)**.

This project is part of a step-by-step learning journey to master backend development, database design, authentication, and deployment.

## 🎯 Features

### ✅ Phase 1 & 2: Setup & Database

- [x] Django project and app structure
- [x] PostgreSQL database integration
- [x] `InventoryItem` model with fields:
  - Name, Description, Quantity, Price
  - Category, Date Added, Last Updated
  - Owner (linked to User)
- [x] Data validation (e.g., quantity ≥ 0)
- [x] `.env` file for sensitive data
- [x] `.gitignore` to protect secrets

### 🚧 Phase 3: API Endpoints (In Progress)

- [ ] Serializers for JSON conversion
- [ ] CRUD views for inventory items
- [ ] API URL routing
- [ ] Test endpoints with HTTP
- [x] Secured settings with `python-decouple`
- [x] Externalized `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, DB credentials
- [x] Used lambda to parse comma-separated `ALLOWED_HOSTS`
- [x] Configured static files for dev and production
- [x] Set proper login/logout redirects
- [x] Learned how environment variables make apps deployable
- [x] Fixed logout 405 error by replacing `<a>` tag with secure `POST` form
- [x] Learned why `LogoutView` requires `POST` requests
- [x] Added `{% csrf_token %}` for security
- [x] Improved UX with proper logout flow

### 🚧 Project Completed

Inventory Management API

A full-stack inventory management system built with Django and Django REST Framework (DRF).

This app allows users to manage inventory items securely with authentication, real-time dashboard updates, low stock alerts, and audit logging. Designed for small businesses or personal use, it combines a RESTful API backend with a user-friendly frontend.

🎯 Features
✅ Core Functionality

    User Authentication: Sign up, log in, and log out securely
    CRUD Operations: Add, view, update, and delete inventory items
    Inventory Tracking: Monitor quantity, price, category, and timestamps
    Low Stock Alerts: Visual warning for items with quantity below 5
    Change Logging: Audit trail of all inventory changes (who, what, when)
    Responsive Dashboard: Clean UI with real-time JavaScript updates


✅ Technical Highlights

    Built with Django + DRF
    PostgreSQL database for production readiness
    HTML/CSS/JS frontend with Django templates
    ModelViewSet + Router for clean, RESTful API design
    Environment variables via python-decouple
    Session-based authentication with secure CSRF handling
    Pagination, filtering, and sorting in API
    Static files configured for dev and production
    GitHub version control with detailed commit history


🚀 Live Demo
Sign Up
Create a new account
Login
Secure session-based login
Dashboard
View and manage inventory
Add/Delete Items
Real-time updates via API
Low Stock Alerts
Automatic warning for items < 5 units
Audit Log
Track every quantity change

    🔗 Watch the 5-minute demo:
    https://www.loom.com/watch/your-video-id-here


🛠️ Tech Stack
Backend
Python, Django, DRF
Database
PostgreSQL
Frontend
HTML, CSS, JavaScript
Auth
Django built-in auth
Deployment Ready
collectstatic
,
requirements.txt
Dev Tools
Git, VS Code, Loom
