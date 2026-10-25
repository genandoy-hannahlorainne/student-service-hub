# PASOA Student Services

## Product Requirements Document

**Version:** 1.0  
**Product:** PASOA Student Services  
**Institution:** Polytechnic University of the Philippines - Taguig  
**Audience:** PUP Taguig students, approved service providers, guests, PASOA administrators, and the project team  
**Status:** Product definition for the initial web platform

---

## 1. Product Summary

PASOA Student Services is a web-based university service and resource platform for PUP Taguig. It gives students one trusted place to access urgent school-related services and materials, while giving approved providers and PASOA administrators the tools to fulfill, moderate, and monitor those services.

The product focuses on:

1. Printing services
2. School-supply purchasing
3. School-resource rentals and requests
4. Pickup and provider delivery
5. Cash and supported e-wallet payments
6. Order and transaction tracking
7. Administrator-approved student resource listings

PASOA is not a general marketplace. Transactions and listings must support legitimate academic or school-related needs and must be limited to participating providers and moderated users.

---

## 2. Problem Statement

PUP Taguig students may need to print documents, obtain school supplies, or find academic equipment with little notice. Existing options can be difficult to discover and coordinate, especially when:

- Nearby printing shops or suppliers are unavailable or already closed.
- Students do not know which providers officially participate with PASOA.
- Printing requirements, prices, delivery arrangements, and fees are communicated inconsistently.
- Students cannot easily monitor whether an order is accepted, being processed, or ready.
- Academic resources such as typewriters, calculators, laptops, projectors, and textbooks are difficult to find or rent.
- Student-created rental posts need moderation to keep the platform relevant and safe.

PASOA centralizes these services and makes each transaction more predictable, visible, and manageable.

---

## 3. Product Goals

### Primary goals

- Make school-related services discoverable from one university-focused platform.
- Let students submit complete printing and school-supply orders without repeated manual coordination.
- Connect students only with approved and collaborating service providers.
- Provide clear pickup and delivery choices, including agreed delivery fees.
- Give students visibility into order and transaction status.
- Enable a moderated, academic-only resource rental hub.
- Give administrators control over users, providers, services, posts, orders, content, and transactions.

### Success outcomes

- A student can go from service discovery to a confirmed request with all required details.
- A provider can receive, accept or reject, fulfill, and update the status of an order.
- An administrator can approve providers and resource posts before they become publicly visible.
- Students can understand the total amount, payment method, fulfillment method, and current status of every applicable transaction.

### Non-goals for the initial release

- A general consumer marketplace.
- Public administrator registration.
- Unmoderated user-generated listings.
- Independent provider changes to agreed delivery fees.
- A full logistics or courier network.
- In-app chat as a replacement for structured order information.
- Automated payment settlement or financial reconciliation beyond recording payment details and proof where needed.

---

## 4. Target Users and Roles

### 4.1 PUPTian student

The primary user. A verified or registered PUP Taguig student can:

- Browse services and approved providers.
- Submit printing requests and upload files.
- Purchase available school supplies.
- Choose pickup or delivery where supported.
- Choose an available payment method.
- Confirm transaction details before submission.
- Track orders and view transaction records.
- Create resource rental requests or listings.
- View the status and reason for an approved or rejected resource post.

### 4.2 Service provider

An approved printing shop, school-supply provider, or other participating provider can:

- Maintain its provider profile and service availability.
- Manage listed services, products, prices, and fulfillment options.
- Receive and review relevant orders.
- Accept or reject requests with an explanation where applicable.
- Update order status.
- Fulfill pickup or delivery orders.
- Use only the delivery fee agreed with PASOA.

Provider accounts are created or approved through the PASOA administrator workflow. Providers cannot publicly self-activate as official collaborators.

### 4.3 Guest

A visitor who does not have an account can:

- View the landing page and public information.
- Browse public services.
- View participating providers.
- Browse approved academic-resource posts.

Registration or login is required before a guest can submit an order, request, rental post, payment, or other user-specific action.

### 4.4 Administrator

An internal PASOA operator can:

- Manage users and roles.
- Approve, reject, activate, deactivate, and manage providers.
- Configure provider services and agreed delivery fees.
- Approve or reject student resource posts with a reason.
- Manage orders, transactions, payments, and operational statuses.
- Manage public website content, announcements, and official posts.
- Monitor platform activity and maintain compliance with PASOA rules.

Admin accounts are assigned internally and must not appear as a public registration choice.

### 4.5 Authorized co-admin

If enabled by PASOA, a co-admin may create official posts and announcements and perform explicitly granted moderation or content-management actions. Permissions must be narrower than the primary administrator unless PASOA defines otherwise.

---

## 5. Product Experience and UI Direction

The product should use the **PASOA Bento Campus** visual direction:

