# Services

## Local startup order

`booking-service` and `booking-history-service` connect to Kafka at `kafka:9092` on the external Docker network `hotelio-net`. Their Compose files do not create Kafka or ZooKeeper. The Task 2 Compose stack provides both containers.

Before starting either service, create the shared network if it does not yet exist and start the monolith stack:

```powershell
docker network create hotelio-net

cd hotelio-fork/tasks/task2
docker compose up -d --build
```

Then start each microservice from its directory:

```powershell
cd hotelio-fork/services/booking
npm run service:compose:run

cd ../booking-history
npm run service:compose:run
```

If a service reports `getaddrinfo ENOTFOUND kafka`, Kafka is not running on `hotelio-net`. Start the Task 2 stack above and then restart that service.
