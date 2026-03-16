# API layer

Single place for all backend calls. Use the shared client and config so base URL and error handling stay consistent.

## Structure

- **config.ts** – `API_BASE_URL` (default `http://localhost:3000/api`, override with `VITE_API_URL`)
- **client.ts** – `request(path, options)` and `ApiError` for all HTTP calls
- **checkins.ts** – check-in endpoints and types (`getCheckins`, `getCheckin`, `createCheckin`, `updateCheckin`, `deleteCheckin`)
- **index.ts** – re-exports; import from `@/api` or `../../api`

## Usage

```ts
import { getCheckins, createCheckin, deleteCheckin } from "../../api";
// or
import { getCheckin, updateCheckin } from "../../api/checkins";
```

## Adding a new resource

1. Add `src/api/<resource>.ts` using `request()` from `./client` and `API_BASE_URL` from `./config`.
2. Re-export from `src/api/index.ts`.
