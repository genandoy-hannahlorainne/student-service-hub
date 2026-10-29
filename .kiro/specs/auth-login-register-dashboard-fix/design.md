# Auth Login / Register / Dashboard Fix Bugfix Design

## Overview

The PASOA Student Services Hub has three related auth-flow defects that block students from reaching their dashboard, hide registration errors, and let admins self-register as students.

1. **Concurrency race in `loadProfile` (Bugs A + D)** — A boolean `loadingRef` guard deduplicates concurrent `loadProfile` calls. When two calls overlap (e.g., the Netlify Identity widget fires a `"login"` event at the same moment `completeRegistration` programmatically calls `loadProfile`), the guard either makes the second call return an empty array immediately — so auth status never transitions to `"authenticated"` — or gets manually reset to `false` by `completeRegistration`, allowing two truly simultaneous calls whose results race and corrupt state. The fix replaces the boolean guard with a **monotonic session counter** (`sessionCounterRef`): every call increments the counter, captures its session ID, and discards its own result if a newer call has already started. The manual reset and the `onLogin` deduplication guard are removed entirely.

2. **Registration errors not surfaced (Bug B)** — In `completeRegistration` Path B (an email-confirmed user completing their profile), a thrown `registerProfile` error is never caught, so `setAuthError` is never called and `authError` stays `null`. The Register form cannot surface the message. The fix wraps the `registerProfile` call in a try/catch that calls `setAuthError` with the message and rethrows so the form's catch block can display it.

3. **Admin can self-register as a student (Bug C)** — An admin (identified by GoTrue `app_metadata.roles` containing `"admin"` or `"co_admin"`) with no DB profile who logs in via the PUPTian student portal is redirected to the Register form. The form never inspects `app_metadata`, so the admin can complete self-registration as a student, creating a data-integrity mismatch (GoTrue says admin, DB role says student). The fix adds an `app_metadata.roles` check in the `Register` component that blocks submission and displays a contact-the-administrator message.

All fixes are client-side only. No server changes are required — `netlify/functions/me.ts` already auto-seeds admin profiles and `netlify/functions/register.ts` already rejects the `"admin"`/`"co_admin"` role.

Affected files: `src/context/AuthContext.tsx` (Bugs A, B, D), `src/screens/Auth.tsx` (Bug C, `Register` component only).

## Glossary

- **Bug_Condition (C)**: The condition that identifies inputs that trigger a defect. There are three: C_concurrency (concurrent `loadProfile` calls under the boolean guard), C_error (a thrown `registerProfile` in Path B), and C_admin (an admin-by-`app_metadata` user reaching the Register form).
- **Property (P)**: The desired correct behavior for each buggy input — the most recent `loadProfile` wins (P_concurrency), thrown `registerProfile` errors are surfaced via `setAuthError` and rethrown (P_error), and admins are blocked from self-registering (P_admin).
- **Preservation**: Existing behavior that must stay unchanged for non-buggy inputs — single-call profile loading, portal role checks, Path A signup, legitimate student/provider registration, and server-side admin auto-seed / role rejection.
- **loadProfile**: The async function in `src/context/AuthContext.tsx` that fetches the DB profile via `fetchMe()` and transitions `authStatus` to `"authenticated"` or `"needs_registration"`. It is the single gate to `"authenticated"`.
- **completeRegistration**: The async function in `src/context/AuthContext.tsx` with three paths: Path A (new signup, no session), Path B (email-confirmed, no DB profile), Path C (admin invite accepted, same as Path B).
- **loadingRef**: The `useRef(false)` boolean guard in `AuthContext.tsx` being removed. It deduplicates concurrent `loadProfile` calls by short-circuiting the second caller.
- **sessionCounterRef**: The new `useRef(0)` monotonic integer ref replacing `loadingRef`. Each `loadProfile` call increments it and captures its own session ID; results from stale sessions are discarded.
- **app_metadata**: GoTrue user metadata (set by Netlify Identity admins) containing `roles?: string[]`. The client can read it but cannot forge it. Distinct from the server-side DB profile roles, which are the authoritative source for `authStatus`.
- **portalRoleCheck**: The function in `src/screens/Auth.tsx` that enforces portal separation — an admin logging in via the student portal is told to use the Admin portal and is logged out.
- **fetchMe**: The API helper (`src/lib/api.ts`) that calls `/.netlify/functions/me` and returns the DB profile + provider record. Throws on 404 (no profile) and 5xx.
- **registerProfile**: The API helper (`src/lib/api.ts`) that POSTs to `/.netlify/functions/register` to create the DB profile row and assign a role. Throws on 400 (invalid fields) and 500 (DB error).

