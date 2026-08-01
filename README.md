<!-- markdownlint-disable -->

# ♻️ Cash For Trash - Backend API

**Cash For Trash** is a smart waste management, recycling, and rewards platform backend built using Node.js, Express.js, Prisma ORM, and MySQL. The system connects environmentally conscious citizens (**Customers**), waste collection agents (**Workers**), and platform operators (**Admins**) to streamline waste collection, promote recycling, calculate worker payouts, and reward users with points redeemable for physical or digital rewards.

---

## 🏗️ Technology Stack & System Architecture

### Tech Stack
- **Runtime**: Node.js (ES Modules `type: "module"`)
- **Framework**: Express.js (v5)
- **ORM & Database**: Prisma ORM (v6) + MySQL Database
- **Authentication**: JWT (Access Token & Refresh Token) + Bcrypt hashing
- **Validation**: express-validator
- **Media Uploads**: Cloudinary + Multer
- **Email & OTP**: Nodemailer + OTP Generator
- **Documentation**: Swagger OpenAPI 3.0 (`swagger-jsdoc` & `swagger-ui-express`)

### 6-Layer Architecture

The backend follows a strict, one-way 6-layer architecture to ensure maintainability, testability, and separation of concerns:

```
Client Request
  ↓
1. Routes (routes/*)          → URL mapping, middleware chain, JSDoc OpenAPI annotations
  ↓
2. Validations (validations/*) → express-validator rule sets per endpoint
  ↓
3. Middlewares (middlewares/*) → Request validation, JWT authentication, Role-based authorization
  ↓
4. Controllers (controllers/*) → Thin HTTP handlers, try/catch error forwarding, standardized response formatting
  ↓
5. Services (services/*)      → Core business logic, guard clauses, Prisma database transactions ($transaction)
  ↓
6. Utils & Prisma (utils/*)    → Reusable helpers (JWT, Hashing, OTP, Cloudinary, Response wrappers, Constants)
```

---

## 👥 User Roles, Titles & Responsibilities

The application defines three distinct primary roles (`customer`, `worker`, `admin`):

| Role Title | Description | Primary Responsibilities & Capabilities |
| :--- | :--- | :--- |
| 👤 **Customer** | Citizen / Recycler / End User | - Register account & verify email via OTP.<br>- Manage personal profile & delivery/pickup addresses with geocoded coordinates.<br>- Create and schedule **Collection Requests** for waste pickup based on area availability.<br>- Specify expected garbage types and weight estimations.<br>- Select payment methods (**CASH** per pickup or **MONTHLY** subscription).<br>- Track collection request lifecycle (`PENDING`, `ACCEPTED`, `ON_THE_WAY`, `COLLECTED`, `NEEDS_RESCHEDULE`, `CANCELLED`).<br>- Earn reward points upon collection based on actual waste weight & garbage type rates.<br>- View points transaction history.<br>- Browse **Rewards Catalog** and submit **Reward Redemption** requests. |
| 🚚 **Worker** | Collection Field Agent / Trash Collector | - Register with **National ID** (account requires Admin verification & approval before receiving tasks).<br>- Set working availability slots within assigned geographic service **Areas**.<br>- View current and historical assigned **Collection Requests**.<br>- Perform physical pickups, update request status (`ACCEPTED`, `ON_THE_WAY`, `COLLECTED`).<br>- Record actual garbage weights collected on site.<br>- Earn calculated worker percentage share income per fulfilled collection. |
| 👑 **Admin** | Operations Manager / System Administrator | - Review & approve pending **Worker** applications.<br>- Create and manage **Areas** (geographic bounding coordinates & base service prices).<br>- Define area-based **Availability** time slots for days of the week.<br>- Manage **Garbage Types** catalog (name, image, price per kg).<br>- Manage **Rewards Catalog** (reward title, required points, image).<br>- Review and approve or reject customer **Reward Redemption** requests.<br>- Configure global **Pricing Settings** (worker percentage share, monthly subscription price, min/max collection weight limits).<br>- Monitor customer and worker accounts and system notifications. |

---

## 🗄️ Database Entities & Data Models

