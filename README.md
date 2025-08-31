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