## Bug Details

### Bug Condition

The three defects manifest under distinct conditions.

#### Bug Condition A — Concurrency Race in loadProfile

The bug manifests when two or more `loadProfile` calls overlap in time and the boolean `loadingRef` guard corrupts auth state. Two sub-conditions exist:

- **A1 (short-circuit)**: A second `loadProfile` starts while `loadingRef.current === true`. The guard returns `[]` immediately without ever fetching the profile or touching React state, so `authStatus` may never transition to `"authenticated"` and the student cannot reach the dashboard.
- **A2 (manual reset race)**: `completeRegistration` Path B manually sets `loadingRef.current = false` before calling `loadProfile`. If a widget `"login"` event fires concurrently, both calls pass the guard, both call `fetchMe()`, and whichever resolves last wins — potentially overwriting an `"authenticated"` state with `"needs_registration"` or vice versa.

**Formal Specification:**
```
FUNCTION isBugConditionConcurrency(scenario)
  INPUT: scenario of type { calls: loadProfileInvocation[], overlap: boolean }
  OUTPUT: boolean

  RETURN scenario.calls.length >= 2
         AND scenario.overlap == true
         AND ( // at least one corrupting sub-condition holds
           (EXISTS call IN scenario.calls WHERE call.returnsEmptyArrayDueToGuard == true)   // A1
           OR
           (EXISTS call IN scenario.calls WHERE call.guardWasManuallyReset == true)         // A2
         )
         AND finalAuthStatus(scenario) != "authenticated"  // symptom: never reaches dashboard
END FUNCTION
```

#### Bug Condition B — Registration Error Not Surfaced

The bug manifests when `registerProfile` throws during `completeRegistration` Path B. Because the call is not wrapped in a try/catch, the thrown error propagates up to the `Register` form's catch block without ever calling `setAuthError`, so `authError` remains `null`.

**Formal Specification:**
```
FUNCTION isBugConditionError(input)
  INPUT: input of type { path: "B", registerProfileThrows: boolean }
  OUTPUT: boolean

  RETURN input.path == "B"
         AND input.registerProfileThrows == true
         AND setAuthErrorWasCalled(input) == false   // symptom: authError stays null
END FUNCTION
```

#### Bug Condition C — Admin Self-Registration

The bug manifests when an admin (by GoTrue `app_metadata.roles`) with no DB profile reaches the `Register` form. The form does not inspect `app_metadata.roles`, so the admin can fill in student fields, submit, and create a DB profile with role `"student"` — a mismatch with GoTrue `app_metadata` which says `"admin"` or `"co_admin"`.

**Formal Specification:**
```
FUNCTION isBugConditionAdmin(user)
  INPUT: user of type { app_metadata: { roles: string[] }, hasDbProfile: boolean, screen: string }
  OUTPUT: boolean

  RETURN user.screen == "register"
         AND (user.app_metadata.roles CONTAINS "admin" OR user.app_metadata.roles CONTAINS "co_admin")
         AND user.hasDbProfile == false
         AND formSubmissionIsAllowed(user) == true   // symptom: admin can submit
END FUNCTION
```

### Examples

