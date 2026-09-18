# Задание 5. Управление трафиком с Istio

Фактическая реализация находится в папке [_implementation/task5](../../_implementation/task5/). В ней находятся Helm-чарты, Istio-манифесты, Caddyfile и проверочные скрипты.

## Результаты

Находтся в текущей папке.

- [report.md](results/report.md) — описание изменений, решений и схемы маршрутизации.
- [values.v1.yaml](results/values.v1.yaml) — конфигурация Helm для версии v1.
- [values.v2.yaml](results/values.v2.yaml) — конфигурация Helm для версии v2.
- [virtual-service.yaml](results/virtual-service.yaml) — Gateway, feature-flag-маршрут и канареечное распределение 90/10.
- [destination-rule.yaml](results/destination-rule.yaml) — subsets, Circuit Breaking и политики для version-specific Service.
- [envoy-filter.yaml](results/envoy-filter.yaml) — преобразование `X-Feature-Enabled: true` во внутренний заголовок маршрутизации v2.
- [caddy/](results/caddy/) — Helm-чарт Caddy для fallback с v1 на v2.
- [logs/](results/logs/) — логи проверок Istio, canary, fallback и feature flag.
