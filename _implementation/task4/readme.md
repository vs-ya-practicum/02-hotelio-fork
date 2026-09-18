# Задание 4. Автоматизация развёртывания и тестирования

## Требования

Установите Docker, Minikube, Helm, Node.js, npm и `gitlab-ci-local`.

Запустите Minikube с драйвером Docker:

```bash
minikube start --driver=docker
```

## Сборка и развёртывание

Выполняйте команды из каталога `./_implementation/task4`.

Соберите образ сервиса:

```bash
docker build -t booking-service:latest booking-service
```

Загрузите образ в Minikube:

```bash
minikube image load booking-service:latest
```

Разверните staging-конфигурацию:

```bash
helm upgrade --install booking-service helm/booking-service \
  --values helm/booking-service/values.staging.yaml
```

Для production используйте `helm/booking-service/values.production.yaml`.

## Проверка

Проверьте Pod и Service:

```bash
kubectl get pods -l app=booking-service
kubectl get services booking-service
```

В отдельном терминале выполните перенаправление порта:

```bash
kubectl port-forward svc/booking-service 8080:80
```

Проверьте endpoint `/ping`:

```bash
curl http://localhost:8080/ping
```

Проверьте DNS внутри кластера:

```bash
./check-dns.sh
```

Проверьте состояние развёртывания:

```bash
./check-status.sh
```

## Feature flag

`values.staging.yaml` передаёт `ENABLE_FEATURE_X=true`.

`values.production.yaml` передаёт `ENABLE_FEATURE_X=false`.

При значении `true` сервис предоставляет endpoint `/feature`.

## Локальная проверка CI/CD

Выполните команду:

```bash
gitlab-ci-local build test deploy tag
```