- **Concurrency A1**: Student confirms email, browser returns, widget fires `"login"` → `loadProfile` call #1 starts (sets `loadingRef = true`). Simultaneously the RouteGuard or an effect calls `loadProfile` call #2 → guard returns `[]` immediately. Call #1's `fetchMe` resolves to 404 → `needs_registration`. But call #2 was the one expected to succeed. Auth status stays `"needs_registration"`, dashboard unreachable. (Expected after fix: call #2 runs, increments the counter, and its result is applied since it is the most recent session.)
- **Concurrency A2**: `completeRegistration` Path B resets `loadingRef.current = false`, calls `registerProfile` then `loadProfile` call #1. Widget fires `"login"` simultaneously → `loadProfile` call #2 passes the now-`false` guard. Both `fetchMe()` calls resolve; call #2 (stale) resolves last and overwrites the `"authenticated"` state set by call #1. Dashboard flickers or never settles. (Expected after fix: call #1's stale result is discarded because call #2 has a newer session ID — only the most recent call's result is applied.)
- **Error B**: A student submits the Register form with an invalid student number that passes client validation but is rejected server-side (400). `registerProfile` throws. The error bubbles to the form's catch block, which sets `localError` from the message — but `authError` was never set, so any component relying on `authError` sees `null`. If the form handler only checks `authError` (not the thrown message), the user sees nothing. (Expected after fix: `setAuthError` is called with the server message, and the error is rethrown so the form surfaces it.)
- **Admin C**: An admin invited via Netlify Identity (app_metadata.roles = `["admin"]`) with no DB profile logs in via the PUPTian login portal. `me.ts` has not yet been called or the 404 routes them to `needs_registration`. RouteGuard sends them to the Register form. The form shows student fields with no admin warning. The admin fills in a student number and submits → `registerProfile` creates a `student` role row. Now GoTrue says admin, DB says student. (Expected after fix: the form detects `app_metadata.roles` includes `"admin"`, shows "Admin accounts cannot self-register. Contact the system administrator.", and disables submission.)
- **Edge case — non-admin in app_metadata**: A student whose `app_metadata.roles` is empty or `["student"]` reaches the Register form. `isBugConditionAdmin` returns false. The form works normally. (Expected: unaffected by the fix.)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- A student with an existing DB profile who logs in via the PUPTian portal must continue to load the profile, transition to `"authenticated"`, and navigate to the student dashboard.
- `loadProfile` called once with no concurrency must continue to fetch the DB profile and transition auth status to `"authenticated"` or `"needs_registration"` as appropriate.
- An admin with an existing DB profile who logs in via the student portal must continue to trigger `portalRoleCheck`, be logged out, and see the portal mismatch error ("Admin accounts must sign in through the Admin portal.").
- A new student signing up with no existing session (Path A) must continue to create the GoTrue account, throw `CONFIRMATION_REQUIRED`, and show the "check your email" message.
- An admin (by `app_metadata`) with no DB profile who logs in must continue to have `me.ts` auto-seed the admin profile and roles so they are authenticated without self-registration.
- `register.ts` must continue to reject any request with role `"admin"` or `"co_admin"` with 403.
- The Register form used by a legitimate student or provider (not an admin by `app_metadata`) must continue to allow self-registration as student or provider with the existing field validation.

**Scope:**
All inputs that do NOT match any of the three bug conditions should be completely unaffected by this fix. This includes:
- Single (non-concurrent) `loadProfile` calls — the session counter increments once, captures session 0, and applies the result since no newer call exists.
- Path A new signups (no session, no `registerProfile` in Path B).
- Non-admin users (students, providers, guests) reaching the Register form.
- Mouse/touch interactions, non-auth navigation, and all UI unrelated to the auth state machine.

**Note:** The actual expected correct behavior for each bug condition is defined in the Correctness Properties section (Properties 1–3). This section focuses on what must NOT change (Properties 4–6).

## Hypothesized Root Cause

Based on the code in `AuthContext.tsx` and `Auth.tsx`, the most likely causes are:

1. **Boolean guard is the wrong concurrency primitive (Bug A + D)**: A boolean `loadingRef` can only express "busy / not busy" — it cannot distinguish *which* in-flight call should win when two overlap. The `if (loadingRef.current) return [];` short-circuit (sub-condition A1) silently drops the second caller's result. The manual `loadingRef.current = false` reset in `completeRegistration` (sub-condition A2) defeats the guard entirely, letting two calls race. A monotonic counter solves both: every call gets a unique session ID, and only the most recent session's result is applied.
   - The `onLogin` handler's `if (!loadingRef.current)` guard is a second symptom of the same root cause — it tries to deduplicate but uses the same broken primitive.