- Bento-grid layouts for dashboards and service discovery.
- White and pale-blue cards on a Mist Blue background.
- Navy anchor cards for identity and important summaries.
- Teal service cards for primary actions.
- Mango cards for recommendations and high-priority calls to action.
- Soft glassmorphism only for overlays, menus, filters, and notifications.
- Role-adaptive navigation and dashboard density.
- Clear status badges, timelines, empty states, and confirmation summaries.

Recommended foundation:

- Campus Navy: `#123B5D`
- PASOA Teal: `#0F8B8D`
- Mango: `#F4B942`
- Mist Blue: `#F3F7FA`
- Ink Navy: `#102A43`
- Slate Gray: `#627D98`
- Border: `#D9E2EC`

Visual style must not reduce accessibility, especially contrast, touch-target size, form clarity, or status comprehension.

---

## 6. Information Architecture

### Public website

- Landing page
- Services
- About PASOA
- How it works
- Contact and support
- Provider partnership information
- Terms, services, privacy, and platform rules
- Public provider directory
- Approved resource listings

### Authentication

- Student login and registration
- Provider login and onboarding
- Guest registration
- Internal administrator login
- Password recovery and account status handling

### Student portal

- Student dashboard
- Browse services
- Printing service
- Printing order confirmation
- School supplies
- Resource rental hub
- Create rental post
- My rental-post status
- Order tracking
- Transaction receipt/history

### Provider portal

- Provider dashboard
- Provider profile
- Services and availability
- Incoming orders
- Order detail and status updates
- Pickup and delivery operations

### Administrator portal

- Admin dashboard
- User management
- Provider management
- Service and fee management
- Rental-post approval queue
- Orders and transaction monitoring
- Website and announcement management

---

## 7. Functional Requirements

### FR-01: Authentication and access control

1. The system must support separate student, provider, guest, and administrator access patterns.
2. Guests may browse public information without registering.
3. A user must authenticate before performing a transaction or creating a resource post.
4. Public registration must expose only the roles approved for public registration: PUPTian and Service Provider.
5. Administrator accounts must be provisioned internally.
6. The system must prevent a user from accessing screens or actions outside their role.
7. Account status must support at least active, pending, suspended, and rejected where applicable.

### FR-02: Service discovery

1. The system must expose the three primary services:
   - Printing Services
   - School Supplies
   - School Resource Rental
2. Each service must explain its process, requirements, available fulfillment methods, and applicable fees.
3. Only active, approved providers and available services may be shown as bookable or purchasable.
4. Guests may view public service and provider information but must be prompted to register before transacting.

### FR-03: Printing orders

1. A student must be able to select an approved printing provider.
2. A student must be able to upload one or more documents accepted by the configured file policy.
3. A student must specify printing requirements, including applicable options such as:
   - Number of copies
   - Page range
   - Color or black and white
   - Paper size or type
   - Single-sided or double-sided
   - Finishing requirements
   - Special instructions
4. The system must calculate or display the service fee and any applicable delivery fee before confirmation.
5. The student must choose pickup or delivery where supported.
6. The student must choose an available payment method.
7. The provider must be able to accept or reject the request.
8. The student must see a confirmation summary before the request is submitted.

### FR-04: School-supply orders

1. Students must be able to browse participating-provider inventory.
2. Products must support at least name, description, price, availability, provider, and quantity.
3. Students must be able to select quantities and add eligible products to an order.
4. The system must apply the provider’s agreed delivery fee when delivery is selected.
5. The system must prevent checkout when requested quantities are unavailable.
6. The order must show product fee, delivery fee, total amount, fulfillment method, and payment method before confirmation.

### FR-05: Pickup and delivery

1. Applicable services must expose pickup, delivery, or both according to provider configuration.
2. Pickup must display the provider and pickup instructions.
3. Delivery must collect the required delivery location details.
4. Delivery fees must use the amount mutually agreed between PASOA and the provider.
5. A provider must not independently change an agreed delivery fee.
6. Any fee change must require an administrator workflow and a new agreement record or approval.
7. The selected fulfillment method and fee must be stored with the transaction and remain visible in its history.

### FR-06: Payment and transaction confirmation

1. The initial release must support cash and configured e-wallet payment methods.
2. E-wallet transactions may require proof-of-payment upload or a payment reference.
3. Before submission, the student must review:
   - Selected service
   - Provider
   - Items or printing details
   - Quantities
   - Pickup or delivery method
   - Delivery location where applicable
   - Service or product fee
   - Delivery fee
   - Total amount
   - Payment method
4. The student must explicitly confirm the details before the system creates the transaction.
5. A receipt or transaction record must be generated after successful submission.
6. The system must not represent an unverified e-wallet payment as completed.

### FR-07: Order tracking

1. Applicable orders must use a consistent status lifecycle:
   - Order Placed
   - Accepted
   - Processing
   - Ready for Pickup or Out for Delivery
   - Completed
