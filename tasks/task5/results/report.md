# Описание изменений и решений

- Добавлены версии `booking-service` v1 и v2 с метками `version: v1` и `version: v2`.
- Настроен канареечный релиз: 90% запросов `GET /ping` направляются в Caddy, 10% — напрямую в v2.
- Добавлен Caddy как fallback-прокси: v1 используется как основной upstream, v2 — как резервный при недоступности v1 и при ответах 500, 502, 503 или 504.
- Созданы отдельные Service: `booking-service-v1` и `booking-service-v2`.
- Сохранена маршрутизация feature flag: заголовок `X-Feature-Enabled: true` направляет запрос в v2.
- Добавлены DestinationRule для `booking-service-v1` и `booking-service-v2` с настройками Circuit Breaking; retry настроен в VirtualService.
- Проверены установка Istio, инъекция sidecar, канареечное распределение, fallback и feature flag.

## Схема маршрутизации через Caddy

```text
Клиент
  │
  ▼
Istio Ingress Gateway
  ├─ X-Feature-Enabled: true → EnvoyFilter → booking-service v2
  │
  └─ GET /ping
       ├─ 90% → Caddy → booking-service-v1
       │                    ├─ успешный ответ → ответ v1
       │                    └─ v1 недоступен или отвечает 500/502/503/504 → booking-service-v2
       └─ 10% → booking-service v2
```

## Изменение скрипта fallback

Скрипт `check-fallback.sh` изменён, потому что прежняя версия выводила сообщение об успешном fallback при ошибке `curl`, например при недоступности локального порта. Новая версия завершает проверку с ошибкой при недоступном маршруте и считает fallback успешным только при ответе `pong v2` после остановки v1.