2. **Missing error boundary around `registerProfile` (Bug B)**: Path B calls `await registerProfile(...)` directly with no try/catch. Unlike Path A (which wraps `signupWithEmail` in a `.catch` that calls `setAuthError`), Path B has no equivalent error handling. The thrown error propagates to the form's catch block, but `authError` is never set because `setAuthError` is never called on this path.

3. **Register form trusts the routing, not the identity (Bug C)**: The `Register` component reads `liveUser` via `getIdentityCurrentUser()` to detect profile-completion mode, but it never inspects `liveUser.app_metadata.roles`. It assumes anyone who reaches the form is a legitimate student or provider. An admin redirected here by the `needs_registration` flow is indistinguishable from a student to the form. The server-side `register.ts` blocks the `"admin"` role string, but the form submits `role: "student"` for an admin user, which passes the server check — creating the mismatch.

4. **No client-side admin guard before form submission (Bug C, contributing)**: Even though `me.ts` auto-seeds admins, the race in Bug A can prevent that auto-seed from ever being observed (auth never reaches `"authenticated"`), leaving the admin stuck on the Register form where Bug C lets them proceed.

## Correctness Properties

Property 1: Bug Condition — Concurrency Race Resolved (Most Recent Session Wins)

_For any_ scenario where two or more `loadProfile` calls overlap in time (isBugConditionConcurrency returns true), the fixed `loadProfile` SHALL apply only the result of the most recent call (highest session ID) to auth state, SHALL discard all stale results without modifying `authStatus`/`profile`/`providerRecord`, and SHALL transition to `"authenticated"` when the most recent call's `fetchMe` succeeds — without any manual guard reset or short-circuit return.

**Validates: Requirements 2.1, 2.2**

Property 2: Bug Condition — Registration Errors Surfaced in Path B

_For any_ `completeRegistration` Path B invocation where `registerProfile` throws (isBugConditionError returns true), the fixed `completeRegistration` SHALL catch the error, call `setAuthError` with the error message so `authError` is non-null, and rethrow the error so the Register form's catch block can surface it — and SHALL NOT call `loadProfile` after the throw.

**Validates: Requirements 2.3**

Property 3: Bug Condition — Admin Self-Registration Blocked

_For any_ user reaching the `Register` form whose GoTrue `app_metadata.roles` contains `"admin"` or `"co_admin"` and who has no DB profile (isBugConditionAdmin returns true), the fixed `Register` component SHALL block form submission, disable the submit button, and display "Admin accounts cannot self-register. Contact the system administrator."

**Validates: Requirements 2.4**

Property 4: Preservation — Single Non-Concurrent loadProfile Behavior

_For any_ input where `loadProfile` is called exactly once with no overlapping call (isBugConditionConcurrency returns false), the fixed `loadProfile` SHALL fetch the DB profile and transition `authStatus` to `"authenticated"` (when a profile exists) or `"needs_registration"` (on 404), producing the same result as the original function, preserving single-call profile loading and dashboard routing.

**Validates: Requirements 3.1, 3.2**

Property 5: Preservation — Non-Admin Registration Behavior

_For any_ user reaching the `Register` form whose `app_metadata.roles` does NOT contain `"admin"` or `"co_admin"` (isBugConditionAdmin returns false), the fixed `Register` component SHALL produce exactly the same behavior as the original — allowing self-registration as student or provider with the existing field validation, password checks, and Path A / Path B routing.

**Validates: Requirements 3.7**

Property 6: Preservation — Portal Checks, Path A Signup, and Server-Side Admin Handling

_For any_ input that does not involve concurrent `loadProfile` calls, a thrown `registerProfile` in Path B, or an admin reaching the Register form, the fixed code SHALL produce exactly the same behavior as the original — preserving admin portal mismatch enforcement (3.3), Path A new-signup confirmation flow (3.4), `me.ts` admin auto-seed (3.5), and `register.ts` 403 role rejection (3.6).

**Validates: Requirements 3.3, 3.4, 3.5, 3.6**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `src/context/AuthContext.tsx`

#### Change 1 — Replace boolean `loadingRef` with monotonic `sessionCounterRef` (Bug A + D)

