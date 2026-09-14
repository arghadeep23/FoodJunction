# FoodJunction

A MERN-stack food ordering app with a separate "FoodJunction for Merchants" dashboard for restaurant owners. See `README.md` for feature overview and screenshots.

## Structure

- `Frontend/` — Vite + React app (JS, not TS)
- `Backend/` — Express API, now structured MVC-style:
  - `models/` — Mongoose schemas + `db.js` (Mongo connection)
  - `controllers/` — one file per resource (`foodController.js`, `restaurantController.js`, `userController.js`, `cartController.js`, `uploadController.js`), each exporting the request handlers
  - `routes/` — one Express `Router` per resource, mounted in `index.js`; route paths are unchanged from the original monolithic file so the frontend's hardcoded URLs still work
  - `config/` — third-party client setup: `aws.js` (S3 client + `generateUploadURL`), `mapbox.js` (geocoder)
  - `middleware/auth.js` — `requireRestaurantAuth`, verifies the `Authorization: Bearer <token>` header issued by `POST /restaurantLogin` and attaches `req.restaurantId`
  - `index.js` — just app/middleware setup and mounting routers, no business logic

There is no monorepo tooling — each folder has its own `package.json` and is run independently.

## Running the project

Backend:
```
cd Backend
npm install
npm run start   # not defined yet — currently: node index.js
```
There is no `start`/`dev` script in `Backend/package.json` yet (only a placeholder `test` script). Run the server directly with `node index.js`. It listens on port **3000** (hardcoded in `index.js`, not configurable via env).

Frontend:
```
cd Frontend
npm install
npm run dev      # Vite dev server
```

The frontend calls the backend at a base URL exported from `Frontend/src/config.js` (`API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"`), imported and used via template literals in every component that hits the API (`App.jsx`, `DashboardMenu.jsx`, `FoodItemModal.jsx`, `Landing.jsx`, `OwnerLanding.jsx`, `LoginModal.jsx`, `OwnerDashboard.jsx`, `FoodItems.jsx`, `FoodForm.jsx`, `RestaurantForm.jsx`, `DashboardProfile.jsx`). To point the frontend at a different backend (e.g. a deployed API), just change `VITE_API_BASE_URL` in `Frontend/.env` — no code changes needed.

## Environment variables

`Backend/.env` holds the real values and `Backend/.env.example` documents the placeholders — both are git-ignored (`Backend/.gitignore`). Copy `.env.example` to `.env` and fill in real values before running the backend:

| Variable | Used for | Where |
|---|---|---|
| `MONGODB_PASSWORD` | Password for MongoDB Atlas user `Arghadeep` on cluster `atlascluster.auwhwjc.mongodb.net` (cluster host + username are hardcoded in `Backend/models/db.js`, not env-driven) | `models/db.js` |
| `ACCESS_KEYID` | AWS S3 access key, for pre-signed image upload URLs (`GET /s3URL`) | `config/aws.js` |
| `SECRET_ACCESS_KEY` | AWS S3 secret key | `config/aws.js` |
| `REGION` | AWS S3 bucket region | `config/aws.js` |
| `BUCKET_NAME` | AWS S3 bucket name for image uploads | `config/aws.js` |
| `MAPBOX_TOKEN` | Server-side forward geocoding of restaurant addresses (`POST /uploadRestaurant`) | `config/mapbox.js` |
| `JWT_SECRET` | Signs/verifies restaurant-owner JWTs. Generate with `openssl rand -hex 32` | `controllers/restaurantController.js`, `middleware/auth.js` |

**SendGrid/nodemailer have been removed** (previously sent a "Welcome to FoodJunction" email on `POST /register`). The `nodemailer` and `nodemailer-sendgrid-transport` packages were uninstalled from `Backend/package.json`, the transporter setup and `sendMail` call were deleted, and `SENDGRID_APIKEY` no longer appears in `.env`/`.env.example`. Registration (`controllers/userController.js`) now just saves the user and returns their id, with no email side effect.

**Security note:** an earlier version of `Backend/.env.example` briefly had real AWS credentials and a Mapbox token pasted into it. That file is now back to placeholders and is git-ignored, and it was never committed to git history — but if that AWS key was ever shared/pushed anywhere, rotate it in the AWS IAM console as a precaution.

**Frontend env vars** (`Frontend/.env` / `Frontend/.env.example`, both git-ignored):

| Variable | Used for | Where |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL the frontend calls the backend API at (defaults to `http://localhost:3000` if unset) | `src/config.js` |

Notably:
- Auth0 `domain` and `clientId` are still **hardcoded** directly in `Frontend/src/main.jsx` (not secrets, but should probably be env vars too for a multi-environment setup — out of scope for the `VITE_API_BASE_URL` change).
- The map on restaurant/food pages (`Frontend/src/components/MyMap.jsx`) uses **Leaflet + OpenStreetMap tiles**, not Mapbox — so no Mapbox token is needed client-side. Mapbox is only used server-side for geocoding.
- `@stripe/stripe-js` is a listed dependency but is **not actually imported/used anywhere** in `Frontend/src` yet — payment integration described in the README appears unfinished/removed. No Stripe env vars exist or are needed currently.

## Auth

`POST /restaurantLogin` verifies the restaurant's bcrypt-hashed password and issues a JWT signed with `JWT_SECRET`, valid 1 hour. The frontend stores it in `localStorage` (`LoginModal.jsx`) and now sends it as `Authorization: Bearer <token>` on every owner-only mutation:
- `PUT /restaurants/:id` (`DashboardProfile.jsx`)
- `POST /uploads` (`FoodForm.jsx`)
- `PUT /foods/:id` (`FoodItemModal.jsx`)

These three routes are protected server-side by `middleware/auth.js`'s `requireRestaurantAuth`, which 401s on a missing/invalid/expired token. `POST /uploadRestaurant` (initial registration), `GET /s3URL`, and `POST /checkRestaurant` are intentionally left open since they're used before a restaurant has logged in. The middleware only checks that the token is valid — it does not check that the token's `restaurantId` matches the resource being mutated (e.g. restaurant A could update restaurant B's listing if it guessed B's id), so add an ownership check (`req.restaurantId === req.params.id`) if that matters for the demo.

Two bugs were fixed here (previously: `bcrypt.compare(existingRestaurant.password, password)` called with arguments swapped and without `await`, which made the return value an always-truthy Promise — any password, including a wrong one, would log a user in; and the JWT was signed with a freshly random secret discarded immediately after, so no token could ever have been verified even if middleware had existed).

## Notes / things to watch when modifying

- Backend has no `nodemon` — restart manually after edits, or add it as a dev convenience.
- Node version installed locally: v25.0.0.
