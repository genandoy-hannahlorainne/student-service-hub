# Implementation Plan

## Task Dependency Graph

```json
{
  "waves": [
    {"wave": 1, "tasks": ["1"]},
    {"wave": 2, "tasks": ["2"]},
    {"wave": 3, "tasks": ["3.1", "3.2", "3.3", "3.4", "3.5"]},
    {"wave": 4, "tasks": ["3.6", "3.7"]},
    {"wave": 5, "tasks": ["4"]}
  ]
}
```

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Concurrency Race / Error Surfacing / Admin Self-Registration
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate all three bugs exist
  - **Scoped PBT Approach**: For deterministic bugs, scope the property to the concrete failing case(s) to ensure reproducibility
  - Test A1: Two overlapping `loadProfile` calls — second returns `[]` and `authStatus` never reaches `"authenticated"` (short-circuit via `loadingRef`)
  - Test A2: `completeRegistration` Path B resets `loadingRef.current = false` then a concurrent `"login"` event races — both calls apply results, state is nondeterministic
  - Test B: `registerProfile` throws a 400 in Path B — `authError` remains `null` because `setAuthError` is never called
  - Test C: `Register` rendered with `liveUser.app_metadata.roles = ["admin"]` — submit button enabled and `handleSubmit` proceeds to `completeRegistration`
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL (this is correct — proves the bugs exist)
  - Document counterexamples found to understand root cause
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Single-Call Profile Loading / Non-Admin Registration
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: a single `loadProfile` call (no overlap) transitions `authStatus` to `"authenticated"` on unfixed code
  - Observe: `Register` with `app_metadata.roles = []` allows form submission on unfixed code
  - Observe: `portalRoleCheck` fires and logs out an admin with an existing DB profile on unfixed code
  - Observe: Path A signup throws `CONFIRMATION_REQUIRED` on unfixed code
  - Write property-based test: for all non-concurrent single calls, result is applied and `authStatus` reaches `"authenticated"` (from Preservation Requirements 3.1, 3.2 in design)
  - Write property-based test: for all non-admin users (`app_metadata.roles` empty or student), `isAdminByMetadata` is false and form works normally (from Preservation Requirements 3.7 in design)
  - Verify tests PASS on UNFIXED code
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.7_

- [ ] 3. Fix for concurrency race, registration error surfacing, and admin self-registration block

  - [ ] 3.1 Replace `loadingRef` with `sessionCounterRef` in `src/context/AuthContext.tsx`
    - Remove `const loadingRef = useRef(false);`
    - Add `const sessionCounterRef = useRef(0);`
    - Remove `if (loadingRef.current) return [];` short-circuit guard from `loadProfile`
    - Remove `loadingRef.current = true;` from `loadProfile`
    - Add `const sessionId = ++sessionCounterRef.current;` at the top of `loadProfile`
    - Add staleness check after `fetchMe()` resolves (success path): `if (sessionId !== sessionCounterRef.current) return (p.roles as UserRole[]) ?? [];`
    - Remove `loadingRef.current = false;` from success path
    - Add staleness check in catch path (before 404 check): `if (sessionId !== sessionCounterRef.current) return [];`
    - Remove `loadingRef.current = false;` from catch path
    - _Bug_Condition: isBugConditionConcurrency(scenario) — scenario.calls.length >= 2 AND scenario.overlap == true_
    - _Expected_Behavior: most recent session ID wins; stale results discarded without modifying authStatus_
    - _Preservation: single non-concurrent calls increment counter once, apply result unchanged (Requirements 3.1, 3.2)_
    - _Requirements: 2.1, 2.2_

  - [ ] 3.2 Remove `onLogin` deduplication guard from `src/context/AuthContext.tsx`
    - Change `const onLogin = (user: NetlifyUser) => { if (!loadingRef.current) { void loadProfile(user); } };`
    - To `const onLogin = (user: NetlifyUser) => { void loadProfile(user); };`
    - Session counter handles deduplication; the guard was a second symptom of the same root cause
    - _Bug_Condition: isBugConditionConcurrency — A1 sub-condition (guard silently dropped second caller)_
    - _Expected_Behavior: every login event triggers loadProfile; session counter discards stale results_
    - _Requirements: 2.1, 2.2_

  - [ ] 3.3 Remove manual `loadingRef` reset from `completeRegistration` Path B in `src/context/AuthContext.tsx`
    - In `completeRegistration`, inside `if (liveUser)` block, remove the comment and `loadingRef.current = false;` line
    - Session counter replaces this manual reset automatically
    - _Bug_Condition: isBugConditionConcurrency — A2 sub-condition (manual reset defeated the guard)_
    - _Requirements: 2.1, 2.2_

  - [ ] 3.4 Wrap `registerProfile` in try/catch in `completeRegistration` Path B in `src/context/AuthContext.tsx`
    - Change the direct `await registerProfile(...)` call in Path B
    - Wrap in try/catch: catch calls `setAuthError(msg)` then rethrows the error
    - `loadProfile` is only called when `registerProfile` succeeds (no change to the success path)
    - _Bug_Condition: isBugConditionError — path == "B" AND registerProfileThrows == true AND setAuthErrorWasCalled == false_
    - _Expected_Behavior: setAuthError called with error message; error rethrown; loadProfile not called after throw_
    - _Preservation: Path B success case proceeds to loadProfile unchanged (Requirements 3.1)_
    - _Requirements: 2.3_

  - [ ] 3.5 Block admin self-registration in `Register` component in `src/screens/Auth.tsx`
    - Add `isAdminByMetadata` flag after `isProfileCompletion` using `liveUser?.app_metadata`
    - Add early return in `handleSubmit` when `isAdminByMetadata` is true (after `setSuccessMsg("")`)
    - Add blocking alert banner `{isAdminByMetadata && <div role="alert" ...>Admin accounts cannot self-register...</div>}` before role tabs div
    - Add `isAdminByMetadata` to submit button's `disabled` condition
    - _Bug_Condition: isBugConditionAdmin — screen == "register" AND app_metadata.roles CONTAINS "admin" or "co_admin" AND hasDbProfile == false_
    - _Expected_Behavior: formSubmissionIsBlocked == true; adminMessageIsDisplayed == true; submit button disabled_
    - _Preservation: non-admin users (empty or student roles) are unaffected; isAdminByMetadata is false (Requirements 3.7)_
    - _Requirements: 2.4_

  - [ ] 3.6 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Concurrency Race Resolved / Errors Surfaced / Admin Blocked
    - **IMPORTANT**: Re-run the SAME tests from task 1 - do NOT write new tests
    - The tests from task 1 encode the expected behavior
    - When these tests pass, it confirms the expected behavior is satisfied
    - Run bug condition exploration tests from step 1
    - **EXPECTED OUTCOME**: Tests PASS (confirms all three bugs are fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ] 3.7 Verify preservation tests still pass
    - **Property 2: Preservation** - Single-Call Profile Loading / Non-Admin Registration
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [ ] 4. Checkpoint - Ensure all tests pass
  - Run `npm run build` in the project root to verify no TypeScript errors
  - Ensure all tests pass, ask the user if questions arise.