1. **Replace the ref declaration**:
   - Remove: `const loadingRef = useRef(false);`
   - Add: `const sessionCounterRef = useRef(0);`

2. **Rewrite the top of `loadProfile`** — remove the short-circuit guard, increment and capture the session ID:
   - Remove: `if (loadingRef.current) return [];` and `loadingRef.current = true;`
   - Add at the top of the function body:
     ```
     const sessionId = ++sessionCounterRef.current;
     ```
   - Keep `setAuthStatus("loading_profile")` and `setNetlifyUser(user)` as before.

3. **Add a staleness check after `fetchMe()` resolves** (success path):
   - After `const { profile: p, provider } = await fetchMe();`, before any `setProfile`/`setProviderRecord`/`setAuthStatus` calls:
     ```
     if (sessionId !== sessionCounterRef.current) {
       // A newer loadProfile call has started; discard this stale result.
       return (p.roles as UserRole[]) ?? [];
     }
     ```
   - Then proceed with the existing `setProfile(p)`, `setProviderRecord`, `setAuthStatus("authenticated")`, `return (p.roles as UserRole[]) ?? []`.
   - Remove: `loadingRef.current = false;` from the success path.

4. **Add a staleness check in the catch path**:
   - After `const msg = err instanceof Error ? err.message : String(err);`, add:
     ```
     if (sessionId !== sessionCounterRef.current) {
       // Stale call — don't modify auth state for an older session.
       return [];
     }
     ```
   - Then proceed with the existing 404 → `needs_registration` logic and the 5xx → `setAuthError` + `unauthenticated` logic.
   - Remove: `loadingRef.current = false;` from the catch path.

#### Change 2 — Remove the `onLogin` deduplication guard (Bug D)

- In the mount `useEffect`, change:
  ```
  const onLogin = (user: NetlifyUser) => {
    if (!loadingRef.current) {
      void loadProfile(user);
    }
  };
  ```
  to:
  ```
  const onLogin = (user: NetlifyUser) => {
    void loadProfile(user);
  };
  ```
- Rationale: with the session counter, every call increments and self-discards if stale, so the guard is unnecessary and was itself a source of the bug.

#### Change 3 — Remove the manual `loadingRef` reset from `completeRegistration` (Bug D)

- In `completeRegistration` Path B (the `if (liveUser)` branch), remove:
  ```
  // Reset the concurrency guard before calling loadProfile again,
  // since the initial loadProfile (which set needs_registration) already finished.
  loadingRef.current = false;
  ```
- The session counter handles deduplication automatically now.

#### Change 4 — Wrap `registerProfile` in try/catch in Path B (Bug B)

- In `completeRegistration` Path B, change:
  ```
  await registerProfile({ ...payload, display_name: displayName });
  await loadProfile(liveUser);
  return;
  ```
  to:
  ```
  try {
    await registerProfile({ ...payload, display_name: displayName });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Registration failed.";
    setAuthError(msg);
    throw err;
  }
  await loadProfile(liveUser);
  return;
  ```
- This calls `setAuthError` so `authError` is non-null, then rethrows so the `Register` form's existing catch block (which reads the thrown message into `localError`) surfaces it. `loadProfile` is not reached when `registerProfile` throws.

**File**: `src/screens/Auth.tsx` (`Register` component only)

#### Change 5 — Block admin self-registration via `app_metadata` check (Bug C)

1. **Add an admin detection flag** alongside the existing `isProfileCompletion`:
   ```
   const isAdminByMetadata =
     (liveUser?.app_metadata?.roles ?? []).includes("admin") ||
     (liveUser?.app_metadata?.roles ?? []).includes("co_admin");
   ```
   This uses the already-captured `liveUser` from `getIdentityCurrentUser()`. The `app_metadata.roles` type is `string[] | undefined`, so the nullish coalescing guards against undefined.

2. **Show a blocking error banner** when `isAdminByMetadata` is true — render it above the role tabs:
   ```
   {isAdminByMetadata && (
     <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
       Admin accounts cannot self-register. Contact the system administrator.
     </div>
   )}
   ```

