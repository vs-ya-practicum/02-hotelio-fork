# Результаты задания 4

Инструкции по сборке, развёртыванию и проверке находятся в [README реализации](../../../_implementation/task4/readme.md).

## Файлы конфигурации

- [values.staging.yaml](values.staging.yaml) — staging-конфигурация Helm-чарта.
- [values.production.yaml](values.production.yaml) — production-конфигурация Helm-чарта.
- [.gitlab-ci.yml](.gitlab-ci.yml) — CI/CD-пайплайн.
- [report.md](report.md) — описание изменений, решений и результатов проверки.

## Скриншоты

- [curl-ping.png](screenshots/curl-ping.png) — успешный запрос к `/ping`.
- [check-dns.png](screenshots/check-dns.png) — проверка DNS внутри Minikube.
- [check-status.png](screenshots/check-status.png) — состояние развёртывания и Service.
- [kubernetes-status.png](screenshots/kubernetes-status.png) — вывод `kubectl get pods` и `kubectl get services`.

## Логи

- [docker-build.log](logs/docker-build.log) — успешная сборка Docker-образа.
- [docker-image-ls.log](logs/docker-image-ls.log) — локальный образ `booking-service`.
- [minikube-image-list.log](logs/minikube-image-list.log) — образ `booking-service` в Minikube.
