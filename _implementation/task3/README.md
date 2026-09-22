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

## Authorization outcome contract

`bookingsByUser` previously returned an empty list both when an authorized user
had no bookings and when the requester had no access. A client could therefore
not distinguish "there are no bookings" from "authentication is required" or
"access is forbidden".

The query now returns the `BookingsByUserResult` union:

- `BookingsByUserSuccess`, containing `bookings`, including an empty list for an authorized user with no bookings;
- `UnauthenticatedError`, when the request has no user identity;
- `ForbiddenError`, when the requester differs from the `userId` argument.

This raises a documentation question: can a GraphQL contract be inspected as
precisely as an OpenAPI operation, including its non-success outcomes? The
GraphQL schema is authoritative for arguments, return types, nullability, and
descriptions, and GraphQL explorers can render those details. Standard GraphQL
does not, however, declare thrown `errors[].extensions.code` values as typed
field outcomes in the way OpenAPI declares HTTP responses.

Four ways to address that gap are:

1. Model expected, client-actionable outcomes as union members. This project
   uses this approach because success, unauthenticated, and forbidden outcomes
   are visible in the schema, introspection, and GraphQL explorers.
2. Use GraphQL Code Generator to create discriminated client types from the
   union, so TypeScript requires consumers to handle each outcome.
3. Publish the schema to a registry such as Apollo GraphOS or GraphQL Hive for
   schema exploration, versioning, federation composition, and compatibility
   checks.
4. Generate static documentation with a tool such as GraphDoc. This improves
   presentation, but only typed schema outcomes are discoverable automatically.

## Validate

```powershell
npm run check-types
npm run test:foundation
```

With the Docker stack running, execute the gateway end-to-end tests:

```powershell
npm run test:e2e
```