3. **Disable form submission** — add `isAdminByMetadata` to the submit button's `disabled` condition:
   - Change: `disabled={loading || !!successMsg}`
   - To: `disabled={loading || !!successMsg || isAdminByMetadata}`

4. **Guard the `handleSubmit` early return** — add at the top of `handleSubmit` (after `e.preventDefault()`):
   ```
   if (isAdminByMetadata) {
     setLocalError("Admin accounts cannot self-register. Contact the system administrator.");
     return;
   }
   ```
   This is a defense-in-depth guard: even if the disabled button is bypassed (e.g., via dev tools), the handler refuses to call `completeRegistration`.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate each bug on unfixed code, then verify the fix works correctly and preserves existing behavior. Each bug has its own exploration test, fix check, and preservation check.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate each bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that simulate the triggering conditions for each bug and assert the defective behavior. Run these tests on the UNFIXED code to observe failures and understand the root cause.

**Test Cases**:
1. **Concurrency A1 — Short-Circuit Test**: Simulate two overlapping `loadProfile` calls where the second starts while the first is in-flight. Assert that on unfixed code the second call returns `[]` and `authStatus` never reaches `"authenticated"`. (will fail to reach authenticated on unfixed code)
2. **Concurrency A2 — Manual Reset Race Test**: Simulate `completeRegistration` Path B resetting `loadingRef` and calling `loadProfile` concurrently with a widget `"login"` event. Assert that on unfixed code both calls' results are applied and the final state is nondeterministic. (will show state corruption on unfixed code)
3. **Error B — Path B Throw Test**: Simulate `registerProfile` throwing a 400 error during `completeRegistration` Path B. Assert that on unfixed code `authError` remains `null` after the throw. (will fail: authError stays null on unfixed code)
4. **Admin C — Self-Registration Test**: Render the `Register` component with a `liveUser` whose `app_metadata.roles` is `["admin"]`. Assert that on unfixed code the submit button is enabled and `handleSubmit` proceeds to call `completeRegistration`. (will fail: form is submittable on unfixed code)
5. **Edge Case — Non-Admin app_metadata Test**: Render the `Register` component with `app_metadata.roles` empty or `["student"]`. Assert the form works normally. (passes on both unfixed and fixed code — confirms scope)

**Expected Counterexamples**:
- Concurrency: second `loadProfile` returns `[]`; auth status stuck at `"needs_registration"` or flickers between states. Possible causes: boolean guard short-circuits, manual reset defeats guard.
- Error: `authError` is `null` after `registerProfile` throws. Possible cause: no try/catch around `registerProfile` in Path B.
- Admin: form is submittable for an admin user. Possible cause: `app_metadata.roles` never inspected in the `Register` component.

### Fix Checking

**Goal**: Verify that for all inputs where each bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
// Concurrency
FOR ALL scenario WHERE isBugConditionConcurrency(scenario) DO
  result := loadProfile_fixed(scenario)
  ASSERT result.appliesMostRecentSessionOnly(scenario)
  ASSERT result.transitionsToAuthenticatedWhenFetchMeSucceeds(scenario)
END FOR

// Error propagation
FOR ALL input WHERE isBugConditionError(input) DO
  result := completeRegistration_fixed(input)
  ASSERT setAuthErrorWasCalled(input) == true
  ASSERT errorWasRethrown(input) == true
  ASSERT loadProfileWasNotCalledAfterThrow(input) == true
END FOR

// Admin block
FOR ALL user WHERE isBugConditionAdmin(user) DO
  result := Register_fixed(user)
  ASSERT formSubmissionIsBlocked(user) == true
  ASSERT adminMessageIsDisplayed(user) == true
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where no bug condition holds, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugConditionConcurrency(input)
            AND NOT isBugConditionError(input)
            AND NOT isBugConditionAdmin(input) DO
  ASSERT loadProfile_original(input) = loadProfile_fixed(input)
  ASSERT completeRegistration_original(input) = completeRegistration_fixed(input)
  ASSERT Register_original(input) = Register_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain (single calls, non-admin users, Path A signups, portal checks).
- It catches edge cases that manual unit tests might miss (e.g., a user with `app_metadata.roles` containing an unrelated string, or a single `loadProfile` call with no overlap).
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs.

