# Результаты Задачи 1

[ADR-001](ADR-001-task-1.ru.md) описывает целевую архитектуру Hotelio, ключевые проблемы и варианты решений, а также начало миграции с выносом HotelService по Strangler Fig.

## Диаграммы

- [Системный контекст целевого перехода](diagrams/.svg/90-01-target.context.c4.ru.svg) — [Исходный код](diagrams/90-01-target.context.c4.ru.puml)
- [Контейнеры целевой системы](diagrams/.svg/90-02-target.container.c4.ru.svg) — [Исходный код](diagrams/90-02-target.container.c4.ru.puml)
- [Контейнеры при выносе HotelService](diagrams/.svg/01-task-1.container.c4.ru.svg) — [Исходный код](diagrams/01-task-1.container.c4.ru.puml)
- [Компоненты при выносе HotelService](diagrams/.svg/02-task-1.component.c4.ru.svg) — [Исходный код](diagrams/02-task-1.component.c4.ru.puml)
- [Классы HotelService в процессе выноса](diagrams/.svg/03-task-1-during-extraction.class.ru.svg) — [Исходный код](diagrams/03-task-1-during-extraction.class.ru.puml)

## Проверка

[Лог запуска `hotelio-tester`](./test-log.txt)
