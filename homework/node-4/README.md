# Workout Logger API

## О сервисе

Данный API позволяет пользователям отслеживать свои тренировки посредством управления упражнениями, блоками тренировок, шаблонами тренировок и самими тренировочными сессиями. Пользователи могут добавлять упражнения, блоки, шаблоны, а также начинать и заканчивать тренировочные сессии.

## Функции

- **Управление пользователями**: Регистрация, вход в систему и управление профилями пользователей.
- **Управление упражнениями**: Создание, чтение, обновление и удаление упражнений.
- **Блоки тренировок**: Создание, чтение, обновление и удаление блоков упражнений с указанием количества повторений и подходов.
- **Шаблоны тренировок**: Создание шаблонов, состоящих из нескольких блоков тренировок.
- **Тренировочные сессии**: Начало и завершение сессий с логированием детальной информации по упражнениям.

## Модель данных

### Пользователь

- **id**: UUID
- **username**: Строка
- **email**: Строка
- **created_at**: Timestamp
- **updated_at**: Timestamp

### Упражнение

- **id**: UUID
- **name**: Строка
- **description**: Строка
- **type**: Строка (например, кардио, силовое, гибкость)
- **created_at**: Timestamp
- **updated_at**: Timestamp

### Блок тренировок

- **id**: UUID
- **name**: Строка
- **exercises**: Список упражнений
- **created_at**: Timestamp
- **updated_at**: Timestamp

### Шаблон тренировки

- **id**: UUID
- **name**: Строка
- **workout_blocks**: Список блоков
- **created_at**: Timestamp
- **updated_at**: Timestamp

### Тренировочная сессия

- **id**: UUID
- **user_id**: UUID
- **workout_template_id**: UUID
- **exercises**: Список с ключами `exercise_id`, `sets: {weight?: number, reps?: number, time?: number, distance?: number}` и `notes`
- **started_at**: Timestamp
- **ended_at**: Timestamp
- **created_at**: Timestamp
- **updated_at**: Timestamp