**Test Plan**: Observe behavior on UNFIXED code first for single-call profile loading, non-admin registration, portal role checks, and Path A signup, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Single Call Preservation**: Observe that a single `loadProfile` call (no overlap) transitions to `"authenticated"` on unfixed code, then write a test verifying this continues after the fix (session counter increments once, session 0 applies since no newer call exists).
2. **Non-Admin Registration Preservation**: Observe that a student/provider reaching the Register form with empty or non-admin `app_metadata.roles` can submit on unfixed code, then write a test verifying `isAdminByMetadata` is false and the form works identically after the fix.
3. **Portal Check Preservation**: Observe that an admin with an existing DB profile logging in via the student portal is logged out and shown the mismatch error on unfixed code, then write a test verifying `portalRoleCheck` still fires after the fix.
4. **Path A Signup Preservation**: Observe that a new student signup (no session) throws `CONFIRMATION_REQUIRED` and shows the email message on unfixed code, then write a test verifying Path A is unchanged after the fix.
5. **Session Counter Monotonicity Preservation**: Generate random sequences of non-overlapping `loadProfile` calls and verify each one's result is applied (no staleness discard when calls are sequential).

### Unit Tests

- Test `loadProfile` with a single call: increments `sessionCounterRef` to 0, applies result, transitions to `"authenticated"`.
- Test `loadProfile` with two overlapping calls: the second call's session ID is higher; the first call's result is discarded after `fetchMe` resolves; only the second call's result is applied.
- Test `loadProfile` error path with a stale session: a 404 from a stale call does NOT set `needs_registration` if a newer call has started.
- Test `completeRegistration` Path B where `registerProfile` throws: `setAuthError` is called, error is rethrown, `loadProfile` is not called.
- Test `completeRegistration` Path B where `registerProfile` succeeds: proceeds to `loadProfile` normally.
- Test `Register` component with `app_metadata.roles = ["admin"]`: submit button disabled, blocking alert shown, `handleSubmit` early-returns.
- Test `Register` component with `app_metadata.roles = ["co_admin"]`: same as admin.
- Test `Register` component with `app_metadata.roles = []` or `["student"]`: form works normally, `isAdminByMetadata` is false.
- Test edge cases: `app_metadata.roles` is `undefined` (nullish coalescing guards), out-of-range keys, no `liveUser` (Path A).

### Property-Based Tests

- Generate random overlapping `loadProfile` invocation sequences with varying delays and verify that only the most recent session's result is applied to auth state (Property 1).
- Generate random `registerProfile` error messages and verify that `setAuthError` is called with the message and the error is rethrown for every Path B throw (Property 2).
- Generate random `app_metadata.roles` arrays and verify that the Register form is blocked if and only if the array contains `"admin"` or `"co_admin"` (Property 3).
- Generate random single (non-concurrent) `loadProfile` calls and verify the result is applied identically to the original (Property 4).
- Generate random non-admin users reaching the Register form and verify the form behaves identically to the original (Property 5).
- Generate random portal-login scenarios (admin with profile, student with profile, Path A signup) and verify unchanged behavior (Property 6).

### Integration Tests

- Test full login flow: student logs in via PUPTian portal → `loadProfile` (single call) → `"authenticated"` → navigates to student dashboard.
- Test full registration flow (Path B): student confirms email → returns → `Register` form (Path B) → submits → `registerProfile` succeeds → `loadProfile` → `"authenticated"` → dashboard.
- Test concurrency in the wild: simulate email confirmation return firing widget `"login"` while `completeRegistration` calls `loadProfile` — verify only the most recent session wins and the student reaches the dashboard.
- Test admin blocked at Register form: admin (no DB profile) reaches Register form → sees blocking alert → cannot submit → (with server) `me.ts` auto-seeds admin profile so they are authenticated via the admin portal instead.
- Test portal mismatch: admin with existing DB profile logs in via student portal → `portalRoleCheck` → logout → mismatch error shown.
- Test Path A signup: new student with no session → submits Register form → `CONFIRMATION_REQUIRED` → "check your email" message shown.
