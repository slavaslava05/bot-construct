# BotConstruct

Веб-конструктор Telegram-ботов: сценарий собирается в UI, PHP генерирует Node.js-скрипт (`node-telegram-bot-api`), деплой на VPS через SSH + PM2.

**Стек:** PHP, MySQL, jQuery, Node.js.

## Запуск

1. Скопировать `php/config.local.example.php` → `php/config.local.php`, указать БД и SSH.
2. Развернуть на PHP-хостинге с расширением `ssh2`.
3. Открыть `index.php` — регистрация и вход, редактор в `workspace/`.

Секреты и сгенерированные боты в репозиторий не коммитятся (`config.local.php`, `workspace/bots/`).

## Структура

- `index.php` — лендинг, auth
- `workspace/` — редактор ботов
- `workspace/php/save_bot.php` — генерация `index.js`
- `workspace/ssh_query/` — старт/стоп бота на сервере

Демо (если доступно): http://slava00000.beget.tech/BotConstruct/

![screenshot](https://github.com/user-attachments/assets/1ab53404-5d44-4259-8393-0dc905146ea9)

![screenshot](https://github.com/user-attachments/assets/a5562088-59b3-43ea-88cc-422746755780)
