# Architecture & Design Decision Records (ADR)

This document tracks all design decisions, architectural trade-offs, and defaults selected to guarantee a rock-solid, production-safe Housie/Tambola game control platform.

---

## ADR-001: Authentication & Token Management Strategy
- **Context**: The game control platform requires secure host access across desktop and mobile browsers, resistant to XSS and CSRF attacks.
- **Decision**:
  - **Access Token**: Short-lived (15 minutes) signed JSON Web Token (JWT) carried in an `httpOnly`, `Secure` (in production), `SameSite=Lax` cookie named `housie_access_token`.
  - **Refresh Token**: 7-day opaque cryptographic token generated via `crypto.randomBytes(32)` carried in an `httpOnly`, `Secure`, `SameSite=Lax` cookie named `housie_refresh_token`.
  - **Revocation**: The SHA-256 hash of the refresh token is stored in the `sessions` table. Calling `/api/auth/logout` sets `revokedAt = NOW()` on the session, immediately invalidating the refresh chain.
  - **CSRF Defense**: Dual protection combining `SameSite=Lax` cookies, required `Origin` / `Referer` validation against allowed hosts on mutating endpoints (`POST`, `PATCH`, `PUT`, `DELETE`), and standard `Content-Type: application/json` enforcement.

---

## ADR-002: Currency & Money Representation in Paise
- **Context**: Real-world events charge for physical tickets and distribute cash/kind prize pools. Floating-point arithmetic poses rounding and precision bugs.
- **Decision**:
  - All monetary values (`ticketPrice`, `prizeAmount`) are strictly stored as integers representing **paise** (1 INR = 100 paise).
  - Conversions to Rupee formatting (`₹`) occur strictly in the presentation layer using `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })`.

---

## ADR-003: Row Locking for Concurrent Calling & State Transitions
- **Context**: 100 concurrent requests calling numbers, simultaneous calls and pauses, or rapid double taps must never create sequence gaps, duplicate numbers, or race conditions.
- **Decision**:
  - Every state change and number call acquires a PostgreSQL row lock:
    ```sql
    SELECT id, status, version FROM games WHERE id = $1 FOR UPDATE;
    ```
  - This serializes concurrent requests at the database engine level.
  - Undos, manual calls, winner verifications, and status changes use the identical lock, guaranteeing deterministic state evolution.

---

## ADR-004: Dual-Tier Idempotency Mechanism
- **Context**: Network retries or rapid double taps could inadvertently generate duplicate numbers if an in-flight request is retried.
- **Decision**:
  - `POST /games/:id/call` accepts an optional or client-generated `Idempotency-Key` header (UUIDv4).
  - **Tier 1 (Speed)**: Redis cache with key `idempotency:call:{gameId}:{key}` (TTL 1 hour).
  - **Tier 2 (Postgres Durable Fallback)**: Dedicated table `call_idempotency_keys` storing `(game_id, idempotency_key, response_payload)` with a unique constraint. If Redis is unreachable or restarted, the database transaction checks this table before calling a number.
  - If a key match is found, the previous response is returned with status 200 without calling a new number.

---

## ADR-005: Number Calling Undo Behavior
- **Context**: A host might accidentally tap "Call Next" or call a wrong number manually and need to undo.
- **Decision**:
  - Numbers are never physically deleted from `called_numbers`.
  - Calling undo sets `undone_at = NOW()` on the active number with the highest `sequence`.
  - Partial unique indexes (`WHERE undone_at IS NULL`) ensure that the number automatically returns to the pool of eligible remaining numbers (1–90) without violating constraints.
  - Every undo increments `games.version` and logs a `NUMBER_UNDONE` action in `audit_logs`.

---

## ADR-006: Game Code & Display Token Generation
- **Context**: Spectators need an easy short code to view numbers on mobile (`/play/:code`), while projector displays require an unguessable token (`/game/:id/display?t=token`) so unauthorized viewers cannot discover private games.
- **Decision**:
  - **Short Code**: 3 uppercase alphabetic characters extracted from the game name (padded with `HOU` if shorter) + 4 random digits (e.g. `WED4829`). Generated in a retry loop (up to 5 attempts) to guarantee uniqueness across active games.
  - **Display Token**: 64-character hex string generated with `crypto.randomBytes(32).toString('hex')`. Unguessable and immutable.

---

## ADR-007: Append-Only Immutable Audit Log
- **Context**: Financial and competitive integrity at live events requires verifiable proof of every state change, call, claim, and payout.
- **Decision**:
  - The `audit_logs` table has a database-level trigger `trg_audit_logs_append_only` that throws an exception if any `UPDATE` or `DELETE` statement is attempted.
  - Audit actions encompass all 19 defined event types with structured metadata (actor ID, IP address, user-agent, prior state, current state).

---

## ADR-008: Number-to-Words Lookup Table for Hindi & English
- **Context**: Algorithmic number-to-words for Hindi is notoriously prone to errors because numbers 1–90 have irregular linguistic stems (unlike English tens + units).
- **Decision**:
  - `packages/shared/src/words/hindi.ts` provides a complete 1-to-90 static map containing both Devanagari script and English phonetic equivalents (e.g., 47 -> `सैंतालीस` / `Saintaalees`).
  - English numbers 1–90 are similarly mapped explicitly in `packages/shared/src/words/english.ts`.
  - Both frontend and backend reference this exact package.

---

## ADR-009: Realtime Synchronization & Client Drift Recovery
- **Context**: Projectors and mobile phones may lose Wi-Fi connectivity or background tabs, causing them to miss Socket.IO broadcast packets.
- **Decision**:
  - Every broadcast event includes `gameId`, `version`, and `ts`.
  - Clients track `localVersion`. If an incoming event has `event.version !== localVersion + 1`, the client drops the event and automatically fetches a fresh snapshot via `GET /api/games/:id/state`.
  - In addition, whenever the browser tab becomes visible (`visibilitychange` event) or Socket.IO reconnects, a full REST state synchronization is triggered.

---

## ADR-010: Host Game Authorization Privacy
- **Context**: Hosts must not discover IDs or metadata of games hosted by other users.
- **Decision**:
  - Whenever a host queries a game ID that does not belong to them, the API returns `404 GAME_NOT_FOUND` instead of `403 FORBIDDEN`.
  - This eliminates ID enumeration and metadata probing.

---

## ADR-011: Standalone Vercel Deployment Mode (Client-Side & Serverless Game Control Engine)
- **Context**: For hosting games with friends and family without needing external database infrastructure (Postgres, Redis, Railway), the platform must run seamlessly and zero-config directly on Vercel.
- **Decision**:
  - Implement a full-featured Standalone Engine in `apps/web` utilizing `packages/shared` types, state machine, and bilingual words dictionary.
  - Generates cryptographically secure random numbers (1-90) using browser `crypto.getRandomValues`.
  - Persists game state, called numbers, prize quotas, and winner verifications in browser `localStorage`, ensuring zero data loss on page refreshes or tab switches.
  - Integrates Web Speech API with bilingual voice announcements (English, Hindi, Bilingual), auto-caller timer option, physical ticket winner verification with confetti fanfare, and a dedicated distraction-free TV/Projector display mode.

