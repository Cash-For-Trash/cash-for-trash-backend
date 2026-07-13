<!-- markdownlint-disable -->

---
name: nodejs-layered-api
description: Use this skill whenever building, extending, or reviewing any REST feature in this Node.js/Express + Prisma backend (e.g. "add a Products feature", "create a CRUD for Rewards", "add an endpoint to approve workers", "review my new controller"). It defines the mandatory layered architecture (routes -> validation -> middleware -> controller -> service -> utils/Prisma), naming conventions, error handling, and response format used across the codebase. ALWAYS apply this skill before writing any new route, controller, service, or validation file, even if the user doesn't explicitly mention architecture or patterns -- consistency with existing modules (like auth) is required, not optional.

---

# Node.js Layered API Architecture

This project uses a strict 6-layer architecture for every feature (auth, products, orders, rewards, etc.).
**Every new feature must reproduce this exact structure.** Do not improvise a different pattern, do not
put logic in the wrong layer, and do not skip a layer "to save time."

## The 6 layers, in request order

```
Client
  -> routes/<feature>_routes.js        (URL -> pipeline of middleware + controller)
  -> validations/<feature>_validation.js  (express-validator rule arrays)
  -> middlewares/*                     (validate, authenticate, authorize)
  -> controllers/<feature>_controller.js  (thin: call service, wrap response)
  -> services/<feature>_services.js    (ALL business logic + Prisma calls)
  -> utils/* + Prisma client           (reusable, framework-agnostic helpers)
```

**Dependency direction is one-way only**: routes -> controllers -> services -> utils/Prisma.
A lower layer must NEVER import from a higher layer (a service never imports from a controller,
a util never imports from a service, etc.).

---

## Layer 1: Routes (`routes/<feature>_routes.js`)

- One `Router()` per feature file.
- Each route is a single line: `router.<verb>(path, ...validationChain, validate, [authenticate], [authorize(...roles)], controllerFn)`.
- Middleware order is always: validation rules -> `validate` -> `authenticate` (if the route needs a logged-in user) -> `authorize(...)` (if the route is role-restricted) -> controller.
- Add a `@openapi` JSDoc block above every route: tags, summary, requestBody schema ref, and response codes (include the realistic ones: 400 validation, 401/403 auth, 404 not found, 409 conflict).
- Never put logic, try/catch, or Prisma calls in a route file. It is pure wiring.
- Register the new router in the app's central router index the same way `auth_routes.js` is mounted.


```js
import { Router } from "express";
import { createProduct } from "../controllers/product_controller.js";
import { createProductValidation } from "../validations/product_validation.js";
import { validate, authenticate } from "../middlewares/auth_middleware.js";
import { authorize } from "../middlewares/roles_middleware.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

router.post(
  "/products",
  createProductValidation,
  validate,
  authenticate,
  authorize(ROLES.ADMIN),
  createProduct
);

export default router;
```

## Layer 2: Validation (`validations/<feature>_validation.js`)

