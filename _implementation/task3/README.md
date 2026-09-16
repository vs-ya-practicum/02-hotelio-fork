# Task 3 implementation

## Run the booking subgraph

Run this command from `booking-subgraph`:

```powershell
docker compose -f .delivery/booking-subgraph.compose.yml up --build
```

This produces the independently runnable booking subgraph. It is the first component of Task 3’s federated GraphQL API: later, Apollo Gateway will combine its booking data with hotel data from the hotel subgraph into one API.
