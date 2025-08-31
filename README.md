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
