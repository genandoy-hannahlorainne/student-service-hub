# Bugfix Requirements Document

## Introduction

The PASOA Student Services Hub has multiple auth flow failures affecting login, registration, and dashboard access:

1. **Student dashboard unreachable after login** — A concurrency race in `loadProfile` (AuthContext.tsx) uses a boolean `loadingRef` to deduplicate concurrent calls. The race causes auth state to never transition to `authenticated`, so students cannot reach their dashboard.
2. **Registration errors not surfaced** — In `completeRegistration` Path B, a thrown `registerProfile` error is never passed to `setAuthError`, so `authError` stays null and the Register form may not surface the message correctly.
3. **Admin can self-register as a student** — An admin (by GoTrue `app_metadata`) with no DB profile who logs in via the PUPTian portal is redirected to the register form and can complete self-registration as a student, creating a data integrity mismatch (GoTrue `app_metadata` says admin, DB role says student).

The fixes target concurrency safety, error propagation, and portal role enforcement. Affected files: `src/context/AuthContext.tsx` (Bugs A, B, D), `src/screens/Auth.tsx` (Bug C). No server-side changes are required — `netlify/functions/me.ts` admin auto-seed is already correct and `netlify/functions/register.ts` already blocks the admin role.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the Netlify Identity widget fires an "login" event concurrently with a programmatic `loadProfile` call (e.g., during `completeRegistration`) THEN the boolean `loadingRef` guard is manually reset to `false` by `completeRegistration`, allowing two simultaneous `loadProfile` calls that corrupt auth state and may prevent the transition to `authenticated"

1.2 WHEN a second `loadProfile` call starts while `loadingRef.current` is already `true` THEN `loadProfile` returns an empty array immediately without ever touching React state, so the auth status may never transition to `authenticated" and the student cannot reach the dashboard

1.3 WHEN `registerProfile` throws an error (e.g., 400 invalid student number, 500 DB error) during `completeRegistration` Path B (email-confirmed user completing their profile) THEN `setAuthError` is never called and `authError` stays `null`, so the Register form may not surface the error message correctly

1.4 WHEN an admin (identified by GoTrue `app_metadata` role "admin" or "co_admin") with no DB profile logs in via the PUPTian student portal and is redirected to the register form THEN the admin can complete self-registration as a student, creating a data integrity mismatch (GoTrue `app_metadata` says admin, DB role says student)

### Expected Behavior (Correct)

2.1 WHEN `loadProfile` is called concurrently THEN the system SHALL use a monotonic session counter (`sessionCounterRef`) so that only the most recent call's result is applied to auth state; older in-flight calls SHALL be discarded via session-ID comparison, and the manual `loadingRef` reset in `completeRegistration` and the `loadingRef` guard in the `onLogin` handler SHALL be removed

2.2 WHEN a `loadProfile` call's captured session ID is stale (a newer call has started before it resolves) THEN the system SHALL discard the stale result without modifying auth state

2.3 WHEN `registerProfile` throws during `completeRegistration` Path B THEN the system SHALL catch the error, call `setAuthError` with the error message, and rethrow the error so the Register form can surface it

2.4 WHEN an admin (by GoTrue `app_metadata`) reaches the Register form THEN the system SHALL block the form from submission and display "Admin accounts cannot self-register. Contact the system administrator."

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a student with an existing DB profile logs in via the PUPTian portal THEN the system SHALL CONTINUE TO load the profile, transition to `authenticated`, and navigate to the student dashboard

3.2 WHEN `loadProfile` is called once with no concurrency THEN the system SHALL CONTINUE TO fetch the DB profile and transition auth status to `authenticated` or `needs_registration` as appropriate

3.3 WHEN an admin with an existing DB profile logs in via the student portal THEN the system SHALL CONTINUE TO call `portalRoleCheck`, call `logout`, and show the portal mismatch error ("Admin accounts must sign in through the Admin portal.")

3.4 WHEN a new student signs up with no existing session (Path A) THEN the system SHALL CONTINUE TO create the GoTrue account, throw `CONFIRMATION_REQUIRED`, and show the "check your email" message

3.5 WHEN an admin (by GoTrue `app_metadata`) with no DB profile logs in THEN the `me.ts` endpoint SHALL CONTINUE TO auto-seed the admin profile and roles so the admin is authenticated without self-registration

3.6 WHEN `register.ts` receives a request with role "admin" or "co_admin" THEN the server SHALL CONTINUE TO reject with 403 "This role cannot be self-registered"

3.7 WHEN the Register form is used by a legitimate student or provider (not an admin by `app_metadata`) THEN the system SHALL CONTINUE TO allow self-registration as student or provider with the existing field validation
