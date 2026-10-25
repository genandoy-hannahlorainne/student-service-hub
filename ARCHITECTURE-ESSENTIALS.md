# PASOA Student Services

## Architecture Essentials

**Purpose:** Fast reference for implementation agents.  
**Full specification:** [ARCHITECTURE.md](./ARCHITECTURE.md)  
**Product requirements:** [PRD.md](./PRD.md)

---

## 1. Core Architectural Decision

Build PASOA as a **shared-backend, multi-client platform**:

```text
React web client  ─┐
                   ├─> Netlify Functions API ─> Neon PostgreSQL
Flutter client   ──┘             │
                                 └─> Netlify Blobs / external services
```

- React is the primary web client for the MVP.
- Flutter is a future/native or cross-platform client.
- Both clients use the same HTTP API, database, authorization rules, and domain contracts.
- Do not create a separate backend for Flutter.
- Use a modular monolith/serverless architecture, not microservices.
- Business rules must be enforced server-side, never only in client screens.

---

## 2. Required Technology Stack

### Clients

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router for production URL routing
- TanStack Query for server state
- React Hook Form + Zod for typed form validation
- Flutter/Dart for the existing cross-platform client

### Backend and infrastructure

- Netlify for hosting, CDN, deploy previews, Functions, scheduled Functions, and environment variables
- Netlify Functions in TypeScript for the API and privileged workflows
- Neon PostgreSQL for relational persistence and transactions
- Netlify Blobs for private files, accessed only through authenticated Functions
- Netlify Identity or institution-approved OIDC through Netlify Functions
- OpenAPI plus generated TypeScript/Dart DTOs for the shared API contract

Do not add backend dependencies or services to the prototype until implementation begins.

---

## 3. Backend Module Boundaries

Keep these as logical modules inside one backend:

1. **Identity and access** — profiles, roles, account status, student verification.
2. **Public content** — landing page, services, policies, announcements.
3. **Provider collaboration** — provider approval, services, availability, fee agreements.
4. **Catalog** — service types, provider offerings, school-supply products, inventory.
5. **Orders and fulfillment** — printing, school supplies, pickup, delivery, status history.
6. **Payments** — cash/e-wallet records, proof, verification, receipts.
7. **Resource hub** — academic rental/request posts and moderation.
8. **Administration and audit** — approvals, configuration, operational monitoring, audit events.

---

## 4. Data Model Essentials

Use:

- UUID primary keys
- UTC `timestamptz`
- Integer money values in centavos plus `currency_code`
- Foreign keys and database constraints
- Soft deactivation for records referenced by history
- Append-only history for statuses and admin decisions
- No raw card or e-wallet credentials

### Required entities

```text
user_profiles
user_roles
providers
services
provider_services
delivery_fee_agreements
products
orders
order_items
printing_requests
printing_files
fulfillments
order_status_events
payments
transaction_receipts
resource_categories
resource_posts
resource_post_reviews
content_entries
audit_events
```

### Key relationships

- A user may have one or more roles.
- A provider belongs to an approved provider account.
- A provider offers one or more services.
- A provider has versioned delivery-fee agreements.
- An order belongs to one student and one provider.
- Printing orders have printing requirements and private files.
- Supply orders have immutable item and price snapshots.
- An order has one fulfillment record, payment record, and receipt.
- An order has many status events.
- A resource post belongs to one author and has one or more moderation reviews.

