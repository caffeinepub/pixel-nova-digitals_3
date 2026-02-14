# Specification

## Summary
**Goal:** Make the Admin Panel publicly accessible by removing all login/token gating in both frontend and backend.

**Planned changes:**
- Remove frontend admin authentication flow so the Admin route always renders the admin dashboard (no AdminLogin/AdminBootstrap, no session-expired prompts).
- Update admin React Query hooks and UI actions to stop using admin session storage and token-based admin API calls; use non-token admin operations instead.
- Remove backend access restrictions for admin operations (orders listing/detail, delete, file download, and site/content/contact updates) so they work for any visitor without email/password login.

**User-visible outcome:** Clicking “Admin” immediately shows the admin dashboard (Orders, Basic Text, Social Links, Contact Settings), and all admin actions work after refresh without any login or token/session errors.