2. The system must support rejection, cancellation, and failed-payment states where applicable.
3. Only authorized providers or administrators may update fulfillment status.
4. Students must see the current status, status history, provider, fulfillment method, and relevant next step.
5. Status changes should include a timestamp and the actor responsible.

### FR-08: School Resource Rental Hub

1. The hub must support both:
   - Looking For: a request for an academic resource.
   - Available for Rent: an offer of an academic resource.
2. Posts must support predefined categories:
   - Typewriter
   - Calculator
   - Laptop
   - Projector
   - Books
   - School Equipment
   - Project Materials
   - Other School Resources
3. Posts must include a title, type, category, description, availability or request details, and contact or transaction instructions appropriate to the product.
4. The description should be limited to 40–70 words in the initial experience to keep posts concise.
5. Only academic or school-related resources may be posted.
6. A student post must enter Pending Admin Review after submission.
7. An approved post becomes visible in the public/student resource hub.
8. A rejected post must remain private to its author and include the administrator’s reason.
9. Students must be able to view the status of their own posts.
10. Administrators and authorized co-admins may publish official posts or announcements without the student approval flow.

### FR-09: Provider collaboration and management

1. PASOA must be able to record a provider’s collaboration and approval status.
2. A provider must not appear as active until PASOA approves the provider and its applicable services and delivery terms.
3. Provider records must include contact information, service areas, operating information, and agreed delivery fees where relevant.
4. Administrators must be able to activate, suspend, or deactivate a provider.
5. Deactivated providers must not receive new orders but must retain historical transaction records.

### FR-10: Administration and moderation

1. Administrators must have queues for pending provider approvals, resource posts, and operational orders.
2. Administrators must be able to approve or reject resource posts and record a reason.
3. Administrators must be able to manage public service descriptions, provider visibility, announcements, and policy content.
4. Administrators must be able to search and filter users, providers, posts, orders, and transactions.
5. Administrative actions affecting visibility, fees, approval, or status must be auditable.
6. The system must provide clear error messages for invalid input, failed uploads, unavailable inventory, rejected payments, and unauthorized actions.

---

## 8. Core User Flows

### 8.1 Student printing flow

1. Student signs in.
2. Student opens Printing Services.
3. Student selects an approved provider.
4. Student uploads a document.
5. Student enters printing specifications and special instructions.
6. Student chooses pickup or delivery.
7. Student chooses cash or e-wallet.
8. System calculates the service fee, delivery fee, and total.
9. Student reviews and confirms the transaction.
10. System creates the order and receipt.
11. Provider accepts or rejects the order.
12. Provider processes the order and updates status.
13. Student picks up the order or receives delivery.
14. Order becomes Completed.

### 8.2 School-supply purchase flow

1. Student opens School Supplies.
2. Student selects a provider and available products.
3. Student enters quantities.
4. Student chooses pickup or delivery.
5. Student chooses payment method and supplies required payment details.
6. System displays the complete confirmation summary.
7. Student confirms and receives a transaction record.
8. Provider accepts, prepares, and completes the order.

### 8.3 Resource-post flow

1. Student signs in.
2. Student chooses Looking For or Available for Rent.
3. Student selects a category.
4. Student writes a concise 40–70 word description.
5. Student submits the post.
6. System marks the post Pending Admin Review.
7. Administrator approves or rejects it.
8. Approved posts become visible.
9. Rejected posts remain private and show the rejection reason.

### 8.4 Provider onboarding flow

1. PASOA contacts a potential provider.
2. Provider agrees to collaborate.
3. PASOA and provider agree on services, operating terms, and delivery fee.
4. Administrator creates or approves the provider account.
5. Administrator configures services and agreed fees.
6. Provider becomes visible and active.

---

## 9. Data and Business Rules

### Core entities

- User
- Role
- Provider
- Provider collaboration agreement
- Service
- Product
- Inventory item
- Printing request
- Uploaded file
- Resource post
- Resource-post review
- Order
- Order item
- Fulfillment method
- Delivery fee agreement
- Payment
- Transaction receipt
- Status history
- Announcement or website content

### Business rules

1. A provider must be approved before being publicly listed.
2. A delivery fee is a PASOA-provider agreement, not a provider-only setting.
3. A resource post is private until approved.
4. Resource posts must be related to academic or school activities.
5. Admin accounts are internal and cannot be created through public registration.
6. Every submitted order must preserve the price, delivery fee, provider, and fulfillment choice shown at confirmation.
7. Historical transactions must remain readable even if a provider, product, or service is later deactivated.
8. A transaction must have one accountable owner for each status change.
9. Payment status and order status are separate concepts; a payment can be pending while an order is not yet accepted.

---

## 10. Non-Functional Requirements

### Usability

