# Task 3 implementation

This workspace implements a federated GraphQL API for hotel bookings.

## Structure

- `services/booking-subgraph` — bookings, access control, and booking-to-hotel references.
- `services/hotel-subgraph` — hotel descriptions and request-scoped DataLoader batching.
- `services/promocode-subgraph` — promocodes and booking discount information.
- `services/gateway` — composes the three subgraphs into the public GraphQL API.
- `.delivery/task3.compose.yml` — runs the complete Docker stack.
- `.testing/vitest.workspace.ts` — registers the Vitest projects.

## Run the complete API

From this directory, run:

```powershell
npm run task3:compose:run
```

It rebuilds the four Docker services without using cached layers, then starts them. The public GraphQL endpoint is `http://localhost:4000/`.

Stop the stack with:

```powershell
npm run task3:compose:down
```

## Validate

```powershell
npm run check-types
npm run test:foundation
```

With the Docker stack running, execute the gateway end-to-end tests:

```powershell
npm run test:e2e
```