- Uses `express-validator`. One exported array per endpoint, named `<action>Validation` or `<action>_validation` (match the casing already used in the sibling files you're extending).
- Validate every field the controller/service will read from `req.body`/`req.params`/`req.query`.
- Always chain `.withMessage(...)` on every rule -- never leave a rule silently defaulting to express-validator's generic message.
- Use `.trim()` and `.normalizeEmail()` for strings/emails, `.isLength()`/`.matches()` for formats.
- Use `.if(body("otherField").equals(...))` for conditional requiredness (see `national_id` in the auth example).
- Use `.custom((value, { req }) => ...)` for cross-field checks (e.g. confirm_password === password).
- This layer never throws directly and never touches the database -- it only attaches results that `validate` (a middleware) will read.

## Layer 3: Middleware (`middlewares/`)

Three reusable pieces already exist -- reuse them, don't duplicate:

- **`validate`** (`auth_middleware.js`): reads `validationResult(req)`; on failure builds `new AppError("Validation failed", 400)`, attaches `.errors = errors.array()`, calls `next(error)`. Use this exact middleware after every validation chain, in every feature.
- **`authenticate`** (`auth_middleware.js`): reads `Authorization: Bearer <token>`, verifies with `JWT_ACCESS_SECRET`, sets `req.user = decoded`. Add to any route requiring a logged-in user.
- **`authorize(...roles)`** (`roles_middleware.js`): factory that checks `req.user.role` against the allowed roles list, throws `AppError("Access denied.", 403)` otherwise. Add after `authenticate` on role-restricted routes. Always pass roles via the `ROLES` constant, never a raw string.

Only add a new middleware file if the concern is genuinely new (e.g. file upload, rate limiting). Never re-implement JWT verification or role checks inline in a controller.

## Layer 4: Controller (`controllers/<feature>_controller.js`)

Controllers are intentionally boring. Every exported function follows this exact shape:

```js
export const actionName = async (req, res, next) => {
  try {
    const result = await featureService.actionName(req.body); // or req.params/req.query as needed
    return successResponse(res, "Human-readable success message.", result, statusCode);
  } catch (error) {
    next(error);
  }
};
```

Rules:
- **Every** async controller must have try/catch -> `next(error)`. No exceptions -- an uncaught rejection will not reach the error handler and will hang/crash the request.
- Controllers never contain `if` statements about business rules, never call Prisma directly, never build error JSON by hand.
- Use `successResponse(res, message, data, statusCode)` from `utils/response.js` for every success reply. Default statusCode is 200; use 201 for creation.
- Pass exactly what the service needs (`req.body`, or merge in `req.params`/`req.user.user_id` when the service needs the authenticated user's id).

## Layer 5: Service (`services/<feature>_services.js`)

This is where all thinking happens. Services take plain data in, return plain data out -- **no `req`/`res` ever appears here.**

Standard shape for every service function:
1. Destructure the input object.
2. Guard clauses first -- look up anything needed to validate business rules (existence, ownership, conflicts, state) and `throw new AppError(message, statusCode)` immediately when a rule fails. Fail fast, before doing any writes.
3. Do the actual work: hash/generate/transform, then call Prisma.
4. Wrap multi-table writes that must succeed or fail together in `prisma.$transaction(async (tx) => { ... })`.
5. Return a **hand-shaped plain object** -- never spread a raw Prisma record back out (it may contain `password`, internal tokens, etc.). Explicitly list the fields that are safe to return.
6. Don't add any comment while writing the code

```js
export const createProduct = async (data) => {
  const { name, description, price, stock_quantity } = data;

  if (price <= 0) {
    throw new AppError("Price must be greater than zero.", 400);
  }

  const product = await prisma.product.create({
    data: { name, description, price, stock_quantity },
  });

  return {
    product_id: product.product_id,
    name: product.name,
    price: product.price,
  };
};
```

Common AppError status codes used across this codebase (stay consistent with these):
- `400` — validation/business rule failure (bad input, expired OTP, invalid state)
- `401` — auth failure (bad credentials, bad/expired token)
- `403` — forbidden (wrong role, unverified email, inactive account)
- `404` — resource not found
- `409` — conflict (duplicate unique field, e.g. email/national_id already exists)

## Layer 6: Utils (`utils/`) + Prisma

Pure, framework-agnostic helper modules. No imports flow upward from here.

- `app_error.js` — `AppError extends Error` with `.statusCode`. The only way errors should be thrown anywhere in services/middleware.
- `response.js` — `successResponse` / `errorResponse`. The only way response JSON should be built.
- `hash.js` — bcrypt wrappers.
- `jwt.js` — sign/verify access + refresh tokens, using expirations from `constants.js`.
- `otp.js` — OTP generation/expiration/checking.
- `mail.js` / `mail_template.js` — email sending / HTML templates. Templates are pure functions returning strings, no side effects.
- `constants.js` — every magic string/number lives here (roles, OTP length, JWT expiry, pagination defaults). **Never hardcode these values in a service or validation file.**

When a new feature needs a new reusable helper (e.g. image upload, pagination helper), add it here as its own pure module, not inline in a service, but make sure to follow the same naming conventions and architecture then add it in skill md in this section.

---

## Response & error contract (do not deviate)

Every success response:
```json
{ "success": true, "statusCode": 200, "message": "...", "data": { ... } }
```

Every error response (built once, in `error_middleware.js`, never elsewhere):
```json
{ "success": false, "statusCode": 400, "message": "...", "errors": null }
```

---

## Prisma / schema conventions

- Every model's primary key is `<model>_id String @id @default(cuid())`, except join/role tables which use the parent's `user_id` as their own `@id` (see `Customer`, `Worker`, `Admin` — one-to-one extension of `User` When calling them use it from `constants.js` file).
- Snake_case for all column and field names (`first_name`, `is_verified`, `created_at`).
- Every model that's frequently queried by a foreign key or filtered field has an `@@index([...])` — add one for any new frequently-queried column.
- Money fields: `Decimal @db.Decimal(10, 2)`. Timestamps: `created_at DateTime @default(now())`, `updated_at DateTime @updatedAt`.
- Role-specific tables (`Customer`, `Worker`, `Admin`) extend `User` 1:1 via `onDelete: Cascade`. When registering a new user with a role, always create the matching role row **inside the same `prisma.$transaction`** as the `User` row (see `auth_services.js: register`).
- All Database tables will find them in `../prisma/schema.prisma`.

---

## Checklist for adding a brand-new feature (e.g. "Products")

1. confirm the Prisma model in `schema.prisma`, run `prisma migrate` (don't modify the database without my knowledge).
2. `validations/product_validation.js` — one array per endpoint.
3. `services/product_services.js` — guard clauses, Prisma calls, hand-shaped return objects, `AppError` for every failure path.
4. `controllers/product_controller.js` — thin wrappers, try/catch -> next(error), `successResponse`.
5. `routes/product_routes.js` — wire validation -> validate -> [authenticate] -> [authorize] -> controller, with `@openapi` docs.
6. Mount the router in the app's route index.
7. Sanity-check: does every async controller have try/catch? Does every service guard clause throw `AppError` with the right status code? Does every Prisma write that touches multiple tables use `$transaction`? Are all imported template/helper functions actually defined and exported where they're imported from?
8. check `utils/` and reuse it's files if possible, if not create a new file and reuse it's components, but always add that file in `utils/` directory and import it from there.
9. Always use Constants from `constants.js`.

## Known pitfalls in this codebase (avoid repeating them in new code)

- A controller missing try/catch will silently break error handling — always double check every async controller function has it, even simple ones.
- Don't reference a helper function (e.g. an email template) without confirming it's actually exported from its module — a typo'd or missing export throws a `ReferenceError` at runtime, not a caught `AppError`.
- Don't leak raw Prisma rows in a response — always hand-pick the fields to return, especially excluding `password`, OTPs, and internal tokens.

---

## Notes

- I want to feel that the same developer write the whole project, so be consistent with the code style, naming conventions, and the architecture.
- Try to make the code more readable and maintainable.
- If you want to refactor any thing that didn't written in this file, ask me first and if I said to you do it and refactor the skill file then do that.
- Don't add any comment while writing the code.