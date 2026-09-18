# Результаты задания 3

Полная запускаемая реализация находится в [директории реализации задания 3](../../../_implementation/task3/README.md).

В этой директории собраны отчёт и артефакты успешной работы реализации.

- [changes-report.md](changes-report.md) — описание внесённых изменений, расположение исходного кода и выполненные проверки.
- [all-containers-built.log](all-containers-built.log) — вывод сборки и запуска всех контейнеров через Docker Compose.
- [docker-ps.log](docker-ps.log) — список работающих контейнеров и опубликованных портов.
- [playground-success.png](playground-success.png) — успешный GraphQL-запрос из Playground через Gateway с заголовком `userid: user1`.
- [playground-failure.png](playground-failure.png) — проверка ACL из Playground: пользователь `user2` не получает бронирования пользователя `user1`.