| Entity Model | Description | Key Fields & Relations |
| :--- | :--- | :--- |
| `User` | Core identity table for all system users | `user_id`, `first_name`, `last_name`, `email`, `password`, `mobile`, `role`, `is_verified`, `is_active`, `otp`, `reset_password_otp` |
| `Customer` | Extends `User` (1:1) for customer-specific data | `user_id`, `points` balance, `rewardRedemptions`, `subscriptions` |
| `Worker` | Extends `User` (1:1) for collector-specific data | `user_id`, `national_id`, `is_approved`, `approved_at`, `workerRequests`, `workerAvailability` |
| `Admin` | Extends `User` (1:1) for administrator identification | `user_id` |
| `Address` | Customer location details for pickups | `address_id`, `user_id`, `building_num`, `floor`, `location`, `latitude`, `longitude`, `additional_note` |
| `Area` | Geographic service coverage zones | `area_id`, `name`, `north_lat`, `south_lat`, `east_lng`, `west_lng`, `service_price`, `is_active` |
| `Availability` | Area time slots by day of week | `availability_id`, `area_id`, `day_of_week`, `from_time`, `to_time` |
| `WorkerAvailability` | Worker signup for availability slots | `availability_id`, `user_id` (Worker) |
| `GarbageType` | Catalog of recyclable waste types | `garbage_type_id`, `garbage_type_name`, `garbage_type_image`, `price_per_kg` |
| `CollectionRequest` | Scheduled waste collection task | `collection_request_id`, `user_id`, `address_id`, `availability_id`, `request_date`, `quantity`, `collection_img`, `status`, `payment_method`, `scheduled_day`, `scheduled_from_time`, `scheduled_to_time`, `service_price`, `worker_share` |
| `RequestGarbage` | Waste breakdown items inside a collection request | `request_garbage_id`, `collection_request_id`, `garbage_type_id`, `expected_weight`, `actual_weight`, `earned_points` |
| `WorkerCollectionRequest` | Join table for assigning workers to requests | `user_id` (Worker), `collection_request_id`, `assigned_at`, `is_current` |
| `Payment` | Financial transaction for collection or subscription | `payment_id`, `collection_request_id`, `payment_method`, `payment_status`, `payment_amount` |
| `Reward` | Item catalog available for points redemption | `reward_id`, `name`, `required_points`, `image` |
| `RewardRedemption` | Customer reward claim request | `redemption_id`, `user_id` (Customer), `reward_id`, `points_spent`, `status` (`PENDING`, `APPROVED`, `REJECTED`, `DELIVERED`) |
| `PointsTransaction` | Audit log of points earned or spent | `point_id`, `user_id`, `points`, `reason`, `points_date` |
| `PricingSettings` | Global financial configuration parameters | `id` (1), `worker_percentage`, `monthly_subscription_price`, `minimum_collection_weight`, `maximum_collection_weight` |
| `Notification` | User alerts and messages | `notification_id`, `user_id`, `title`, `message`, `is_read` |

---

## 🔌 API Endpoints & Feature Modules

### 1. Authentication & Account Management (`/api/auth`)
- `POST /api/auth/register`: Register new user (Customer or Worker). Sends email OTP.
- `POST /api/auth/verify-otp`: Verify account registration OTP.
- `POST /api/auth/resend-otp`: Resend account verification OTP.
- `POST /api/auth/login`: Authenticate with email & password, returns JWT tokens.
- `POST /api/auth/refresh-token`: Issue new access token using valid refresh token.
- `POST /api/auth/logout`: Revoke active session token.
- `POST /api/auth/forgot-password`: Request password reset OTP via email.
- `POST /api/auth/verify-reset-password-otp`: Verify password reset OTP code.
- `POST /api/auth/reset-password`: Set new password following OTP verification.
- `POST /api/auth/check-token`: Validate active access token.

### 2. User Profile & Account (`/api/user`)
- `GET /api/user/profile`: Retrieve authenticated user details.
- `PUT /api/user/profile`: Update user profile details.
- `GET /api/user/notifications`: List user notifications.

### 3. Addresses Management (`/api/addresses`)
- `POST /api/addresses`: Add new pickup address (Customer).
- `GET /api/addresses`: List authenticated user's saved addresses.
- `GET /api/addresses/:id`: Get address by ID.
- `PUT /api/addresses/:id`: Update address details.
- `DELETE /api/addresses/:id`: Remove address.

### 4. Coverage Areas (`/api/areas`)
- `POST /api/areas`: Create service area with geofencing bounding box & base price (`Admin`).
- `GET /api/areas`: List active coverage areas.
- `GET /api/areas/:id`: Get area details.
- `PUT /api/areas/:id`: Update area configuration (`Admin`).
- `DELETE /api/areas/:id`: Deactivate area (`Admin`).

### 5. Time Availabilities (`/api/availabilities`)
- `POST /api/availabilities`: Define weekly time slot availability for an area (`Admin`).
- `GET /api/availabilities`: List availability slots.
- `GET /api/availabilities/area/:area_id`: Get availability slots for specific area.
- `DELETE /api/availabilities/:id`: Delete availability slot (`Admin`).

### 6. Garbage Types (`/api/garbage-types`)
- `POST /api/garbage-types`: Add new recyclable waste category & price per kg (`Admin`).
- `GET /api/garbage-types`: List all recyclable garbage types.
- `GET /api/garbage-types/:id`: Get garbage type details.
- `PUT /api/garbage-types/:id`: Update garbage type details (`Admin`).
- `DELETE /api/garbage-types/:id`: Delete garbage type (`Admin`).

