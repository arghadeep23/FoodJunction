# FoodJunction 🍕

[![CI](https://github.com/arghadeep23/FoodJunction/actions/workflows/ci.yml/badge.svg)](https://github.com/arghadeep23/FoodJunction/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)

A full-stack MERN food ordering app: customers browse restaurants, build a cart, and check out, while restaurant owners get a separate merchant dashboard (**FoodJunction for Merchants**) to manage their menu, profile, and cover photo.

**Live demo:** _coming soon_

## Screenshots

<table>
<tr>
<td><img src="https://github.com/arghadeep23/FoodJunction/assets/91934528/9173ba86-ba62-4191-957c-1b02fdf4999d" alt="Homepage" /></td>
<td><img src="https://github.com/arghadeep23/FoodJunction/assets/91934528/c60492ae-d491-4544-a035-b63493f16f82" alt="Restaurant menu" /></td>
</tr>
<tr>
<td><img src="https://github.com/arghadeep23/FoodJunction/assets/91934528/e6d7706b-cf5c-4b74-a974-f059ff010565" alt="FoodJunction for Merchants" /></td>
<td><img src="https://github.com/arghadeep23/FoodJunction/assets/91934528/8046e807-24c9-4205-9941-cf46ccee76ae" alt="Merchant dashboard" /></td>
</tr>
<tr>
<td><img src="https://github.com/arghadeep23/FoodJunction/assets/91934528/128ff95a-252b-42cb-82ab-5624a64b15b6" alt="Editing a food item" /></td>
<td><img src="https://github.com/arghadeep23/FoodJunction/assets/91934528/b12afc8d-1eaf-42d4-8f3d-7e9b158f7ff3" alt="Adding a new food item" /></td>
</tr>
</table>

## Features

**Customer-facing**
- Browse restaurants and their menus, with category browsing on the landing page
- Sign in via Auth0 (Google / email)
- Per-restaurant cart with quantity controls, persisted server-side per user
- Restaurant location shown on an interactive map (Leaflet + OpenStreetMap)

**FoodJunction for Merchants**
- Restaurant registration with address geocoding (Mapbox) so listings appear correctly on the map
- Email/password login issuing a JWT, used to authorize all subsequent dashboard actions
- Add/edit menu items, each with an image uploaded directly to S3 via a pre-signed URL
- Edit restaurant profile (description, category, location, cover photo)

## Tech stack

| | |
|---|---|
| **Frontend** | React 18, Vite, React Router, Auth0, Leaflet, Material UI icons, SCSS |
| **Backend** | Node.js, Express, Mongoose (MongoDB Atlas) |
| **Auth** | Auth0 (customers), JWT + bcrypt (restaurant owners) |
| **Storage/APIs** | AWS S3 (image uploads via pre-signed URLs), Mapbox (geocoding) |
| **CI** | GitHub Actions (lint + build on every push/PR) |

## Architecture

The backend follows an MVC-style layout:

```
Backend/
├── models/       Mongoose schemas + the MongoDB connection
├── controllers/  Request handlers, one file per resource
├── routes/       Express routers, one per resource, mounted in index.js
├── middleware/   requireRestaurantAuth — verifies the owner JWT on protected routes
├── config/       Third-party client setup (AWS S3, Mapbox)
└── index.js      App/middleware wiring only — no business logic
```

Restaurant-owner routes that mutate data (`PUT /restaurants/:id`, `POST /uploads`, `PUT /foods/:id`) require a valid `Authorization: Bearer <token>` header, checked by `middleware/auth.js`. The token is issued by `POST /restaurantLogin` after verifying the bcrypt-hashed password, and the frontend stores it in `localStorage` and attaches it to those requests.

```
Frontend/
└── src/
    ├── components/  One component per page/feature
    ├── store/       CartContext (React context for the shopping cart)
    └── config.js    API_BASE_URL, read from VITE_API_BASE_URL
```

See [CLAUDE.md](CLAUDE.md) for a more detailed technical reference (env vars, known limitations, things to watch when modifying).

## Getting started

### Prerequisites
- Node.js 20+
- A MongoDB Atlas cluster
- AWS S3 bucket + credentials
- A Mapbox access token
- An Auth0 application (SPA)

### Backend

```bash
cd Backend
npm install
cp .env.example .env   # fill in real values, see table below
npm run dev             # nodemon, or `npm start` for a plain run
```

Runs on `http://localhost:3000`.

| Variable | Used for |
|---|---|
| `MONGODB_PASSWORD` | MongoDB Atlas password |
| `ACCESS_KEYID` / `SECRET_ACCESS_KEY` / `REGION` / `BUCKET_NAME` | AWS S3, for pre-signed image upload URLs |
| `MAPBOX_TOKEN` | Forward geocoding restaurant addresses on registration |
| `JWT_SECRET` | Signs/verifies restaurant-owner JWTs — generate with `openssl rand -hex 32` |

### Frontend

```bash
cd Frontend
npm install
cp .env.example .env   # defaults to http://localhost:3000, change if needed
npm run dev
```

Runs on `http://localhost:5173`.

| Variable | Used for |
|---|---|
| `VITE_API_BASE_URL` | Base URL the frontend calls the backend API at |

Auth0 `domain`/`clientId` are currently hardcoded in `Frontend/src/main.jsx` rather than env-driven — see `CLAUDE.md` if you're pointing this at your own Auth0 tenant.

## API overview

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/register` | — | Register/fetch a customer (Auth0-authenticated user) |
| GET | `/restaurants` | — | List all restaurants |
| GET | `/restaurant/:id` | — | Get one restaurant |
| POST | `/uploadRestaurant` | — | Register a new restaurant (geocodes the address) |
| POST | `/checkRestaurant` | — | Check if a restaurant email is already registered |
| POST | `/restaurantLogin` | — | Restaurant owner login, returns a JWT |
| PUT | `/restaurants/:id` | 🔒 owner | Update restaurant profile |
| GET | `/foods/:id` | — | List food items for a restaurant |
| POST | `/uploads` | 🔒 owner | Create a food item |
| PUT | `/foods/:id` | 🔒 owner | Update a food item |
| GET | `/s3URL` | — | Get a pre-signed S3 upload URL |
| GET | `/cart/:userId` | — | Get a customer's cart |
| POST | `/add-to-cart` | — | Add/increment an item in the cart |
| DELETE | `/remove-from-cart` | — | Remove/decrement an item in the cart |

## Roadmap / known limitations

- Payment integration (Stripe) is listed as a dependency but not yet wired up end-to-end
- JWT auth middleware checks the token is valid but doesn't yet verify it belongs to the restaurant being mutated
- No automated tests yet (CI currently runs lint + build only)
- Order dashboard for merchants (seeing who ordered what) is not implemented
- Filtering food items by category is not implemented
- Cart doesn't yet prevent mixing items from different restaurants

## License

[MIT](LICENSE)