See the full table definitions and ER diagram in [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 5. Non-Negotiable Business Rules

1. PASOA is a university service platform, not a general marketplace.
2. Only approved/collaborating providers may be publicly listed or receive orders.
3. Delivery fees come from an active PASOA-provider agreement.
4. Providers cannot independently change agreed delivery fees.
5. Student resource posts are private until admin approval.
6. Only academic or school-related resources may be posted.
7. Admin accounts are internal and cannot be created through public registration.
8. Guests can browse but must authenticate before transacting or posting.
9. Server-side code recalculates prices, fees, totals, and inventory.
10. The confirmed order stores immutable provider, item, price, fee, and fulfillment snapshots.
11. Payment status and order status are separate.
12. Historical orders remain readable after a provider, product, or service is deactivated.
13. Every important status or moderation change records actor, timestamp, and reason when applicable.

---

## 6. Main State Machines

### Order

```text
ORDER_PLACED
  -> ACCEPTED
  -> PROCESSING
  -> READY_FOR_PICKUP | OUT_FOR_DELIVERY
  -> COMPLETED
```

Exceptional transitions:

```text
ORDER_PLACED -> REJECTED
ORDER_PLACED -> CANCELLED
ACCEPTED -> CANCELLED
PROCESSING -> CANCELLED  (policy/admin controlled)
Any non-terminal state -> FAILED
```

The server validates the current state, actor role, and allowed transition.

### Resource post

```text
DRAFT -> PENDING_REVIEW -> APPROVED
                      └──> REJECTED -> DRAFT
APPROVED -> ARCHIVED
```

Only `APPROVED` posts are public.

### Provider

```text
PENDING -> APPROVED -> SUSPENDED
PENDING -> REJECTED
SUSPENDED -> APPROVED
APPROVED -> DEACTIVATED
```

---

## 7. API Rules

All application reads and writes go through named Netlify Function endpoints. Clients must not connect directly to Neon.

### Public reads

```text
GET /public/services
GET /public/providers
GET /public/resource-posts
GET /public/content/:slug
```

### Student commands

```text
POST /orders/quote
POST /orders
POST /orders/:orderId/cancel
POST /resource-posts
PATCH /resource-posts/:postId
POST /resource-posts/:postId/submit
```

### Provider commands

```text
GET  /provider/orders
POST /provider/orders/:orderId/accept
POST /provider/orders/:orderId/reject
POST /provider/orders/:orderId/status
PATCH /provider/profile
PATCH /provider/products/:productId
```

### Admin commands

```text
GET   /admin/providers
POST  /admin/providers/:providerId/approve
POST  /admin/providers/:providerId/suspend
POST  /admin/resource-posts/:postId/approve
POST  /admin/resource-posts/:postId/reject
POST  /admin/payments/:paymentId/verify
PATCH /admin/delivery-fee-agreements/:agreementId
PATCH /admin/content/:contentId
```

Use stable error codes, including:

```text
FORBIDDEN
NOT_FOUND
INVALID_STATE
INVENTORY_UNAVAILABLE
FEE_NOT_ACTIVE
FILE_NOT_READY
DUPLICATE_REQUEST
```

---

## 8. Order Creation Must Be Atomic

`POST /orders` must:

1. Authenticate the user and validate the idempotency key.
2. Validate the provider and service offering.
3. Validate uploaded-file references.
4. Lock/check inventory where applicable.
5. Resolve the active delivery-fee agreement.
6. Recalculate subtotal, delivery fee, and total server-side.
7. Create the order and immutable item snapshots.
8. Create fulfillment and payment records.
9. Append the `ORDER_PLACED` status event.
10. Create the receipt snapshot.
11. Commit all writes together.

If any step fails, the system must not return a success-shaped response or create a partial order.

---

## 9. Authorization and Security

Every database access passes through Netlify Function middleware:

1. Validate the session/token.
2. Load the user profile and roles.
3. Check resource ownership or assignment.
4. Check the allowed action and state transition.
5. Run parameterized SQL with least-privilege credentials.

Minimum access model:

| Resource | Guest | Student | Provider | Admin |
|---|---:|---:|---:|---:|
| Published services/providers | Read | Read | Read | Read/write |
| Own profile | No | Own | Own | Read/write |
| Own orders | No | Read/create | Assigned only | Operational |
| Other orders | No | No | No | Controlled |
| Approved resource posts | Read | Read | Read | Read/write |
| Pending/rejected posts | No | Own only | No | Read/write |
| Delivery-fee agreements | No | Applicable fee only | Applicable fee only | Read/write |
| Audit events | No | No | No | Read |

Never rely on hidden navigation or client route guards for authorization.

---

## 10. Private File Handling

Use private storage paths:

```text
printing-files/{userId}/{orderId}/{fileId}
payment-proofs/{userId}/{orderId}/{paymentId}
provider-documents/{providerId}/{documentId}
```

- Validate file type, MIME type, filename, and size.
- Scan or quarantine uploads before provider access.
- Download through an authenticated Function using a short-lived signed URL or one-time token.
- Never expose private buckets publicly.
- Never log file contents, payment proof, or signed URLs.
- Define retention and deletion policies before production.

---

## 11. Client Structure

### React

```text
src/
  app/              # router, providers, auth
  components/       # shared UI and layouts
  features/         # public, student, provider, admin, orders, resources
  lib/              # API, Netlify client, validation, formatting
  types/            # generated/shared types
  styles/
```

Production flow:

```text
Page -> feature hook -> Netlify Function -> Neon/Blobs
  ^          |
  +----------+--> typed loading/error/success state
```

### Flutter

Use equivalent feature boundaries under `student-service-hub/lib/`. Flutter consumes the same HTTP API and DTOs; it does not duplicate pricing, authorization, moderation, or state-transition logic.

---

## 12. UI and UX Direction

Use the **PASOA Bento Campus** design direction:

- Bento grids for dashboards and service discovery.
- Mist Blue page background.
- White and pale-blue cards.
- Navy identity/summary cards.
- Teal service/action cards.
- Mango emphasis cards.
- Glass effects only for overlays, filters, menus, and notifications.
- Role-adaptive layouts:
  - Student: service-first and mobile-friendly.
  - Provider: operational order queue.
  - Admin: dense management and moderation tools.

Accessibility is required: readable contrast, keyboard navigation, labeled forms, non-color status communication, and mobile touch targets.

---

## 13. Required Testing

Test the following before production:

- Fee and total calculations
- State-transition guards
- Role and resource authorization
- RLS is optional defense in depth; Function authorization is mandatory
- Atomic order creation
- Inventory reservation
- Delivery-fee enforcement
- File access and upload validation
- Resource-post moderation visibility
- Idempotent order creation
- Guest, student, provider, and admin end-to-end flows
- Unauthorized access attempts

Run type checks, formatting, unit tests, integration tests, and production builds for both clients.

---

## 14. Implementation Order

1. Define shared enums, DTOs, and API error codes.
2. Create Netlify site, Netlify Functions, Neon databases, and migrations.
3. Implement authentication, profiles, roles, and authorization middleware.
4. Replace React in-memory navigation with protected URL routes.
5. Connect public services and provider reads.
6. Implement printing quote and atomic order creation.
7. Implement school-supply catalog and inventory.
8. Implement provider order acceptance and status tracking.
9. Implement resource-post submission and moderation.
10. Connect Flutter to the stable shared API.
11. Add payment proof, notifications, monitoring, backups, and production policies.

For detailed schema definitions, API behavior, deployment notes, security controls, and migration rationale, consult [ARCHITECTURE.md](./ARCHITECTURE.md).

