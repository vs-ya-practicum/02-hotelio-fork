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
cd hotelio-fork/_implementation/task2/services/booking
npm run service:compose:run

cd ../booking-history
npm run service:compose:run
```

If a service reports `getaddrinfo ENOTFOUND kafka`, Kafka is not running on `hotelio-net`. Start the Task 2 stack above and then restart that service.

## Full Task 2 startup and result workflow (WSL)

Run the commands in this order. Keep the two microservice Compose commands running in separate terminals.

```bash
# Terminal 1: Task 2 infrastructure, monolith, Kafka, and ZooKeeper.
cd hotelio-fork/tasks/task2
docker network create hotelio-net 2>/dev/null || true
docker compose up -d --build

# Terminal 2: booking-service and its PostgreSQL database.
cd hotelio-fork/_implementation/task2/services/booking
npm run service:compose:run

# Terminal 3: booking-history-service and its PostgreSQL database.
cd hotelio-fork/_implementation/task2/services/booking-history
npm run service:compose:run
```

After both services report that they started, run the regression suite from a fourth terminal:

```bash
cd hotelio-fork/test
docker compose -f tests.compose.yml run --rm hotelio-tester
```

Then generate the submission files from `hotelio-fork/tasks/task2` with the commands in [Task 2 result preparation (WSL)](#task-2-result-preparation-wsl).

## Task 2 result preparation (WSL)

Run these commands after the monolith, Kafka, `booking-service`, and `booking-history-service` are running. They create the files required in `tasks/task2/results`.

```bash
cd hotelio-fork/tasks/task2

# Confirms that every Task 2 container is running.
docker compose ps > results/docker-ps.log

# Stores the regression script used by the test runner.
cp ../../test/regress.sh results/regress.sh

# Shows the old monolith data and the new booking-service data after regression tests.
docker exec hotelio-db psql -U hotelio -d hotelio -c "SELECT * FROM booking ORDER BY id;" > results/monolith-bookings.txt
docker exec booking-db psql -U booking -d booking -c "SELECT * FROM bookings ORDER BY id;" > results/booking-service-bookings.txt

# Shows that BookingCreated events were saved by booking-history-service.
docker exec booking-history-db psql -U booking_history -d booking_history -c "SELECT * FROM booking_history ORDER BY booking_id;" > results/booking-history.txt

# Shows booking lists through the monolith REST API and booking-service gRPC API.
curl -sS "http://localhost:8084/api/bookings" > results/monolith-rest-bookings.txt
docker run --rm --network hotelio-net -v "$PWD:/protos:ro" fullstorydev/grpcurl:latest \
  -plaintext -import-path /protos -proto booking.proto \
  -d '{"user_id":"test-user-3"}' \
  booking-service:9090 booking.BookingService/ListBookings \
  > results/booking-service-grpc-bookings.txt
```

Create `test-log.txt` by running the regression container from `hotelio-fork/test`:

```bash
docker compose -f tests.compose.yml run --rm hotelio-tester | tee ../tasks/task2/results/test-log.txt
```

`results/README.md` describes the data-migration strategy: copy existing monolith bookings into both new databases before switching writes, then let `booking-service` store new bookings and `booking-history-service` consume `BookingCreated` asynchronously.

## Monolith rebuild after the booking-service migration

After `BOOKING_SERVICE_EXTERNAL_HOST` was configured, the monolith selected `GrpcBookingService` for every `BookingService` call. Therefore `GET /api/bookings` called the gRPC `ListBookings` method with a missing `user_id`. The gRPC request builder rejected `null`, and the monolith returned HTTP 500.

The controller was changed to inject the native `bookingService` for listing and `grpcBookingService` only for creating bookings. Rebuild the monolith source, copy the JAR used by the Task 2 Dockerfile, and recreate its container:

```diff
+ import org.springframework.beans.factory.annotation.Qualifier;

- private final BookingService bookingService;
+ private final BookingService bookingService;
+ private final BookingService grpcBookingService;

- public BookingController(BookingService bookingService) {
+ public BookingController(
+         @Qualifier("bookingService") BookingService bookingService,
+         @Qualifier("grpcBookingService") BookingService grpcBookingService
+ ) {
      this.bookingService = bookingService;
+     this.grpcBookingService = grpcBookingService;
  }

- Booking booking = bookingService.createBooking(userId, hotelId, promoCode);
+ Booking booking = grpcBookingService.createBooking(userId, hotelId, promoCode);
```

`listBookings()` remains unchanged and calls the native `bookingService`.

```bash
cd hotelio-fork/hotelio-monolith
./gradlew bootJar
cp build/libs/hotelio-monolith-1.0.0.jar ../tasks/monolith/hotelio-monolith-1.0.0.jar

cd ../tasks/task2
docker compose up -d --build --force-recreate monolith
```

Verify that listing no longer fails:

```bash
curl -i http://localhost:8084/api/bookings
```