### 7. Collection Requests (`/api/collection-requests`)
- `POST /api/collection-requests`: Create waste collection request with address, schedule, payment method & expected garbage breakdown (`Customer`).
- `GET /api/collection-requests/addresses/:address_id/availabilities`: Get available collection time slots for a specific customer address (`Customer`).

### 8. Worker Approval & Management (`/api/workers` & `/api/admin/workers`)
- `PATCH /api/workers/:id/approve`: Approve worker account using National ID (`Admin`).
- `GET /api/admin/workers`: List workers with pagination (`Admin`).
- `GET /api/admin/workers/:user_id`: Get worker details (`Admin`).
- `GET /api/admin/customers`: List customers with pagination (`Admin`).
- `GET /api/admin/customers/:user_id`: Get customer details (`Admin`).

### 9. Rewards Catalog (`/api/rewards`)
- `POST /api/rewards`: Add new reward item to catalog (`Admin`).
- `GET /api/rewards`: List available catalog rewards.
- `GET /api/rewards/:reward_id`: Get reward item details.
- `PUT /api/rewards/:reward_id`: Update reward item (`Admin`).
- `DELETE /api/rewards/:reward_id`: Delete reward item (`Admin`).

### 10. Reward Redemptions (`/api/reward-redeems`)
- `POST /api/reward-redeems/:reward_id`: Submit reward redemption claim using points (`Customer`).
- `GET /api/reward-redeems/my_redemptions`: List customer's redemption claims (`Customer`).
- `GET /api/reward-redeems`: List all redemption claims (`Admin`).
- `PUT /api/reward-redeems/approve/:redemption_id`: Approve reward redemption claim (`Admin`).
- `PUT /api/reward-redeems/reject/:redemption_id`: Reject reward redemption claim (`Admin`).

### 11. Pricing Settings (`/api/pricing`)
- `GET /api/pricing`: Get global pricing configuration (`Admin`).
- `PATCH /api/pricing`: Update worker percentage share & subscription prices (`Admin`).

---

## 🔄 Core Business Workflows

```
                        COLLECTION REQUEST LIFECYCLE
                        
  Customer Creates Request        Worker Assigned         Worker On The Way
 [PENDING] -------------------> [ACCEPTED] -------------> [ON_THE_WAY]
                                    |                           |
                                    v                           v
                           [NEEDS_RESCHEDULE]               [COLLECTED]
                                                                |
                                                                v
                                                     Points & Worker Share
                                                         Calculated!
```

1. **Collection Request Lifecycle**:
   - Customer submits a collection request picking a verified address, scheduled day/time slot, and expected waste items.
   - Request starts in `PENDING` status.
   - An available Worker assigned to the area accepts the request (`ACCEPTED`).
   - Worker travels to location (`ON_THE_WAY`).
   - Worker inspects & weighs waste on site, records actual weights, and marks status as `COLLECTED`.
   - If customer is unavailable, status changes to `NEEDS_RESCHEDULE` or `CANCELLED`.

2. **Points & Earnings Calculation**:
   - Upon marking a request as `COLLECTED`, the system calculates:
     - **Customer Points**: `earned_points` per waste type based on `actual_weight * garbage_type_rate`. Points are credited to the customer balance and logged in `PointsTransaction`.
     - **Worker Payout**: `worker_share` calculated as `service_price * (worker_percentage / 100)`.

3. **Reward Redemption Lifecycle**:
   - Customer selects a `Reward` and submits a redemption request.
   - System checks if customer has enough points (`Customer.points >= Reward.required_points`).
   - Points are deducted immediately and request status is set to `PENDING`.
   - Admin reviews request and clicks **Approve** (`APPROVED` -> `DELIVERED`) or **Reject** (`REJECTED` - points are automatically refunded to customer balance).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server (v8+)

### Installation & Local Setup

1. **Clone the repository & install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DATABASE_URL="mysql://root:password@localhost:3306/cash_for_trash"
   JWT_ACCESS_SECRET="your_access_secret"
   JWT_REFRESH_SECRET="your_refresh_secret"
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   EMAIL_USER="your_email@gmail.com"
   EMAIL_PASS="your_email_password"
   ```

3. **Database Migration & Seeding**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **API Documentation**:
   Access interactive Swagger UI at: `http://localhost:3000/api-docs`

---

## 📝 Maintenance & Feature Guidelines

Whenever adding or extending features in this repository, always follow the 6-layer architecture rules defined in [SKILL.md](file:///d:/Desktop/software/work/green%20prject%2018-6-2026/cashForTrachBackend/SKILL.md) and update the corresponding feature section in this `README.md`.