- The primary student flows should be understandable without training.
- The interface must be responsive and usable on mobile devices.
- Important actions must have clear labels and confirmation states.
- Forms must preserve user input when validation fails where practical.
- Empty, loading, success, and error states must be designed for every data-driven view.

### Accessibility

- Meet WCAG 2.1 AA targets where applicable.
- Maintain readable color contrast for text and status indicators.
- Do not communicate status through color alone.
- Support keyboard navigation on the web.
- Provide labels and useful error messages for form controls and uploads.

### Security and privacy

- Enforce role-based authorization on the server and client.
- Protect uploaded files from unauthorized access.
- Validate file type, size, and content-handling policy.
- Do not expose private student contact or transaction data to guests.
- Store only the personal and payment information necessary for the service.
- Record administrative actions involving moderation, fees, permissions, and status.

### Reliability

- A failed submission must not create a misleading success state.
- Order confirmation must be idempotent to prevent duplicate transactions.
- Status history and receipts must remain available after refresh or re-login.
- Provider or inventory unavailability must be shown before confirmation whenever possible.

### Performance

- Public pages should load quickly on typical mobile connections.
- Service browsing and order status views should provide feedback during loading.
- File uploads should show progress and actionable failure messages.

---

## 11. MVP Release Scope

### Must have

- Public landing page and service information.
- Student, provider, guest, and internal admin access patterns.
- Student dashboard.
- Printing request with file upload and requirements.
- School-supply browsing and quantity selection.
- Resource rental posts with admin approval.
- Pickup and delivery selection.
- Configured cash and e-wallet payment recording.
- Transaction confirmation summary.
- Order status tracking.
- Approved provider management.
- Admin moderation and order monitoring.
- Responsive web experience.

### Should have

- Transaction history and downloadable receipt.
- Provider availability management.
- Announcements and official admin posts.
- Search and filtering for services and resource posts.
- Email or in-app notifications for important status changes.

### Could have later

- Integrated e-wallet payment verification.
- Student ratings and provider feedback.
- Favorites and saved resources.
- Automated service recommendations.
- In-app support messaging.
- Analytics dashboards and operational reports.
- Native mobile release using the Flutter client.

---

## 12. Acceptance Criteria

The MVP is ready for stakeholder review when:

1. A guest can browse services and approved resource posts without an account.
2. A student can register or log in and access only student functions.
3. A student can create a complete printing request with an uploaded file, specifications, fulfillment method, payment method, and confirmation.
4. A student can select school supplies, quantities, provider, fulfillment method, and payment method and see the final total before submission.
5. The system uses the configured PASOA-provider delivery fee and does not allow an ordinary provider user to change it.
6. A student-submitted resource post is not publicly visible until an administrator approves it.
7. An administrator can reject a post and provide a reason visible to its author.
8. A provider can accept or reject an order and update its allowed status.
9. A student can see the order timeline and the current next step.
10. A transaction receipt preserves the details confirmed by the student.
11. An administrator can manage providers, posts, services, orders, and website content.
12. Unauthorized users cannot access protected role functions.
13. Mobile and desktop layouts support the primary browse, submit, confirm, and track flows.
14. Validation, upload, payment, authorization, and submission errors are explicit and actionable.

---

## 13. Open Decisions

The following decisions must be confirmed by PASOA before production implementation:

1. How PUP Taguig student identity is verified.
2. Whether provider registration is self-service, admin-invited, or both.
3. Which e-wallet services are supported and how payment proof is verified.
4. Maximum upload file size, accepted file types, retention period, and malware scanning policy.
5. Whether delivery is limited to campus, nearby locations, or a defined service radius.
6. How delivery locations and student contact details are collected and protected.
7. Cancellation, refund, and failed-order policies.
8. Whether rental transactions are completed inside PASOA or coordinated externally.
9. Whether student-to-student contact details are shown directly or mediated by the platform.
10. Who may act as co-admin and which permissions they receive.
11. The final official project-team and support-contact content for the landing page.
12. The source of truth and API contract shared by the React website and Flutter application.

---

## 14. Current Project Alignment

The repository already contains a React web prototype with public, student, guest, provider, and administrator screens under [`src/screens`](./src/screens), coordinated by [`src/App.tsx`](./src/App.tsx). It also contains a Flutter client under [`student-service-hub`](./student-service-hub) with shared routes in [`student-service-hub/lib/app/app_routes.dart`](./student-service-hub/lib/app/app_routes.dart).

The current interfaces are prototypes and should be treated as the presentation layer for this PRD. Before production release, the project still needs:

- A shared backend and persistent data model.
- Real authentication and role authorization.
- File storage and upload validation.
- Provider, inventory, order, payment, and moderation APIs.
- Fee-agreement and audit-log support.
- Error, loading, empty, and permission states connected to real data.
- A decision on whether React or Flutter Web is the primary web client, or whether both consume the same API.

