-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июн 17 2026 г., 02:22
-- Версия сервера: 8.0.19
-- Версия PHP: 7.4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `demo-me`
--

-- --------------------------------------------------------

--
-- Структура таблицы `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `room` enum('Аудитория','Коворкинг','Кинозал') NOT NULL,
  `date` date NOT NULL,
  `payment_method` enum('Наличные','Банковская карта','Безналичный расчёт','') NOT NULL,
  `status` enum('Новая','Мероприятие назначено','Мероприятие завершено','') NOT NULL DEFAULT 'Новая',
  `review` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `room`, `date`, `payment_method`, `status`, `review`, `created_at`) VALUES
(1, 1, 'Аудитория', '2026-06-30', 'Безналичный расчёт', 'Новая', NULL, '2026-06-16 18:26:19'),
(2, 1, 'Аудитория', '2026-06-26', 'Наличные', 'Новая', NULL, '2026-06-16 18:34:05'),
(3, 1, 'Кинозал', '2026-06-23', 'Банковская карта', 'Новая', NULL, '2026-06-16 18:34:20'),
(4, 1, 'Коворкинг', '2026-06-30', 'Банковская карта', 'Мероприятие завершено', 'cvbnfhngh', '2026-06-16 18:56:50'),
(5, 1, 'Аудитория', '2026-06-29', 'Наличные', 'Мероприятие завершено', NULL, '2026-06-16 19:05:12'),
(6, 1, 'Коворкинг', '2026-06-30', 'Банковская карта', 'Мероприятие завершено', 'ыввмав', '2026-06-16 19:07:07');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `login` varchar(100) NOT NULL,
  `password` text NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `full_name`, `phone`, `email`, `login`, `password`, `role`) VALUES
(1, 'Юров Да', '23443534645', 'iur@ya.ru', 'adminas', '$2b$10$2ZvXpM5cAqMzGs4AZ92q9uAtxvAGtT4b2W0/NZL3j/uKdySAdKoCy', 'user'),
(18, 'Администратор', '00000000000', 'admin@conf.rf', 'Admin26', '$2b$10$d1.5a6N3NFTuEjSCDkfgaeY6dJn4pJlMD/VwYPzpxzB5x1tC4Qzbi', 'admin');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `bookings`
--
ALTER TABLE `bookings`
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `login` (`login`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
