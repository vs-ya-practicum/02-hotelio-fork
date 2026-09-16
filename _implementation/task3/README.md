# Task 3 implementation

## Run the booking subgraph

Run this command from the Task 3 workspace root:

```powershell
docker compose -f .delivery/booking-subgraph/subgraph.compose.yml up --build
```

This produces the independently runnable booking subgraph. It is the first component of Task 3’s federated GraphQL API: later, Apollo Gateway will combine its booking data with hotel data from the hotel subgraph into one API.

## Testing

Vitest is installed once at the Task 3 workspace root. `.testing/vitest.workspace.ts` registers each package test project; each package keeps its own tests under `tests/foundation/`.

Run all registered package tests from the Task 3 workspace root:

```powershell
npm test
```

Run only the booking-subgraph foundation tests:

```powershell
npm run test:foundation --workspace booking-subgraph
```
