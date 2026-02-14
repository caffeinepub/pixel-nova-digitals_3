# Specification

## Summary
**Goal:** Fix the continuous Admin Login redirect loop by stabilizing admin session handling and making token-authenticated admin endpoints return consistent invalid/expired token errors.

**Planned changes:**
- Frontend: Adjust admin data fetching (orders list, order detail, download file, delete order) so admin session token is not cleared on generic/non-auth/ambiguous failures; only clear when the backend explicitly signals invalid/expired token.
- Frontend: Update AdminGate flow so that once a token is stored in sessionStorage, the Admin dashboard remains rendered during background queries and only returns to Admin Login on an explicit invalid/expired token response.
- Frontend: Ensure all user-facing error messages shown for admin query failures are English-only (no emojis).
- Backend: Make token-based admin endpoints (getAllOrdersWithToken, getOrderDetailWithToken, downloadFileWithToken, deleteOrderWithToken) return a consistent, explicit English #err message for invalid/expired tokens (and avoid trapping for normal failures).
- Backend: Ensure that immediately after a successful adminLogin, using the returned valid token with getAllOrdersWithToken returns #ok([...]) (even if empty), not an invalid/expired token error.

**User-visible outcome:** After a successful admin login, the Admin dashboard stays visible instead of looping back to the login screen; non-auth admin API failures show an English error while keeping the session, and the user is only logged out when the backend explicitly indicates the token is invalid/expired.
