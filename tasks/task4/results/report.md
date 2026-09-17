# Отчёт по заданию 4

## Реализованные изменения

- Сервис `booking-service` собирается командой `docker build`.
- Сервис запускается на порту `8080`.
- Endpoint `/ping` возвращает `pong`.
- Endpoints `/healthz` и `/readyz` возвращают HTTP 200.
- При `ENABLE_FEATURE_X=true` сервис предоставляет endpoint `/feature`.

## Helm-чарт

- Deployment содержит `livenessProbe` и `readinessProbe` для `/ping`.
- Service имеет тип `ClusterIP` и направляет порт `80` на порт `8080`.
- Deployment использует `replicaCount`, параметры образа, переменные окружения и ресурсы из values-файлов.
- `values.staging.yaml` задаёт один экземпляр и `ENABLE_FEATURE_X=true`.
- `values.production.yaml` задаёт три экземпляра и `ENABLE_FEATURE_X=false`.

## CI/CD

- `.gitlab-ci.yml` содержит стадии `build`, `test`, `deploy` и `tag`.
- Стадия `build` собирает Docker-образ.
- Стадия `test` запускает контейнер, проверяет `/ping` и удаляет контейнер.
- Стадия `deploy` загружает образ в Minikube и обновляет Helm release.
- Стадия `tag` создаёт Git-тег с timestamp.

## Проверка

- `gitlab-ci-local build test deploy tag` завершилась успешно.
- Pod `booking-service` находится в состоянии `Running`.
- Service `booking-service` имеет тип `ClusterIP`.
- Проверка `/ping` через port-forward вернула `pong`.
- `check-dns.sh` вернул `pong` из отдельного Pod внутри Minikube.
